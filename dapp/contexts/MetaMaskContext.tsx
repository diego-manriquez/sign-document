"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { ethers } from "ethers";

// 1. Derive wallets from Anvil mnemonic
const ANVIL_MNEMONIC = process.env.NEXT_PUBLIC_MNEMONIC || "";
const ANVIL_WALLETS = Array.from({ length: 10 }, (_, i) => {
  const path = `m/44'/60'/0'/0/${i}`;
  const wallet = ethers.HDNodeWallet.fromPhrase(ANVIL_MNEMONIC, undefined, path);
  return { address: wallet.address, privateKey: wallet.privateKey };
});

// 2. Create JsonRpcProvider
const provider = new ethers.JsonRpcProvider("http://localhost:8545");

// 3. Context and functions
interface MetaMaskContextType {
  wallets: typeof ANVIL_WALLETS;
  currentWalletIndex: number | null;
  connect: (walletIndex: number) => void;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string | null>;
  getSigner: () => ethers.Wallet | null;
  switchWallet: (walletIndex: number) => void;
  address: string | null;
}

const MetaMaskContext = createContext<MetaMaskContextType | undefined>(undefined);

export const MetaMaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWalletIndex, setCurrentWalletIndex] = useState<number | null>(null);

  const wallet = useMemo(() => {
    if (currentWalletIndex === null) return null;
    const { privateKey } = ANVIL_WALLETS[currentWalletIndex];
    return new ethers.Wallet(privateKey, provider);
  }, [currentWalletIndex]);

  const connect = (walletIndex: number) => {
    setCurrentWalletIndex(walletIndex);
  };

  const disconnect = () => {
    setCurrentWalletIndex(null);
  };

  const signMessage = async (message: string): Promise<string | null> => {
    if (!wallet) return null;
    return await wallet.signMessage(message);
  };

  const getSigner = (): ethers.Wallet | null => {
    return wallet;
  };

  const switchWallet = (walletIndex: number) => {
    setCurrentWalletIndex(walletIndex);
  };

  const address = wallet ? wallet.address : null;

  return (
    <MetaMaskContext.Provider
      value={{
        wallets: ANVIL_WALLETS,
        currentWalletIndex,
        connect,
        disconnect,
        signMessage,
        getSigner,
        switchWallet,
        address,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (!context) throw new Error("useMetaMask must be used within a MetaMaskProvider");
  return context;
};
