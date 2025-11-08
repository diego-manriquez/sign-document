// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {DocumentRegistry} from "../src/DocumentRegistry.sol";

contract DocumentRegistryTest is Test {
    DocumentRegistry public registry;

    address public signer1;
    address public signer2;

    bytes32 public documentHash1;
    bytes32 public documentHash2;

    bytes public signature1;
    bytes public signature2;

    uint256 public timestamp1;
    uint256 public timestamp2;

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

    function setUp() public {
        registry = new DocumentRegistry();

        signer1 = address(0x1);
        signer2 = address(0x2);

        documentHash1 = keccak256("document1");
        documentHash2 = keccak256("document2");

        signature1 = hex"1234567890abcdef";
        signature2 = hex"abcdef1234567890";

        timestamp1 = block.timestamp;
        timestamp2 = block.timestamp + 100;
    }

    function test_StoreDocumentHash_Success() public {
        vm.expectEmit(true, true, false, true);
        emit DocumentRegistered(documentHash1, signer1, timestamp1, signature1);

        registry.storeDocumentHash(
            documentHash1,
            timestamp1,
            signature1,
            signer1
        );

        assertTrue(registry.isDocumentStored(documentHash1));
        assertEq(registry.getDocumentCount(), 1);

        DocumentRegistry.Document memory doc = registry.getDocumentInfo(
            documentHash1
        );
        assertEq(doc.hash, documentHash1);
        assertEq(doc.timestamp, timestamp1);
        assertEq(doc.signer, signer1);
        assertEq(doc.signature, signature1);
    }

    function test_VerifyDocument_ExistingDocument() public {
        registry.storeDocumentHash(
            documentHash1,
            timestamp1,
            signature1,
            signer1
        );

        vm.expectEmit(true, true, false, true);
        emit DocumentVerified(documentHash1, signer1, true);

        bool isValid = registry.verifyDocument(
            documentHash1,
            signer1,
            signature1
        );

        assertTrue(isValid);
    }

    function test_VerifyDocument_InvalidSigner() public {
        registry.storeDocumentHash(
            documentHash1,
            timestamp1,
            signature1,
            signer1
        );

        vm.expectEmit(true, true, false, true);
        emit DocumentVerified(documentHash1, signer2, false);

        bool isValid = registry.verifyDocument(
            documentHash1,
            signer2,
            signature1
        );

        assertFalse(isValid);
    }

    function test_VerifyDocument_NonExistentDocument() public {
        vm.expectEmit(true, true, false, true);
        emit DocumentVerified(documentHash1, signer1, false);

        bool isValid = registry.verifyDocument(
            documentHash1,
            signer1,
            signature1
        );

        assertFalse(isValid);
    }

    function test_StoreDocumentHash_RevertDuplicate() public {
        registry.storeDocumentHash(
            documentHash1,
            timestamp1,
            signature1,
            signer1
        );

        vm.expectRevert("Document already exists");
        registry.storeDocumentHash(
            documentHash1,
            timestamp2,
            signature2,
            signer2
        );
    }

    function test_StoreDocumentHash_RevertEmptySignature() public {
        bytes memory emptySignature = "";

        vm.expectRevert("Signature cannot be empty");
        registry.storeDocumentHash(
            documentHash1,
            timestamp1,
            emptySignature,
            signer1
        );
    }

    function test_GetDocumentInfo_Success() public {
        registry.storeDocumentHash(
            documentHash1,
            timestamp1,
            signature1,
            signer1
        );

        DocumentRegistry.Document memory doc = registry.getDocumentInfo(
            documentHash1
        );

        assertEq(doc.hash, documentHash1);
        assertEq(doc.timestamp, timestamp1);
        assertEq(doc.signer, signer1);
        assertEq(doc.signature, signature1);
    }

    function test_GetDocumentSignature_Success() public {
        registry.storeDocumentHash(
            documentHash1,
            timestamp1,
            signature1,
            signer1
        );

        bytes memory retrievedSignature = registry.getDocumentSignature(
            documentHash1
        );

        assertEq(retrievedSignature, signature1);
    }

    function test_IsDocumentStored_True() public {
        registry.storeDocumentHash(
            documentHash1,
            timestamp1,
            signature1,
            signer1
        );

        assertTrue(registry.isDocumentStored(documentHash1));
    }

    function test_IsDocumentStored_False() public view {
        assertFalse(registry.isDocumentStored(documentHash1));
    }

    function test_GetDocumentCount_Empty() public view {
        assertEq(registry.getDocumentCount(), 0);
    }

    function test_GetDocumentCount_MultipleDocuments() public {
        assertEq(registry.getDocumentCount(), 0);

        registry.storeDocumentHash(
            documentHash1,
            timestamp1,
            signature1,
            signer1
        );
        assertEq(registry.getDocumentCount(), 1);

        registry.storeDocumentHash(
            documentHash2,
            timestamp2,
            signature2,
            signer2
        );
        assertEq(registry.getDocumentCount(), 2);
    }

    function test_GetDocumentHashByIndex_Success() public {
        registry.storeDocumentHash(
            documentHash1,
            timestamp1,
            signature1,
            signer1
        );
        registry.storeDocumentHash(
            documentHash2,
            timestamp2,
            signature2,
            signer2
        );

        assertEq(registry.getDocumentHashByIndex(0), documentHash1);
        assertEq(registry.getDocumentHashByIndex(1), documentHash2);
    }

    function test_GetDocumentHashByIndex_RevertOutOfBounds() public {
        registry.storeDocumentHash(
            documentHash1,
            timestamp1,
            signature1,
            signer1
        );

        vm.expectRevert("Index out of bounds");
        registry.getDocumentHashByIndex(1);
    }

    function test_GetDocumentHashByIndex_RevertEmptyRegistry() public {
        vm.expectRevert("Index out of bounds");
        registry.getDocumentHashByIndex(0);
    }

    function test_GetDocumentInfo_RevertNonExistent() public {
        vm.expectRevert("Document does not exist");
        registry.getDocumentInfo(documentHash1);
    }

    function test_GetDocumentSignature_RevertNonExistent() public {
        vm.expectRevert("Document does not exist");
        registry.getDocumentSignature(documentHash1);
    }

    function test_StoreMultipleDocuments_DifferentSigners() public {
        registry.storeDocumentHash(
            documentHash1,
            timestamp1,
            signature1,
            signer1
        );
        registry.storeDocumentHash(
            documentHash2,
            timestamp2,
            signature2,
            signer2
        );

        DocumentRegistry.Document memory doc1 = registry.getDocumentInfo(
            documentHash1
        );
        DocumentRegistry.Document memory doc2 = registry.getDocumentInfo(
            documentHash2
        );

        assertEq(doc1.signer, signer1);
        assertEq(doc2.signer, signer2);
        assertEq(registry.getDocumentCount(), 2);
    }

    function testFuzz_StoreAndRetrieveDocument(
        bytes32 _hash,
        uint256 _timestamp,
        bytes memory _signature,
        address _signer
    ) public {
        vm.assume(_signature.length > 0);
        vm.assume(_signer != address(0));

        registry.storeDocumentHash(_hash, _timestamp, _signature, _signer);

        assertTrue(registry.isDocumentStored(_hash));

        DocumentRegistry.Document memory doc = registry.getDocumentInfo(_hash);
        assertEq(doc.hash, _hash);
        assertEq(doc.timestamp, _timestamp);
        assertEq(doc.signer, _signer);
        assertEq(doc.signature, _signature);
    }
}
