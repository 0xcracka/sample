// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract VotingContract {
    address public owner;
    mapping(string => uint256) public votes;
    mapping(address => bool) public hasVoted;
    string[] public candidates;
    string public winner;
    bool public votingEnded = false;

    event Voted(string candidate);
    event VotingEnded(string winner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier hasNotVoted() {
        require(!hasVoted[msg.sender], "You have already voted");
        _;
    }

    modifier votingNotEnded() {
        require(!votingEnded, "Voting has already ended");
        _;
    }

    constructor(string[] memory _candidates) {
        owner = msg.sender;
        candidates = _candidates;
    }

    function getCandidates() external view returns (string[] memory) {
    return candidates;
    },

    function vote(string memory candidate) external hasNotVoted votingNotEnded {
        require(isValidCandidate(candidate), "Invalid candidate");

        votes[candidate]++;
        hasVoted[msg.sender] = true;
        
        emit Voted(candidate);
    }

    function endVoting() external onlyOwner {
        require(!votingEnded, "Voting has already ended");

        string memory currentWinner = candidates[0];

        for (uint i = 1; i < candidates.length; i++) {
            if (votes[candidates[i]] > votes[currentWinner]) {
                currentWinner = candidates[i];
            }
        }

        winner = currentWinner;
        votingEnded = true;

        emit VotingEnded(winner);
    }

    function isValidCandidate(string memory candidate) public view returns (bool) {
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(abi.encodePacked(candidate)) == keccak256(abi.encodePacked(candidates[i]))) {
                return true;
            }
        }
        return false;
    }
}
