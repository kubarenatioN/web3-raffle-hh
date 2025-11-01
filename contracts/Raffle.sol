// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

error Raffle__NotEnoughFeeSent(uint256 sent, uint256 feePrice);
error Raffle__OnlyOwner(address sender);
error Raffle__InvalidDataFeedAnswer(int256 answer);

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

    uint256 public s_totalBalance = 0;

    /// Entrance fee in USD
    uint256 public s_entranceFee;

    address public immutable i_owner;

    constructor(uint256 _entranceFeeUsd, address _dataFeed) {
        s_entranceFee = _entranceFeeUsd;
        i_owner = msg.sender;
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
        price =
            (s_entranceFee * 10 ** 18) /
            (uint256(answer) / (10 ** decimals));
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

    // TODO: Implement
    function getRandomWinner() external {}

    function updateEntranceFee(uint256 _val) public onlyOwner {
        uint256 oldFee = s_entranceFee;
        s_entranceFee = _val;

        emit RaffleEntranceFeeUpdated(oldFee, s_entranceFee);
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Raffle__OnlyOwner(msg.sender);
        }
        _;
    }
}
