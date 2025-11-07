// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {VRFCoordinatorV2_5Mock as _VRFCoordinatorV2_5Mock} from "@chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2_5Mock.sol";

contract VRFCoordinatorV2Mock is _VRFCoordinatorV2_5Mock {
    constructor(
        uint96 _baseFee,
        uint96 _gasPrice,
        int256 _weiPerUnitLink
    ) _VRFCoordinatorV2_5Mock(_baseFee, _gasPrice, _weiPerUnitLink) {}
}
