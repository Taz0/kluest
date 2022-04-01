// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "../../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Context.sol";

contract Kluest1155 is Context, Ownable, ERC1155Supply {
    mapping(address => bool) usersAirdropped;
    mapping(address => uint256) userTLOSBalances;

    // Mapping from token ID to account balances
    mapping(address => uint256[]) public itemsListByUser;

    uint256 public constant KTT = 0;
    uint16 private constant MaximumMilliKTTsChest = 50000; // 50 KTTs
    uint256 private constant InitialAirdropEther = 50 ether;

    constructor(uint256 _initialKSupply)
        ERC1155("https://kluest.com/pics/{id}.jpg")
    {
        //        MaximumKTTsChest = _maximumKTTsChest;
        //        InitialAirdrop = _initialAirdrop;
        _mint(_msgSender(), KTT, _initialKSupply * (1000 ether), "");
    }

    ///---------------------------------------------------------------
    // Rewards
    function initialAirdrop(address user) public onlyOwner {
        require(
            !usersAirdropped[user],
            "User address has been already air dropped"
        );

        safeTransferFrom(owner(), user, KTT, InitialAirdropEther, "");
        usersAirdropped[user] = true;
    }

    // The user opens a chest and gets KTTS as a reward
    function chestReward(address user, uint16 amountMillis) external onlyOwner {
        require(
            amountMillis <= MaximumMilliKTTsChest,
            "The amount of the reward exceeds the maximum allowed"
        );
        uint256 totalAmount = uint256(amountMillis) * (1 ether / 1000);
        safeTransferFrom(owner(), user, KTT, totalAmount, "");
    }

    ///---------------------------------------------------------------
    // User buying KTTs with TLOS operations, two steps

    // TLOS <=> KTTS Swapping functions: Two stepa
    // First step: The user buys KTTs and transfer them to the contract.
    function purchaseKTTsWithTLOS(uint32 amountMilliTlos, uint32 amountMilliKTTs) external payable {        
        require(msg.value > 0, "Please, show me the money!");
        require(msg.value == uint256(amountMilliTlos) * (1 ether / 1000), "Please send the correct amount of TLOS");
        require(amountMilliKTTs > 0, "Please, add some KTTs");
        userTLOSBalances[_msgSender()] += msg.value;
    }

    // Second step: The server converts the user balance to KTTs
    function convertTLOStoKTTs(address user) external onlyOwner {
        uint256 balance = userTLOSBalances[user];
        require(balance > 0, "User has no TLOS balance");
        safeTransferFrom(owner(), user, KTT, balance, "");
        userTLOSBalances[user] = 0;
    }

    // How many TLOs are in the contract (written for testing purposes)
    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Transfer all the TLOS store in the contract to the owner's wallet
    function withdrawToOwner(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greather than 0.");
        payable(address(owner())).transfer(amount);
    }

    ///---------------------------------------------------------------
    // NFTs or items operations
    function purchaseItem(address user, uint256 id, uint32 amountMilliKtts) public onlyOwner {
        require(id != 0, "Cannot purchase KTTs");
        uint256 ktts = uint256(amountMilliKtts) * (1 ether / 1000);
        require(balanceOf(user, KTT) >= ktts, "Not enough balance");

        _safeTransferFrom(user, owner(), 0, ktts, "");

        _mint(user, id, 1, "");
        
        // Add the item to the user's list
        uint256[] storage items = itemsListByUser[user];
        items.push(id);
    }

    // Step2: Give the item to the user
    function rewardItem(uint256 id, address user) external onlyOwner {
        require(id != 0, "Cannot reward KTTs");
        // Mint the NFT and give it to the user
        _mint(user, id, 1, "");
        // Add the item to the user's list
        uint256[] storage items = itemsListByUser[user];
        items.push(id);
    }

    function userItems(address user) external view onlyOwner returns (uint256[] memory) {
        return itemsListByUser[user];
    }

    // function removeItemFromUser(address user, uint256 id) external onlyOwner {
    //     uint256[] storage items = itemsListByUser[user];
    //     items.remove(id);
    // }

}
