import { ethers } from "ethers";
import { useMetaMask } from "@/contexts/MetaMaskContext";
import { DOCUMENT_REGISTRY_ADDRESS, DOCUMENT_REGISTRY_ABI } from "@/contracts/DocumentRegistry";

interface Document {
  hash: string;
  timestamp: bigint;
  signer: string;
  signature: string;
}

export function useContract() {
  const { getSigner } = useMetaMask();

  // Create provider for read-only functions
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  
  // 1. Connect to the contract with ABI
  const contract = new ethers.Contract(
    DOCUMENT_REGISTRY_ADDRESS,
    DOCUMENT_REGISTRY_ABI,
    provider
  ) as unknown as ethers.Contract & {
    storeDocumentHash: (hash: string, timestamp: number, signature: string, signer: string) => Promise<ethers.ContractTransactionResponse>;
    verifyDocument: (hash: string, signer: string, signature: string) => Promise<ethers.ContractTransactionResponse>;
    getDocumentInfo: (hash: string) => Promise<Document>;
    getDocumentSignature: (hash: string) => Promise<string>;
    isDocumentStored: (hash: string) => Promise<boolean>;
    getDocumentCount: () => Promise<bigint>;
    getDocumentHashByIndex: (index: number) => Promise<string>;
  };

  // 2. Contract functions

  /**
   * Store a document hash on the blockchain
   */
  const storeDocumentHash = async (
    hash: string,
    timestamp: number,
    signature: string,
    signerAddress: string
  ): Promise<ethers.ContractTransactionReceipt | null> => {
    const signer = getSigner();
    if (!signer) throw new Error("No signer available");

    const contractWithSigner = contract.connect(signer) as typeof contract;
    const tx = await contractWithSigner.storeDocumentHash(
      hash,
      timestamp,
      signature,
      signerAddress
    );
    return await tx.wait();
  };

  /**
   * Verify a document on the blockchain
   */
  const verifyDocument = async (
    hash: string,
    signerAddress: string,
    signature: string
  ): Promise<boolean> => {
    const signer = getSigner();
    if (!signer) throw new Error("No signer available");

    const contractWithSigner = contract.connect(signer) as typeof contract;
    const tx = await contractWithSigner.verifyDocument(
      hash,
      signerAddress,
      signature
    );
    const receipt = await tx.wait();
    
    // Search for the DocumentVerified event
    const event = receipt?.logs.find(
      (log: ethers.Log | ethers.EventLog) => {
        return 'eventName' in log && log.eventName === "DocumentVerified";
      }
    );
    
    return (event && 'args' in event) ? event.args?.isValid ?? false : false;
  };

  /**
   * Get full document information
   */
  const getDocumentInfo = async (hash: string): Promise<Document> => {
    const doc = await contract.getDocumentInfo(hash);
    return {
      hash: doc.hash,
      timestamp: doc.timestamp,
      signer: doc.signer,
      signature: doc.signature,
    };
  };

  /**
   * Get only the document signature
   */
  const getDocumentSignature = async (hash: string): Promise<string> => {
    return await contract.getDocumentSignature(hash);
  };

  /**
   * Check if a document is stored
   */
  const isDocumentStored = async (hash: string): Promise<boolean> => {
    return await contract.isDocumentStored(hash);
  };

  /**
   * Get the total number of documents
   */
  const getDocumentCount = async (): Promise<number> => {
    const count = await contract.getDocumentCount();
    return Number(count);
  };

  /**
   * Get a document hash by index
   */
  const getDocumentHashByIndex = async (index: number): Promise<string> => {
    return await contract.getDocumentHashByIndex(index);
  };

  /**
   * Get all documents (useful for listing)
   */
  const getAllDocuments = async (): Promise<Document[]> => {
    const count = await getDocumentCount();
    const documents: Document[] = [];

    for (let i = 0; i < count; i++) {
      const hash = await getDocumentHashByIndex(i);
      const doc = await getDocumentInfo(hash);
      documents.push(doc);
    }

    return documents;
  };

  /**
   * Listen to document registration events
   */
  const onDocumentRegistered = (
    callback: (hash: string, signer: string, timestamp: bigint, signature: string) => void
  ) => {
    contract.on("DocumentRegistered", callback);
    return () => contract.off("DocumentRegistered", callback);
  };

  /**
   * Listen to document verification events
   */
  const onDocumentVerified = (
    callback: (hash: string, signer: string, isValid: boolean) => void
  ) => {
    contract.on("DocumentVerified", callback);
    return () => contract.off("DocumentVerified", callback);
  };

  return {
    contract,
    storeDocumentHash,
    verifyDocument,
    getDocumentInfo,
    getDocumentSignature,
    isDocumentStored,
    getDocumentCount,
    getDocumentHashByIndex,
    getAllDocuments,
    onDocumentRegistered,
    onDocumentVerified,
  };
}
