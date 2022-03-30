// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "../../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Kluest1155 is ERC1155Supply, Ownable {
    mapping(address => bool) usersAirdropped;
    mapping(address => uint256) userTLOSBalances;

    uint256 public constant KTT = 0;
    uint256 private constant MaximumKTTsChestEther = 50 ether;
    uint256 private constant InitialAirdropEther = 50 ether;

    constructor(uint256 _initialKSupply)
        ERC1155("https://kluest.com/api/item/{id}.json")
    {
        //        MaximumKTTsChest = _maximumKTTsChest;
        //        InitialAirdrop = _initialAirdrop;
        _mint(msg.sender, KTT, _initialKSupply * 1000 * 10**18, "");
    }

    // Rewards
    function initialAirdrop(address user) public onlyOwner {
        require(
            !usersAirdropped[user],
            "User address has been already air dropped"
        );

        safeTransferFrom(owner(), user, KTT, InitialAirdropEther, "");
        usersAirdropped[user] = true;
    }

    function chestReward(address user, uint256 amountMillis) external onlyOwner {
        require(
            amountMillis * 1000 <= MaximumKTTsChestEther,
            "The amount of the reward exceeds the maximum allowed"
        );
        uint256 totalAmount = amountMillis * (1 ether / 1000);
        safeTransferFrom(owner(), user, KTT, totalAmount, "");
    }

    // User buying KTTs with TLOS operations, two steps

    // First: The user buys KTTs and transfer them to our contract.
    // TLOS <=> KTTS Swapping functions
    // The ratio is 1 TLO == 1 KTT, so if the value = 30TLOS then you get 30KTTs
    function buyWithTLOS() external payable {
        require(msg.value > 0, "Please, show me the money!");
        userTLOSBalances[msg.sender] += msg.value;
    }

    // Second: The server converts the user balance to KTTs
    function convertTLOStoKTTs(address user) external onlyOwner {
        uint256 balance = userTLOSBalances[user];
        require(balance > 0, "User has no TLOS balance");
        safeTransferFrom(owner(), user, KTT, balance, "");
        userTLOSBalances[user] = 0;
    }

    // How many TLOs are in our contract (written for testing purposes)
    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdrawToOwner(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greather than 0.");
        payable(address(owner())).transfer(amount);
    }
}
