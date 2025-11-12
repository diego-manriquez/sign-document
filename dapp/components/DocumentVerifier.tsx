"use client";

import { useState, ChangeEvent } from "react";
import { ethers } from "ethers";
import { useContract } from "@/hooks/useContract";

export default function DocumentVerifier() {
  const { isDocumentStored, getDocumentInfo } = useContract();
  
  const [file, setFile] = useState<File | null>(null);
  const [signerAddress, setSignerAddress] = useState<string>("");
  const [documentHash, setDocumentHash] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    message: string;
    documentInfo?: {
      hash: string;
      timestamp: bigint;
      signer: string;
      signature: string;
    };
  } | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setVerificationResult(null);

    try {
      // Calculate file hash
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const calculatedHash = ethers.keccak256(uint8Array);
      
      setDocumentHash(calculatedHash);
    } catch (error) {
      console.error("Error calculating hash:", error);
      alert("Error calculating file hash");
    }
  };

  const handleVerify = async () => {
    if (!documentHash || !signerAddress) {
      alert("Please upload a file and enter the signer address");
      return;
    }

    // Validate address format
    if (!ethers.isAddress(signerAddress)) {
      alert("❌ Invalid Ethereum address format");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // 1. Check if the document is stored
      const isStored = await isDocumentStored(documentHash);

      if (!isStored) {
        setVerificationResult({
          isValid: false,
          message: "Document not found on blockchain. It has never been signed or stored.",
        });
        return;
      }

      // 2. Get document info
      const docInfo = await getDocumentInfo(documentHash);

      // 3. Compare signer
      const signerMatches = docInfo.signer.toLowerCase() === signerAddress.toLowerCase();

      if (signerMatches) {
        setVerificationResult({
          isValid: true,
          message: "Document is valid! The signature and signer match the blockchain record.",
          documentInfo: docInfo,
        });
      } else {
        setVerificationResult({
          isValid: false,
          message: `Document found, but signer mismatch.\n\nExpected: ${signerAddress}\nActual: ${docInfo.signer}`,
          documentInfo: docInfo,
        });
      }
    } catch (error) {
      console.error("Error verifying document:", error);
      setVerificationResult({
        isValid: false,
        message: `Error verifying document: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setDocumentHash("");
    setSignerAddress("");
    setVerificationResult(null);
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          1. Select Document to Verify
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
          <input
            type="file"
            id="verify-file-upload"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="verify-file-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <svg
              className="w-10 h-10 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Click to upload document
            </span>
          </label>
        </div>
        
        {file && (
          <div className="mt-2 p-3 bg-blue-50 dark:bg-zinc-800 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Hash: {documentHash.slice(0, 10)}...{documentHash.slice(-10)}
            </p>
          </div>
        )}
      </div>

      {/* Signer Address Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          2. Enter Expected Signer Address
        </label>
        <input
          type="text"
          value={signerAddress}
          onChange={(e) => setSignerAddress(e.target.value)}
          placeholder="0x..."
          className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
        />
      </div>

      {/* Verify Button */}
      <div className="flex gap-4">
        <button
          onClick={handleVerify}
          disabled={!documentHash || !signerAddress || isVerifying}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verify Document
            </>
          )}
        </button>
        
        <button
          onClick={handleClear}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg shadow-md transition-colors duration-200"
        >
          Clear
        </button>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className={`rounded-lg p-6 ${
          verificationResult.isValid 
            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500' 
            : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
        }`}>
          <div className="flex items-start gap-3">
            {verificationResult.isValid ? (
              <svg className="w-8 h-8 text-green-600 dark:text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-600 dark:text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${
                verificationResult.isValid 
                  ? 'text-green-900 dark:text-green-100' 
                  : 'text-red-900 dark:text-red-100'
              }`}>
                {verificationResult.isValid ? '✅ Document Valid' : '❌ Document Invalid'}
              </h3>
              <p className={`text-sm whitespace-pre-line ${
                verificationResult.isValid 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {verificationResult.message}
              </p>

              {/* Document Info */}
              {verificationResult.documentInfo && (
                <div className="mt-4 space-y-2 bg-white dark:bg-zinc-900 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Blockchain Record:</h4>
                  
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Signer:</span>
                      <p className="font-mono text-gray-900 dark:text-gray-100 break-all">
                        {verificationResult.documentInfo.signer}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {new Date(Number(verificationResult.documentInfo.timestamp) * 1000).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Signature:</span>
                      <p className="font-mono text-gray-900 dark:text-gray-100 break-all">
                        {verificationResult.documentInfo.signature.slice(0, 20)}...
                        {verificationResult.documentInfo.signature.slice(-20)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
