// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract TokenUpgradableV2 is ERC20Upgradeable, AccessControlUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant AUDIT_ROLE = keccak256("AUDIT_ROLE");
    bytes32 public someVariableNotConstant;
    uint256 public auditedSupply;

    function initialize() public initializer {
        __ERC20_init("TokenUpgradable", "TKN+");
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        someVariableNotConstant = keccak256("VARIABLE");
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(
            auditedSupply >= totalSupply(),
            "Supply is already bigger than the value from last audited report"
        );
        require(
            auditedSupply - totalSupply() >= amount,
            "Mint value is greater than what is available to be minted"
        );
        _mint(to, amount);
    }

    function auditReport(uint256 amount) public onlyRole(AUDIT_ROLE) {
        auditedSupply = amount;
    }
}
