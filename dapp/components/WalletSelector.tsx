"use client";

import { useMetaMask } from "@/contexts/MetaMaskContext";

export default function WalletSelector() {
  const { wallets, currentWalletIndex, switchWallet, address } = useMetaMask();

  return (
    <div className="w-full max-w-md">
      <label 
        htmlFor="wallet-select" 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Select Wallet
      </label>
      <select
        id="wallet-select"
        value={currentWalletIndex ?? ""}
        onChange={(e) => switchWallet(Number(e.target.value))}
        disabled={currentWalletIndex === null}
        className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {currentWalletIndex === null && (
          <option value="">Connect wallet first</option>
        )}
        {wallets.map((wallet, index) => (
          <option key={wallet.address} value={index}>
            Wallet {index} - {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </option>
        ))}
      </select>
      
      {address && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Address:</p>
          <p className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
            {address}
          </p>
        </div>
      )}
    </div>
  );
}
