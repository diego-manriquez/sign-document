"use client";

import { useState, useEffect } from "react";
import { useContract } from "@/hooks/useContract";

interface DocumentRecord {
  hash: string;
  timestamp: bigint;
  signer: string;
  signature: string;
}

export default function DocumentHistory() {
  const { getDocumentCount, getDocumentHashByIndex, getDocumentInfo } = useContract();
  
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const loadDocuments = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // 1. Get total number of documents
      const count = await getDocumentCount();
      
      if (count === 0) {
        setDocuments([]);
        return;
      }

      // 2. Iterate and retrieve information for each document
      const docs: DocumentRecord[] = [];
      
      for (let i = 0; i < count; i++) {
        // 3. Get hash by index
        const hash = await getDocumentHashByIndex(i);
        
        // 4. Get full document information
        const docInfo = await getDocumentInfo(hash);
        
        docs.push(docInfo);
      }
      
      // Sort by timestamp (most recent first)
      docs.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      
      setDocuments(docs);
    } catch (err) {
      console.error("Error loading documents:", err);
      setError(err instanceof Error ? err.message : "Error loading documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatSignature = (signature: string) => {
    return `${signature.slice(0, 10)}...${signature.slice(-10)}`;
  };

  const formatTimestamp = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-500 rounded-lg p-6">
        <h3 className="text-red-900 dark:text-red-100 font-semibold mb-2">Error Loading Documents</h3>
        <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        <button
          onClick={loadDocuments}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-600 dark:text-gray-400 mb-4">No documents found on the blockchain</p>
        <button
          onClick={loadDocuments}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Total Documents: {documents.length}
        </h3>
        <button
          onClick={loadDocuments}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Table for larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Document Hash
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Signer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Signature
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
            {documents.map((doc, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <td className="px-4 py-3">
                  <button
                    onClick={() => copyToClipboard(doc.hash, "Hash")}
                    className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    title="Click to copy"
                  >
                    {formatAddress(doc.hash)}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => copyToClipboard(doc.signer, "Address")}
                    className="font-mono text-xs text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Click to copy"
                  >
                    {formatAddress(doc.signer)}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                  {formatTimestamp(doc.timestamp)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => copyToClipboard(doc.signature, "Signature")}
                    className="font-mono text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Click to copy"
                  >
                    {formatSignature(doc.signature)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile */}
      <div className="md:hidden space-y-4">
        {documents.map((doc, index) => (
          <div key={index} className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Document Hash</p>
              <button
                onClick={() => copyToClipboard(doc.hash, "Hash")}
                className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                {doc.hash}
              </button>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Signer</p>
              <button
                onClick={() => copyToClipboard(doc.signer, "Address")}
                className="font-mono text-xs text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {doc.signer}
              </button>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Timestamp</p>
              <p className="text-xs text-gray-900 dark:text-gray-100">
                {formatTimestamp(doc.timestamp)}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Signature</p>
              <button
                onClick={() => copyToClipboard(doc.signature, "Signature")}
                className="font-mono text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 break-all"
              >
                {doc.signature}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
