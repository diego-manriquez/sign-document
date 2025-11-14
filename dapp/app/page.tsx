"use client";

import { useState } from "react";
import { FileText, Upload, CheckCircle, History, Lock, Wallet } from "lucide-react";
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
    { id: 'upload' as TabId, label: 'Upload & Sign', icon: Upload },
    { id: 'verify' as TabId, label: 'Verify', icon: CheckCircle },
    { id: 'history' as TabId, label: 'History', icon: History }
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
          <div className="flex items-center justify-center gap-3 mb-2">
            <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Document Registry
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Sign and verify documents on the blockchain
          </p>
        </header>

        {/* Wallet Connection Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Wallet Connection
                </h2>
              </div>
              <ConnectionStatus />
            </div>

            {address && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Switch Wallet
                  </h2>
                </div>
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
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        activeTab === tab.id
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-zinc-900 rounded-b-xl shadow-lg p-6">
              {/* Upload & Sign Tab */}
              {activeTab === 'upload' && (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Upload className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Upload Document
                      </h3>
                    </div>
                    <FileUploader onHashGenerated={handleHashGenerated} />
                  </div>
                  
                  {documentHash && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Sign & Store
                        </h3>
                      </div>
                      <DocumentSigner documentHash={documentHash} fileName={fileName} />
                    </div>
                  )}
                </div>
              )}

              {/* Verify Tab */}
              {activeTab === 'verify' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Verify Document
                    </h3>
                  </div>
                  <DocumentVerifier />
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <History className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Document History
                    </h3>
                  </div>
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
              <Lock className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
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
