// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract KluestToken is ERC20, ERC20Burnable {
    constructor(uint256 _initialSupply) ERC20("KTests", "KLU") {
        _mint(msg.sender, _initialSupply);
    }
}
