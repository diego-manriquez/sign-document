"use client";

import { useState, ChangeEvent } from "react";
import { ethers } from "ethers";

interface FileUploaderProps {
  onHashGenerated: (hash: string, file: File) => void;
}

export default function FileUploader({ onHashGenerated }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsCalculating(true);

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Calculate hash keccak256
      const calculatedHash = ethers.keccak256(uint8Array);
      
      setHash(calculatedHash);
      onHashGenerated(calculatedHash, selectedFile);
    } catch (error) {
      console.error("Error calculating hash:", error);
      alert("Error calculating file hash");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setHash("");
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="hidden"
          disabled={isCalculating}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-500"
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
            {isCalculating ? "Calculating hash..." : "Click to upload a file"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            Any file type supported
          </span>
        </label>
      </div>

      {/* File Info */}
      {file && (
        <div className="bg-blue-50 dark:bg-zinc-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {file.name}
              </span>
            </div>
            <button
              onClick={handleClear}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Size: {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {/* Hash Display */}
      {hash && (
        <div className="bg-green-50 dark:bg-zinc-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Document Hash (Keccak256)
            </span>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded p-3 border border-green-200 dark:border-zinc-700">
            <p className="text-xs font-mono text-gray-900 dark:text-gray-100 break-all">
              {hash}
            </p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(hash);
              alert("Hash copied to clipboard!");
            }}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Copy to clipboard
          </button>
        </div>
      )}
    </div>
  );
}
