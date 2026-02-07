// contracts/TimeStamp.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TimeStamp {
    struct Document {
        bytes32 hash;
        uint256 timestamp;
        address owner;
    }
    
    mapping(bytes32 => Document) public documents;
    event DocumentTimestamped(bytes32 indexed hash, uint256 timestamp, address owner);
    
    function timestampDocument(bytes32 _hash) public {
        require(documents[_hash].timestamp == 0, "Document already timestamped");
        
        documents[_hash] = Document({
            hash: _hash,
            timestamp: block.timestamp,
            owner: msg.sender
        });
        
        emit DocumentTimestamped(_hash, block.timestamp, msg.sender);
    }
    
    function verifyDocument(bytes32 _hash) public view returns (uint256) {
        return documents[_hash].timestamp;
    }
}