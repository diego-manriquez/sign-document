"use client";

import { useState } from "react";
import { useMetaMask } from "@/contexts/MetaMaskContext";
import { useContract } from "@/hooks/useContract";

interface DocumentSignerProps {
  documentHash: string;
  fileName: string;
}

export default function DocumentSigner({ documentHash, fileName }: DocumentSignerProps) {
  const { signMessage, address } = useMetaMask();
  const { storeDocumentHash } = useContract();
  
  const [signature, setSignature] = useState<string>("");
  const [isSigningStep, setIsSigningStep] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [isStoring, setIsStoring] = useState(false);
  const [txHash, setTxHash] = useState<string>("");

  const handleSign = async () => {
    if (!documentHash || !address) return;

    // Confirmation alert
    const confirmed = window.confirm(
      `You are about to sign the document:\n\nFile: ${fileName}\nHash: ${documentHash}\n\nDo you want to proceed?`
    );

    if (!confirmed) return;

    setIsSigning(true);
    try {
      // Sign the document hash
      const sig = await signMessage(documentHash);
      
      if (sig) {
        setSignature(sig);
        setIsSigningStep(false);
        
        // Success alert
        alert(
          `✅ Document signed successfully!\n\nSignature:\n${sig.slice(0, 20)}...${sig.slice(-20)}\n\nYou can now store it on the blockchain.`
        );
      }
    } catch (error) {
      console.error("Error signing document:", error);
      alert("❌ Error signing document. Please try again.");
    } finally {
      setIsSigning(false);
    }
  };

  const handleStoreOnBlockchain = async () => {
    if (!documentHash || !signature || !address) return;

    // Confirmation alert before storing
    const confirmed = window.confirm(
      `⚠️ You are about to store this document on the blockchain.\n\nThis will:\n- Create a permanent record\n- Cost gas fees\n- Cannot be undone\n\nDocument Hash: ${documentHash}\nSigner: ${address}\n\nDo you want to proceed?`
    );

    if (!confirmed) return;

    setIsStoring(true);
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      
      // Send transaction to the contract
      const receipt = await storeDocumentHash(
        documentHash,
        timestamp,
        signature,
        address
      );

      if (receipt) {
        setTxHash(receipt.hash);
        alert(
          `✅ Document stored on blockchain successfully!\n\nTransaction Hash:\n${receipt.hash}\n\nYour document is now permanently recorded.`
        );
      }
    } catch (error) {
      console.error("Error storing document:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`❌ Error storing document on blockchain:\n\n${errorMessage}`);
    } finally {
      setIsStoring(false);
    }
  };

  if (!documentHash) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Upload a file first to sign it
      </div>
    );
  }

  if (!address) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Connect your wallet to sign documents
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className={`flex items-center gap-2 ${isSigningStep ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSigningStep ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'}`}>
            {isSigningStep ? '1' : '✓'}
          </div>
          <span className="text-sm font-medium">Sign</span>
        </div>
        
        <div className="w-12 h-0.5 bg-gray-300 dark:bg-zinc-700" />
        
        <div className={`flex items-center gap-2 ${!isSigningStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!isSigningStep ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-zinc-800'}`}>
            2
          </div>
          <span className="text-sm font-medium">Store</span>
        </div>
      </div>

      {/* Document Info */}
      <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Document to Sign:</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{fileName}</p>
        <div className="mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Hash:</p>
          <p className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all bg-white dark:bg-zinc-900 p-2 rounded">
            {documentHash}
          </p>
        </div>
      </div>

      {/* Signing Step */}
      {isSigningStep && (
        <button
          onClick={handleSign}
          disabled={isSigning}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          {isSigning ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Sign Document
            </>
          )}
        </button>
      )}

      {/* Signature Display */}
      {signature && (
        <div className="bg-green-50 dark:bg-zinc-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Signature Generated</span>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded p-3 border border-green-200 dark:border-zinc-700">
            <p className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">
              {signature}
            </p>
          </div>
        </div>
      )}

      {/* Store on Blockchain Step */}
      {!isSigningStep && (
        <button
          onClick={handleStoreOnBlockchain}
          disabled={isStoring}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          {isStoring ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Storing on Blockchain...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              Store on Blockchain
            </>
          )}
        </button>
      )}

      {/* Transaction Hash */}
      {txHash && (
        <div className="bg-blue-50 dark:bg-zinc-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Transaction Hash</span>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded p-3 border border-blue-200 dark:border-zinc-700">
            <p className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">
              {txHash}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
