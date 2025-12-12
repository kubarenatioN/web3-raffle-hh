// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {PaginationLib} from "./PaginationLib.sol";

error Raffle__NotEnoughFeeSent(uint256 sent, uint256 feePrice);
error Raffle__OnlyOwner(address sender);
error Raffle__InvalidDataFeedAnswer(int256 answer);

error Raffle__NotEnoughTimePassedToDraw(uint256 timePassed);
error Raffle__NotEnoughUniquePlayersToDraw(uint256 uniquePlayersCount);
error Raffle__VRFRequestIdNotMatch(uint256 expectedId, uint256 receivedId);
error Raffle__WaitingForCalculation();

error Raffle__TooMuchWithdrawAmount(uint256 amount, address sender);
error Raffle__ErrorWhileWithdraw();

error Raffle__TooLargePageSize(uint256 pageSize);

contract Raffle is VRFConsumerBaseV2Plus {
    struct RoundResult {
        uint256 round;
        address winner;
        uint256 amount;
    }

    struct PageMetadata {
        uint256 currentPage;
        uint256 pageSize;
        uint256 totalItems;
        uint256 totalPages;
        bool hasNextPage;
        bool hasPreviousPage;
    }

    event RaffleEntered(address indexed sender, uint256 amount);
    event RaffleEntranceFeeUpdated(uint256 oldFee, uint256 newFee);
    event RaffleRandomWordsRequested(uint256 indexed reqId, uint256 round);
    event RaffleWinnerPicked(
        address winner,
        uint256 round,
        uint256 fundsDrawn,
        uint256 participantsCount
    );
    event RaffleWinnerFundsSent(address receiver, uint256 amount);
    event RaffleOwnerFundsSent(address owner, uint256 amount);

    enum State {
        OPEN,
        CALCULATING
    }

    State public s_state = State.OPEN;

    AggregatorV3Interface internal immutable i_dataFeed;

    address[] public s_playersList;
    address[] public s_uniquePlayersList;

    RoundResult[] public s_roundsHistory; // winner to win funds amount
    mapping(uint256 => address) public winners; // round number to winner address
    mapping(address => uint256) public s_winnerBalance; // balances of winners

    uint256 public s_recentDrawAt;

    uint256 public s_waitingRequestId;

    uint256 public s_roundsCount = 0;

    uint256 public s_totalBalance = 0;

    uint256 public s_totalFundsDrawn = 0;

    uint256 public s_ownerCommission = 0;

    /// Entrance fee in USD
    uint256 public s_entranceFee;

    uint256 public s_subscriptionId;

    // 500 gwei
    bytes32 public immutable i_keyHash =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
    uint32 callbackGasLimit = 500000; // Increased for complex operations
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;

    address public immutable i_owner;

    /// interval in seconds
    uint256 public immutable i_drawInterval;

    constructor(
        uint256 _entranceFeeUsd,
        address _dataFeed,
        uint256 _drawInterval,
        address _vrfCoordinator,
        uint256 _subId
    ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
        s_entranceFee = _entranceFeeUsd;
        i_owner = msg.sender;
        i_drawInterval = _drawInterval;
        s_recentDrawAt = 0;
        i_dataFeed = AggregatorV3Interface(_dataFeed);
        s_subscriptionId = _subId;
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

        emit RaffleEntered(_sender, _value);
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
        uint256[] calldata randomWords
    ) internal override {
        if (s_waitingRequestId != requestId) {
            revert Raffle__VRFRequestIdNotMatch(s_waitingRequestId, requestId);
        }

        if (s_playersList.length == 0) {
            revert Raffle__NotEnoughUniquePlayersToDraw(0);
        }

        uint256 index = randomWords[0] % s_playersList.length;
        address winner = s_playersList[index];

        winners[s_roundsCount] = winner;

        // clear arrays
        delete s_playersList;
        delete s_uniquePlayersList;

        s_state = State.OPEN;

        uint256 round = s_roundsCount;
        s_roundsCount += 1;

        uint256 winnerAmount = (s_totalBalance * 80) / 100;
        uint256 ownerCommissionAmount = s_totalBalance - winnerAmount;
        uint256 roundFundsDrawn = s_totalBalance;
        uint256 roundParticipantsCount = s_uniquePlayersList.length;

        s_winnerBalance[winner] += winnerAmount;
        s_ownerCommission += ownerCommissionAmount;
        s_totalFundsDrawn += s_totalBalance;
        s_totalBalance = 0;

        RoundResult memory result = RoundResult({
            round: round,
            winner: winner,
            amount: winnerAmount
        });
        s_roundsHistory.push(result);

        s_recentDrawAt = block.timestamp;
        s_waitingRequestId = 0;

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
        return s_roundsHistory.length;
    }

    function getDataFeedAddress() public view returns (address) {
        return address(i_dataFeed);
    }

    // ============ Pagination Functions ============

    function getRoundsHistoryPage(
        uint256 page,
        uint256 pageSize
    )
        public
        view
        returns (
            RoundResult[] memory items,
            PaginationLib.PageMetadata memory metadata
        )
    {
        if (pageSize >= 100) {
            revert Raffle__TooLargePageSize(pageSize);
        }

        uint256 totalItems = s_roundsHistory.length;
        metadata = PaginationLib.calculatePageMetadata(
            totalItems,
            page,
            pageSize
        );

        (uint256 startIndex, uint256 endIndex) = PaginationLib.getPageIndices(
            page,
            pageSize,
            totalItems
        );

        uint256 itemsCount = endIndex - startIndex;
        items = new RoundResult[](itemsCount);

        for (uint i = 0; i < itemsCount; i++) {
            items[i] = s_roundsHistory[startIndex + i];
        }
    }

    /**
     * @notice Get paginated unique players list
     * @param page Page number (0-indexed)
     * @param pageSize Number of items per page
     * @return players Array of unique player addresses
     * @return metadata Pagination metadata
     */
    function getUniquePlayersPage(
        uint256 page,
        uint256 pageSize
    )
        public
        view
        returns (address[] memory players, PageMetadata memory metadata)
    {
        if (pageSize >= 100) {
            revert Raffle__TooLargePageSize(pageSize);
        }

        if (pageSize == 0) {
            revert();
        }

        uint256 totalItems = s_uniquePlayersList.length;
        uint256 totalPages = (totalItems + pageSize - 1) / pageSize;

        if (totalPages > 0) {
            if (page >= totalPages) {
                revert();
            }
        }

        metadata = PageMetadata({
            currentPage: page,
            pageSize: pageSize,
            totalItems: totalItems,
            totalPages: totalPages,
            hasNextPage: totalPages > 0 && page < totalPages - 1,
            hasPreviousPage: page > 0
        });

        uint256 startIndex = page * pageSize;
        uint256 endIndex = startIndex + pageSize;
        if (endIndex > totalItems) {
            endIndex = totalItems;
        }

        uint256 size = endIndex - startIndex;
        players = new address[](size);

        for (uint256 i = 0; i < size; i++) {
            players[i] = s_uniquePlayersList[startIndex + i];
        }
    }
}
