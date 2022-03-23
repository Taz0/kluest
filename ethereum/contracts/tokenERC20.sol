// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

// In order to use it in remix delete "../../node_modules/. IE: import "@openzeppelin/contracts/access/Ownable.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TokenERC20 is ERC20, ERC20Burnable, Ownable {

    mapping (address => bool) usersAirdropped;

    constructor(string memory name, string memory symbol, uint initialKTokens) ERC20(name, symbol) {
        // Mint initialTokens tokens to msg.sender
        // Similar to how 1 dollar = 100 cents, 1 token = 1 * (10 ** decimals)
        // 1 ether is 10**18 decimals
        _mint(msg.sender, initialKTokens * 1000 ether);
    }

    function userAirdrop50(address user) public onlyOwner {
        require(!usersAirdropped[user], "User address has been already air dropped");
        ///TODO: Do it in two steps in node to 'await' for the allowance transaction, and then perform the safe transfer
        //SafeERC20.safeIncreaseAllowance(this, owner(), 50 * 10**uint(decimals()));
        //SafeERC20.safeTransferFrom(this, owner(), user, 50 * 10**uint(decimals()));
        transfer(user, 50 ether);
        usersAirdropped[user] = true;
    }
}
