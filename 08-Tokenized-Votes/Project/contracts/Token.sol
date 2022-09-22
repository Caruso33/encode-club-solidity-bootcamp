// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title A voting token that inherits from the ERC20Votes contract among others
/// @author Encode Club
/// @notice You can use this contract for learning about tokenized votes in Solidity
/// @dev Enjoy learning 😎
/// @custom:learning This is a contract with learning purposes only.
contract MyToken is ERC20, AccessControl, ERC20Permit, ERC20Votes {
    /// @dev Constant to identify the minter role
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @dev We hardcode the token name and ticker. Everything else is inherited
    constructor() ERC20("MyToken", "MTK") ERC20Permit("MyToken") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /// @notice Mint new tokens. Increases the total supply
    /// @dev Only the contract deployer (who holds the minter role) can mint
    /// @param to Address we are sending the minted tokens to
    /// @param amount Amount of tokens to mint
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // The following functions are overrides required by Solidity.

    /// Hook that is called after any transfer of tokens. This includes minting and burning.
    /// @inheritdoc ERC20
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    /// @inheritdoc ERC20
    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    /// Destroys `amount` tokens from `account`, reducing the total supply.
    /// @inheritdoc ERC20
    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}
