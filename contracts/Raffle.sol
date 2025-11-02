// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

error Raffle__NotEnoughFeeSent(uint256 sent, uint256 feePrice);
error Raffle__OnlyOwner(address sender);
error Raffle__InvalidDataFeedAnswer(int256 answer);
error Raffle__NotEnoughTimePassedToDraw(uint256 timePassed);

contract Raffle {
    event RaffleEntered(
        address indexed sender,
        uint256 amount,
        uint256 totalAmount
    );
    event RaffleEntranceFeeUpdated(uint256 oldFee, uint256 newFee);

    enum State {
        OPEN,
        CLOSED // do I need this?
    }

    State public s_state = State.OPEN;

    AggregatorV3Interface internal immutable i_dataFeed;

    mapping(address => uint256) public s_playersMap; // probably unused?
    address[] public s_playersList;

    mapping(address => uint256) winners;

    uint256 public recentDrawAt;

    uint256 public s_totalBalance = 0;

    /// Entrance fee in USD
    uint256 public s_entranceFee;

    address public immutable i_owner;

    /// interval in seconds
    uint256 public immutable i_drawInterval;

    constructor(
        uint256 _entranceFeeUsd,
        address _dataFeed,
        uint256 _drawInterval
    ) {
        s_entranceFee = _entranceFeeUsd;
        i_owner = msg.sender;
        i_drawInterval = _drawInterval;
        recentDrawAt = block.timestamp - 1; // set inital value
        i_dataFeed = AggregatorV3Interface(_dataFeed);
    }

    function enter() public payable {
        address _sender = msg.sender;
        uint256 _value = msg.value;
        uint256 _feePrice = getFeePriceEth();

        if (_value < _feePrice) {
            revert Raffle__NotEnoughFeeSent(_value, _feePrice);
        }

        s_playersList.push(_sender);
        s_playersMap[_sender] += _value;
        s_totalBalance += _value;

        emit RaffleEntered(_sender, _value, s_playersMap[_sender]);
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

    // TODO: remove later, debug
    function testFeePriceEth()
        public
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return i_dataFeed.latestRoundData();
    }

    function pickWinnerByOwner() external onlyOwner returns (address) {
        uint256 timePassed = timePassedSinceRecentDraw();
        if (timePassed < i_drawInterval) {
            revert Raffle__NotEnoughTimePassedToDraw(timePassed);
        }

        // pick a winner randomly
        // send money to a winner and commission to the Raffle owner
        return address(this); // debug
    }

    function pickWinner() external {
        // address winner = getRandomWinner();
    }

    // TODO: Implement
    function getRandomWinner() public {}

    function updateEntranceFee(uint256 _val) public onlyOwner {
        uint256 oldFee = s_entranceFee;
        s_entranceFee = _val;

        emit RaffleEntranceFeeUpdated(oldFee, s_entranceFee);
    }

    function timePassedSinceRecentDraw() public view returns (uint256) {
        return block.timestamp - recentDrawAt;
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Raffle__OnlyOwner(msg.sender);
        }
        _;
    }
}
