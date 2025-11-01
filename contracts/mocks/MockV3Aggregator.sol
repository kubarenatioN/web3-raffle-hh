// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {MockV3Aggregator as _MockV3Aggregator} from "@chainlink/contracts/src/v0.8/shared/mocks/MockV3Aggregator.sol";

contract MockV3Aggregator is _MockV3Aggregator {
    constructor(
        uint8 _decimals,
        int256 _initialAnswer
    ) _MockV3Aggregator(_decimals, _initialAnswer) {}
}
