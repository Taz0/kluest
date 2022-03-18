// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TokenERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint initialKTokens) ERC20(name, symbol) {
        // Mint initialTokens tokens to msg.sender
        // Similar to how 1 dollar = 100 cents, 1 token = 1 * (10 ** decimals)
        _mint(msg.sender, initialKTokens * 1000 * 10**uint(decimals()));
    }
}
