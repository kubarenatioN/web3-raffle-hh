// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import {RaffleProxy} from "./RaffleProxy.sol";

contract RaffleProxyAdmin {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert();
        }
        _;
    }

    function _getAdmin(address _proxy) external view returns (address) {
        (bool success, bytes memory res) = _proxy.staticcall(
            abi.encodeCall(RaffleProxy.admin, ())
        );

        if (!success) {
            revert();
        }

        return abi.decode(res, (address));
    }

    function _getImplementation(
        address _proxy
    ) external view returns (address) {
        (bool success, bytes memory res) = _proxy.staticcall(
            abi.encodeCall(RaffleProxy.implementation, ())
        );

        if (!success) {
            revert();
        }

        return abi.decode(res, (address));
    }

    function changeAdmin(
        address payable _proxy,
        address _admin
    ) external onlyOwner {
        RaffleProxy(_proxy).changeAdmin(_admin);
    }

    function upgrade(
        address payable _proxy,
        address _implementation
    ) external onlyOwner {
        RaffleProxy(_proxy).upgradeTo(_implementation);
    }
}
