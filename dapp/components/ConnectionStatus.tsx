"use client";

import { useMetaMask } from "@/contexts/MetaMaskContext";
import { useState } from "react";

export default function ConnectionStatus() {
  const { wallets, currentWalletIndex, connect, disconnect, address } = useMetaMask();
  const [selectedWalletIndex, setSelectedWalletIndex] = useState<number>(0);

  const isConnected = currentWalletIndex !== null;

  const handleConnect = () => {
    connect(selectedWalletIndex);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="w-full max-w-md space-y-4">
      {/* State Indicator */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        {isConnected && (
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
            Wallet {currentWalletIndex}
          </span>
        )}
      </div>

      {/* Wallet Selector and Connect Button */}
      {!isConnected ? (
        <div className="space-y-3">
          <select
            value={selectedWalletIndex}
            onChange={(e) => setSelectedWalletIndex(Number(e.target.value))}
            className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {wallets.map((wallet, index) => (
              <option key={wallet.address} value={index}>
                Wallet {index} - {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleConnect}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Show current address */}
          <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 rounded-lg border border-blue-100 dark:border-zinc-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Connected Address:</p>
            <p className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
              {address}
            </p>
          </div>

          <button
            onClick={handleDisconnect}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
