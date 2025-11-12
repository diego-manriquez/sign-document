export const DOCUMENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const DOCUMENT_REGISTRY_ABI = [
  {
    "type": "function",
    "name": "storeDocumentHash",
    "inputs": [
      { "name": "_hash", "type": "bytes32" },
      { "name": "_timestamp", "type": "uint256" },
      { "name": "_signature", "type": "bytes" },
      { "name": "_signer", "type": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "verifyDocument",
    "inputs": [
      { "name": "_hash", "type": "bytes32" },
      { "name": "_signer", "type": "address" },
      { "name": "_signature", "type": "bytes" }
    ],
    "outputs": [{ "name": "isValid", "type": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getDocumentInfo",
    "inputs": [{ "name": "_hash", "type": "bytes32" }],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          { "name": "hash", "type": "bytes32" },
          { "name": "timestamp", "type": "uint256" },
          { "name": "signer", "type": "address" },
          { "name": "signature", "type": "bytes" }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDocumentSignature",
    "inputs": [{ "name": "_hash", "type": "bytes32" }],
    "outputs": [{ "name": "signature", "type": "bytes" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isDocumentStored",
    "inputs": [{ "name": "_hash", "type": "bytes32" }],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDocumentCount",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDocumentHashByIndex",
    "inputs": [{ "name": "index", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "bytes32" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "DocumentRegistered",
    "inputs": [
      { "name": "hash", "type": "bytes32", "indexed": true },
      { "name": "signer", "type": "address", "indexed": true },
      { "name": "timestamp", "type": "uint256", "indexed": false },
      { "name": "signature", "type": "bytes", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "DocumentVerified",
    "inputs": [
      { "name": "hash", "type": "bytes32", "indexed": true },
      { "name": "signer", "type": "address", "indexed": true },
      { "name": "isValid", "type": "bool", "indexed": false }
    ]
  }
] as const;
