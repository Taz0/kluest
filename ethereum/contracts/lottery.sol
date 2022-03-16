// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager;
    address payable[] public players;
    uint256 public participation = 0;
    bool public finished;

    // Initializing the state variable
    uint256 private randNonce = 0;
    uint256 private winnerIndex;

    constructor() {
        manager = msg.sender;
    }

    function setParticipation(uint256 _participation) public {
        require(msg.sender == manager, "Only the manager set the participation");
        require(participation == 0, "Participation has already been set");
        require(_participation > 0, "Participation must be greather than 0");
        participation = _participation * 1 ether;
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
        for (uint256 i = 0; i < players.length; i++) {
            require(
                msg.sender != players[i],
                "A player cannot participate more than once"
            );
        }

        // Check that the participant is sending money to the contract
        require(
            msg.value == participation,
            "You need to send exactly the minimum participation!"
        );

        players.push(payable(msg.sender));
    }

    function winnerWithdrawPot() public {
        require(finished, "Lottery has not finished!");
        address payable winner = players[winnerIndex];
        require(msg.sender == winner, "You are not the winner!");
        winner.transfer(getPot());
    }

    function pickWinner() public returns (address) {
        require(!finished, "Lottery has ended");
        // Pick the winner and return the money
        require(players.length > 0, "There are no players");
        require(msg.sender == manager, "Only the manager can pick the winner");
        winnerIndex = random(players.length);
        finished = true;
        return players[winnerIndex];
    }

    function getWinner() public view returns (address) {
        require(finished, "Lottery has not ended");
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
