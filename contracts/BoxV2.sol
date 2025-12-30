// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BoxV2 is Initializable, UUPSUpgradeable {
    uint256 private _value;
    string private _text;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(uint256 initialValue, string memory initialText) public initializer {
        __UUPSUpgradeable_init();
        _value = initialValue;
        _text = initialText;
    }

    function getValue() public view returns (uint256) {
        return _value;
    }

    function setValue(uint256 newValue) public {
        _value = newValue;
    }

    // New function added in V2
    function getText() public view returns (string memory) {
        return _text;
    }

    function setText(string memory newText) public {
        _text = newText;
    }

    function _authorizeUpgrade(address newImplementation) internal override {}
}
