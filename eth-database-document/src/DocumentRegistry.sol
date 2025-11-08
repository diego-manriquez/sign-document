// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract DocumentRegistry {
    struct Document {
        bytes32 hash;
        uint256 timestamp;
        address signer;
        bytes signature;
    }
    mapping(bytes32 => Document) private documents;

    bytes32[] private documentHashes;

    event DocumentRegistered(
        bytes32 indexed hash,
        address indexed signer,
        uint256 timestamp,
        bytes signature
    );

    event DocumentVerified(
        bytes32 indexed hash,
        address indexed signer,
        bool isValid
    );

    function storeDocumentHash(
        bytes32 _hash,
        uint256 _timestamp,
        bytes memory _signature,
        address _signer
    ) external documentNotExists(_hash) {
        require(_signature.length > 0, "Signature cannot be empty");
        documents[_hash] = Document({
            hash: _hash,
            timestamp: _timestamp,
            signer: _signer,
            signature: _signature
        });
        documentHashes.push(_hash);
        emit DocumentRegistered(_hash, _signer, _timestamp, _signature);
    }

    function verifyDocument(
        bytes32 _hash,
        address _signer,
        bytes memory _signature
    ) external returns (bool isValid) {
        Document memory doc = documents[_hash];

        if (doc.signer == address(0)) {
            isValid = false;
        } else {
            isValid = (doc.signer == _signer &&
                doc.signature.length > 0 &&
                _signature.length > 0);
        }

        emit DocumentVerified(_hash, _signer, isValid);
        return isValid;
    }

    function getDocumentInfo(
        bytes32 _hash
    ) external view documentExists(_hash) returns (Document memory) {
        return documents[_hash];
    }

    function getDocumentSignature(
        bytes32 _hash
    ) external view documentExists(_hash) returns (bytes memory signature) {
        return documents[_hash].signature;
    }

    function isDocumentStored(bytes32 _hash) external view returns (bool) {
        return documents[_hash].signer != address(0);
    }

    function getDocumentCount() external view returns (uint256) {
        return documentHashes.length;
    }

    function getDocumentHashByIndex(
        uint256 index
    ) external view returns (bytes32) {
        require(index < documentHashes.length, "Index out of bounds");
        return documentHashes[index];
    }

    modifier documentNotExists(bytes32 _hash) {
        require(
            documents[_hash].signer == address(0),
            "Document already exists"
        );
        _;
    }

    modifier documentExists(bytes32 _hash) {
        require(
            documents[_hash].signer != address(0),
            "Document does not exist"
        );
        _;
    }
}
