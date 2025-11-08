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

    /**
     * @notice Stores a document hash in the registry
     * @dev Requires that the document does not exist previously (uses documentNotExists modifier)
     * @param _hash Hash of the document to store
     * @param _timestamp Timestamp of when the document was signed
     * @param _signature Cryptographic signature of the document
     * @param _signer Address of the document signer
     * @custom:emits DocumentRegistered when the document is successfully stored
     * @custom:requirements The signature cannot be empty
     */
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

    /**
     * @notice Verifies if a document is correctly registered
     * @dev Compares the signer and validates that signatures are not empty
     * @param _hash Hash of the document to verify
     * @param _signer Expected signer address
     * @param _signature Signature to validate (not compared, only checked for existence)
     * @return isValid true if the document exists and the signer matches, false otherwise
     * @custom:emits DocumentVerified with the verification result
     */
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

    /**
     * @notice Gets all information of a registered document
     * @dev Requires that the document exists (uses documentExists modifier)
     * @param _hash Hash of the document to query
     * @return Document Complete struct with hash, timestamp, signer and signature
     */
    function getDocumentInfo(
        bytes32 _hash
    ) external view documentExists(_hash) returns (Document memory) {
        return documents[_hash];
    }

    /**
     * @notice Gets only the signature of a registered document
     * @dev Requires that the document exists (uses documentExists modifier)
     * @param _hash Hash of the document
     * @return signature The stored cryptographic signature
     */
    function getDocumentSignature(
        bytes32 _hash
    ) external view documentExists(_hash) returns (bytes memory signature) {
        return documents[_hash].signature;
    }

    /**
     * @notice Checks if a document is stored in the registry
     * @dev Verifies if the signer is not address(0), which indicates an existing document
     * @param _hash Hash of the document to check
     * @return bool true if the document exists, false otherwise
     */
    function isDocumentStored(bytes32 _hash) external view returns (bool) {
        return documents[_hash].signer != address(0);
    }

    /**
     * @notice Gets the total number of registered documents
     * @return uint256 Number of documents in the registry
     */
    function getDocumentCount() external view returns (uint256) {
        return documentHashes.length;
    }

    /**
     * @notice Gets the hash of a document by its index in the array
     * @dev Useful for iterating over all registered documents
     * @param index Position of the document in the array (0-indexed)
     * @return bytes32 Hash of the document at the specified position
     * @custom:requirements The index must be less than the array length
     */
    function getDocumentHashByIndex(
        uint256 index
    ) external view returns (bytes32) {
        require(index < documentHashes.length, "Index out of bounds");
        return documentHashes[index];
    }

    /**
     * @dev Modifier that verifies a document does NOT exist in the registry
     * @param _hash Hash of the document to verify
     */
    modifier documentNotExists(bytes32 _hash) {
        require(
            documents[_hash].signer == address(0),
            "Document already exists"
        );
        _;
    }

    /**
     * @dev Modifier that verifies a document DOES exist in the registry
     * @param _hash Hash of the document to verify
     */
    modifier documentExists(bytes32 _hash) {
        require(
            documents[_hash].signer != address(0),
            "Document does not exist"
        );
        _;
    }
}