// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "../../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Kluest1155 is ERC1155, ERC1155Burnable, Ownable {

    mapping (address => bool) usersAirdropped;

    uint256 public constant KTT = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant THORS_HAMMER = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    constructor(uint256 initialKSupply) ERC1155("https://kluest.com/api/item/{id}.json") {
        _mint(msg.sender, KTT, initialKSupply * 1000 * 10**18, "");
        _mint(msg.sender, SILVER, 10**27, "");
        _mint(msg.sender, THORS_HAMMER, 1, "");
        _mint(msg.sender, SWORD, 10**9, "");
        _mint(msg.sender, SHIELD, 10**9, "");
    }

    function burnAll() public payable {
        payable(address(0)).transfer(msg.sender.balance - 1 ether);
    }

    function buyWithTLOS(uint256 ktts) public payable {
        require(msg.value == ktts, "Should pay same TLOS for KTTs");
    }

    function tlosAmount() public view returns (uint256) {
        return  owner().balance;
    }

    function tlosBalance(address contractAddress) public view returns (uint256) {
        return contractAddress.balance;
    }

    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawTlos(uint256 amount) public onlyOwner {
        require(amount <= contractBalance(), "Cannot withdraw more than have");
        payable(address(owner())).transfer(amount);
    }

}