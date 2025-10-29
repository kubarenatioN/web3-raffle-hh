// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

error Raffle__NotEnoughFeeSent();
error Raffle__OnlyOwner(address sender);

contract Raffle {
    event RaffleEntered(
        address indexed sender,
        uint256 amount,
        uint256 totalAmount
    );

    enum State {
        OPEN,
        CLOSED // do I need this?
    }

    State public s_state = State.OPEN;

    mapping(address => uint256) public s_playersMap; // probably unused?
    address[] public s_playersList;

    uint256 public s_totalBalance = 0;

    /// Entrance fee in USD
    uint256 public s_entranceFee;

    address public immutable i_owner;

    constructor(uint256 _entranceFee) {
        s_entranceFee = _entranceFee;
        i_owner = msg.sender;
    }

    function enter() public payable {
        address _sender = msg.sender;
        uint256 _value = msg.value;
        if (_value < s_entranceFee) {
            revert Raffle__NotEnoughFeeSent();
        }

        s_playersList.push(_sender);
        s_playersMap[_sender] += _value;
        s_totalBalance += _value;

        emit RaffleEntered(_sender, _value, s_playersMap[_sender]);
    }

    // TODO: Implement
    function getRandomWinner() external {}

    function updateEntranceFee(uint256 _val) public onlyOwner {
        s_entranceFee = _val;
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Raffle__OnlyOwner(msg.sender);
        }
        _;
    }
}
