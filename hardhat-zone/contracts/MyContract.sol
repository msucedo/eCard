//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract MyContract {

    mapping(address => bool) voters; // addrs voted => true/false
    address owner;
    mapping(string => uint) idVotingOption; // voting_option => id
    bool isVotingOpen;
    votingOption[] votes;

    constructor() {
        owner = msg.sender;
        isVotingOpen = true;
    }

    struct votingOption {
        uint votes;
        uint id;
        string name;
    }

    function vote(string memory _name) public {
        require(isVotingOpen == true, "voting closed"); // check if voting open
        require(voters[msg.sender]!=true, "you already voted"); // check if already voted
        uint currentID = idVotingOption[_name];
        if(votes.length>0&&currentID!=0){
            for (uint8 i = 0; i < votes.length; i++) {
                if (votes[i].id == currentID) {
                    votes[i].votes += 1;
                    voters[msg.sender] = true;
                    console.log("existing id...", votes[i].id, " name: ", votes[i].name);
                    console.log(" votes: ", votes[i].votes);
                } 
            }
        } else {
            votes.push(votingOption(1, votes.length+1, _name));
            console.log("VOTING name...", votes[votes.length-1].name);
            console.log("VOTING votes...", votes[votes.length-1].votes);
            console.log("VOTING id...", votes[votes.length-1].id);
            idVotingOption[_name] = votes.length;
            voters[msg.sender] = true;
        }
    }

    function getWinnerName() public view returns(string memory winner_) {
        require(msg.sender == owner, "you aren't the owner");
        uint maxVotes = 0;
        for (uint i=0; i < votes.length; i++){
            if (votes[i].votes > maxVotes){
                maxVotes = votes[i].votes;
                winner_ = votes[i].name;
            }
        }
    }

    function getVotingOptions() public view returns(votingOption[] memory) {
        console.log("options length...:", votes.length);
        return votes;
    }

    function closeVoting() public {
        require(msg.sender == owner, "you aren't the owner.");
        isVotingOpen = false;
    }
}
