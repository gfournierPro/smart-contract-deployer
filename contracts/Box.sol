// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract Box is Initializable, UUPSUpgradeable {
    uint256 private _value;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(uint256 initialValue) public initializer {
        _value = initialValue;
    }

    function getValue() public view returns (uint256) {
        return _value;
    }

    function setValue(uint256 newValue) public {
        _value = newValue;
    }

    function _authorizeUpgrade(address newImplementation) internal override {}
}
