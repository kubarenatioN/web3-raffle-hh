// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {VRFConsumerBaseV2Upgradeable} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Upgradeable.sol";
import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

error Raffle__NotEnoughFeeSent(uint256 sent, uint256 feePrice);
error Raffle__OnlyOwner(address sender);
error Raffle__InvalidDataFeedAnswer(int256 answer);

error Raffle__NotEnoughTimePassedToDraw(uint256 timePassed);
error Raffle__NotEnoughUniquePlayersToDraw(uint256 uniquePlayersCount);
error Raffle__VRFRequestIdNotMatch(uint256 expectedId, uint256 receivedId);
error Raffle__WaitingForCalculation();

error Raffle__TooMuchWithdrawAmount(uint256 amount, address sender);
error Raffle__ErrorWhileWithdraw();
error Raffle__ZeroAddress();

/**
 * @title ChainLink Raffle
 * @author Nick Kubarko
 * @notice Raffle contract that allows users to enter a raffle and pick a winner randomly.
 * @dev Uses ChainLink VRF to pick a winner randomly
 * @dev and ChainLink Data Feed to get the price of the entrance fee.
 */
contract Raffle is Initializable, VRFConsumerBaseV2Upgradeable {
    event RaffleEntered(
        address indexed sender,
        uint256 amount,
        uint256 indexed round
    );
    event RaffleEntranceFeeUpdated(uint256 oldFee, uint256 newFee);
    event RaffleDrawIntervalUpdated(uint256 previous, uint256 current);
    event RaffleRandomWordsRequested(uint256 indexed reqId, uint256 round);
    event RaffleWinnerPicked(
        address indexed winner,
        uint256 indexed round,
        uint256 fundsDrawn,
        uint256 participantsCount
    );
    event RaffleWinnerFundsSent(address indexed receiver, uint256 amount);
    event RaffleOwnerFundsSent(address owner, uint256 amount);

    enum State {
        OPEN,
        CALCULATING
    }

    string public constant AUTHOR = "Nick Kubarko";
    string public constant MY_GITHUB = "https://github.com/kubarenation";

    State public s_state;

    AggregatorV3Interface internal i_dataFeed;

    address[] public s_playersList;
    address[] public s_uniquePlayersList;

    mapping(uint256 => address) public s_winnerOfRound; // round number to winner address
    mapping(address => uint256) public s_winnerBalance; // balances of winners

    uint256 public s_recentDrawAt;

    uint256 public s_waitingRequestId;

    uint256 public s_roundsCount = 0;

    // total entered funds balance for the current round
    uint256 public s_totalBalance = 0;

    // total drawn funds amount for all time
    uint256 public s_totalFundsDrawn = 0;

    uint256 public s_ownerCommission = 0;

    // Entrance fee in USD
    uint256 public s_entranceFee;

    uint256 public s_subscriptionId;

    IVRFCoordinatorV2Plus public s_vrfCoordinator;

    bytes32 public i_keyHash;
    uint32 callbackGasLimit; // Increased for complex operations
    uint16 requestConfirmations;
    uint32 numWords;

    address public i_owner;

    // draw interval in seconds
    uint256 public i_drawInterval;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        uint256 _entranceFeeUsd,
        address _dataFeed,
        uint256 _drawInterval,
        address _vrfCoordinator,
        uint256 _subId
    ) public payable initializer {
        // Валидация входных параметров
        if (_dataFeed == address(0)) {
            revert Raffle__ZeroAddress();
        }
        if (_vrfCoordinator == address(0)) {
            revert Raffle__ZeroAddress();
        }

        i_owner = msg.sender;
        s_state = State.OPEN;

        // set VRF Coordinator address
        __VRFConsumerBaseV2_init(_vrfCoordinator);

        i_dataFeed = AggregatorV3Interface(_dataFeed);

        // initialize VRF Coordinator
        s_vrfCoordinator = IVRFCoordinatorV2Plus(_vrfCoordinator);

        // 500 gwei
        i_keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
        callbackGasLimit = 500000; // Increased for complex operations
        requestConfirmations = 3;
        numWords = 1;

        s_entranceFee = _entranceFeeUsd;
        i_drawInterval = _drawInterval;
        s_subscriptionId = _subId;
        s_recentDrawAt = 0;
    }

    modifier onlyOwner_() {
        if (msg.sender != i_owner) {
            revert Raffle__OnlyOwner(msg.sender);
        }
        _;
    }

    function enter() public payable {
        address _sender = msg.sender;
        uint256 _value = msg.value;
        uint256 _feePrice = getFeePriceEth();

        if (_value < _feePrice) {
            revert Raffle__NotEnoughFeeSent(_value, _feePrice);
        }

        bool alreadyIncludedOnce = false;
        address[] memory _u = s_uniquePlayersList;
        for (uint i = 0; i < _u.length; i++) {
            if (_u[i] == _sender) {
                alreadyIncludedOnce = true;
                break;
            }
        }

        if (!alreadyIncludedOnce) {
            s_uniquePlayersList.push(_sender);
        }
        s_playersList.push(_sender);
        s_totalBalance += _value;

        emit RaffleEntered(_sender, _value, s_roundsCount);
    }

    function getFeePriceEth() public view returns (uint256 price) {
        (, int256 answer, , , ) = i_dataFeed.latestRoundData();
        uint8 decimals = i_dataFeed.decimals();

        if (answer <= 0) {
            revert Raffle__InvalidDataFeedAnswer(answer);
        }

        // in Wei
        price = s_entranceFee * ((1 * 10 ** (18 + decimals)) / uint256(answer));
    }

    function pickWinnerByOwner() public onlyOwner_ returns (uint256 requestId) {
        if (s_state == State.CALCULATING) {
            revert Raffle__WaitingForCalculation();
        }

        uint256 timePassed = timePassedSinceRecentDraw();
        if (timePassed < i_drawInterval) {
            revert Raffle__NotEnoughTimePassedToDraw(timePassed);
        }

        // add conditions and reverts
        // e.g. min players count >= 2
        uint256 uniquePlayers = s_uniquePlayersList.length;
        if (uniquePlayers < 2) {
            revert Raffle__NotEnoughUniquePlayersToDraw(uniquePlayers);
        }

        // pick a winner randomly
        // send money to a winner and commission to the Raffle owner
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        s_waitingRequestId = requestId;
        s_state = State.CALCULATING;
        emit RaffleRandomWordsRequested(requestId, s_roundsCount);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        if (s_waitingRequestId != requestId) {
            revert Raffle__VRFRequestIdNotMatch(s_waitingRequestId, requestId);
        }

        if (s_playersList.length == 0) {
            revert Raffle__NotEnoughUniquePlayersToDraw(0);
        }

        uint256 index = randomWords[0] % s_playersList.length;
        address winner = s_playersList[index];

        s_winnerOfRound[s_roundsCount] = winner;

        uint256 round = s_roundsCount;
        uint256 winnerAmount = (s_totalBalance * 80) / 100;
        uint256 ownerCommissionAmount = s_totalBalance - winnerAmount;
        uint256 roundFundsDrawn = s_totalBalance;
        uint256 roundParticipantsCount = s_uniquePlayersList.length;

        // clear arrays
        delete s_playersList;
        delete s_uniquePlayersList;

        s_state = State.OPEN;
        s_winnerBalance[winner] += winnerAmount;
        s_ownerCommission += ownerCommissionAmount;
        s_totalFundsDrawn += roundFundsDrawn;
        s_roundsCount += 1;

        s_recentDrawAt = block.timestamp;
        s_waitingRequestId = 0;
        s_totalBalance = 0;

        emit RaffleWinnerPicked(
            winner,
            round,
            roundFundsDrawn,
            roundParticipantsCount
        );
    }

    function withdraw(uint256 amount) public {
        if (amount > s_winnerBalance[msg.sender]) {
            revert Raffle__TooMuchWithdrawAmount(amount, msg.sender);
        }

        s_winnerBalance[msg.sender] -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert Raffle__ErrorWhileWithdraw();
        }

        emit RaffleWinnerFundsSent(msg.sender, amount);
    }

    function withdrawOwner() public onlyOwner_ {
        uint256 amount = s_ownerCommission;

        s_ownerCommission = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert Raffle__ErrorWhileWithdraw();
        }

        emit RaffleOwnerFundsSent(i_owner, amount);
    }

    function updateEntranceFee(uint256 _val) public onlyOwner_ {
        uint256 oldFee = s_entranceFee;
        s_entranceFee = _val;

        emit RaffleEntranceFeeUpdated(oldFee, s_entranceFee);
    }

    function updateDrawInterval(uint256 _seconds) public onlyOwner_ {
        uint256 _oldInterval = i_drawInterval;
        i_drawInterval = _seconds;

        emit RaffleDrawIntervalUpdated(_oldInterval, i_drawInterval);
    }

    function timePassedSinceRecentDraw() public view returns (uint256) {
        return block.timestamp - s_recentDrawAt;
    }

    function getPlayerSlotsCount() public view returns (uint256) {
        return s_playersList.length;
    }

    function getUniquePlayersCount() public view returns (uint256) {
        return s_uniquePlayersList.length;
    }

    function getTotalFundsDrawn() public view returns (uint256) {
        return s_totalFundsDrawn;
    }

    function getTotalDrawsCount() public view returns (uint256) {
        return s_roundsCount;
    }

    function getDataFeedAddress() public view returns (address) {
        return address(i_dataFeed);
    }

    function getPriceFeedAnswer() public view returns (int256) {
        (, int256 answer, , , ) = i_dataFeed.latestRoundData();
        return answer;
    }
}
