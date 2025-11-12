"use client";

import { useState } from "react";
import ConnectionStatus from "@/components/ConnectionStatus";
import WalletSelector from "@/components/WalletSelector";
import FileUploader from "@/components/FileUploader";
import DocumentSigner from "@/components/DocumentSigner";
import DocumentVerifier from "@/components/DocumentVerifier";
import DocumentHistory from "@/components/DocumentHistory";
import { useMetaMask } from "@/contexts/MetaMaskContext";

type TabId = 'upload' | 'verify' | 'history';

export default function Home() {
  const { address } = useMetaMask();
  const [activeTab, setActiveTab] = useState<TabId>('upload');
  const [documentHash, setDocumentHash] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  // Tabs de navegación
  const tabs = [
    { id: 'upload' as TabId, label: 'Upload & Sign', icon: '📝' },
    { id: 'verify' as TabId, label: 'Verify', icon: '✅' },
    { id: 'history' as TabId, label: 'History', icon: '📋' }
  ];

  const handleHashGenerated = (hash: string, file: File) => {
    setDocumentHash(hash);
    setFileName(file.name);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-zinc-950 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📄 Document Registry
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign and verify documents on the blockchain
          </p>
        </header>

        {/* Wallet Connection Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                🔌 Wallet Connection
              </h2>
              <ConnectionStatus />
            </div>

            {address && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  💼 Switch Wallet
                </h2>
                <WalletSelector />
              </div>
            )}
          </div>
        </div>

        {/* Main Content with Tabs */}
        {address && (
          <div className="max-w-6xl mx-auto">
            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-zinc-900 rounded-t-xl shadow-lg">
              <div className="flex border-b border-gray-200 dark:border-zinc-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-zinc-900 rounded-b-xl shadow-lg p-6">
              {/* Upload & Sign Tab */}
              {activeTab === 'upload' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      📤 Upload Document
                    </h3>
                    <FileUploader onHashGenerated={handleHashGenerated} />
                  </div>
                  
                  {documentHash && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        ✍️ Sign & Store
                      </h3>
                      <DocumentSigner documentHash={documentHash} fileName={fileName} />
                    </div>
                  )}
                </div>
              )}

              {/* Verify Tab */}
              {activeTab === 'verify' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🔍 Verify Document
                  </h3>
                  <DocumentVerifier />
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📚 Document History
                  </h3>
                  <DocumentHistory />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Not Connected Message */}
        {!address && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please connect your wallet to start signing and verifying documents
              </p>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Connected to Anvil local blockchain (localhost:8545)</p>
        </footer>
      </div>
    </div>
  );
}
