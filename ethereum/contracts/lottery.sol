// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager;
    address payable[] public players;
    uint256 public participation;
    bool public finished;
    uint256 public paymentDiff = 0;

    // Initializing the state variable
    uint256 private randNonce = 0;
    uint256 private winnerIndex;

    constructor(uint256 _participation) {
        participation = _participation;
        manager = msg.sender;
    }

    function getAllPlayers() public view returns (address[] memory) {
        address[] memory allPlayers = new address[](players.length);
        for (uint256 i = 0; i < players.length; i++) {
            allPlayers[i] = players[i];
        }
        return allPlayers;
    }

    function getPot() public view returns(uint) {
        return address(this).balance;
    }

    function enter() public payable {
        // Add a participant to the lottery
        require(!finished, "Lottery has ended");
        require(
            msg.sender != manager,
            "The manager cannot participate in the lottery"
        );

        for (uint256 i = 0; i < players.length; i++) {
            require(
                msg.sender != players[i],
                "A player cannot participate more than once"
            );
        }

        paymentDiff = msg.value - participation;

        // Check that the participant is sending money to the contract
        require(
            msg.value == participation,
            "You need to send exactly the minimum participation!"
        );

        players.push(payable(msg.sender));
    }

    function pickWinner() public returns (address) {
        require(!finished, "Lottery has ended");
        // Pick the winner and return the money
        require(players.length > 0, "There are no players");
        require(msg.sender == manager, "Only the manager can pick the winner");
        winnerIndex = random(players.length);
        finished = true;
        address payable winner = players[winnerIndex];
        winner.transfer(address(this).balance);
        return winner;
    }

    function getWinner() public view returns (address) {
        return players[winnerIndex];
    }


    function random(uint256 _modulus) private returns (uint256) {
        randNonce++;
        bytes32 randomNumber = keccak256(
            abi.encodePacked(block.timestamp, msg.sender, randNonce)
        );
        return uint256(randomNumber) % _modulus;
    }
}
