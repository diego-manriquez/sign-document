# Sign Document - Web3 Document Registry

A decentralized application (dApp) for registering and verifying document signatures on the Ethereum blockchain.

## Project Structure

```
sign-document/
├── eth-database-document/    # Smart contracts (Foundry)
│   ├── src/                   # Contract source files
│   ├── script/                # Deployment scripts
│   └── test/                  # Contract tests
└── dapp/                      # Frontend application (Next.js)
    ├── app/                   # Next.js app pages
    ├── components/            # React components
    ├── contracts/             # Contract ABI and addresses
    ├── contexts/              # React contexts
    └── hooks/                 # Custom React hooks
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for smart contracts)
- [MetaMask](https://metamask.io/) browser extension

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/diego-manriquez/sign-document.git
cd sign-document
```

---

### 2. Smart Contract Setup (eth-database-document)

#### Install Dependencies

```bash
cd eth-database-document
forge install
```

This will install:
- OpenZeppelin Contracts
- Forge Standard Library

#### Compile Contracts

```bash
forge build
```

#### Start Local Blockchain (Anvil)

Open a new terminal and run:

```bash
anvil
```

This will start a local Ethereum node at `http://localhost:8545` with pre-funded test accounts.

#### Set Environment Variables

Create a `.env` file in the `eth-database-document` directory:

```bash
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

> ⚠️ **Important**: This is Anvil's default first private key. **NEVER** use this key in production or on mainnet!

#### Deploy the Contract

```bash
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

After deployment, you'll see output like:

```
DocumentRegistry deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Copy this contract address** - you'll need it for the frontend configuration.

#### Run Tests (Optional)

```bash
forge test
forge test -vvv  # Verbose output
```

---

### 3. Frontend Setup (dapp)

#### Install Dependencies

```bash
cd ../dapp
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the `dapp` directory:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_MNEMONIC="test test test test test test test test test test test junk"
```

> ⚠️ **Important**: Replace `NEXT_PUBLIC_CONTRACT_ADDRESS` with your actual deployed contract address from step 2.

#### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## Development Commands

### Smart Contracts

```bash
cd eth-database-document

# Compile contracts
forge build

# Run tests
forge test

# Deploy to local network
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast

# Check contract code at address
cast code <CONTRACT_ADDRESS> --rpc-url http://localhost:8545

# Get contract info
forge inspect DocumentRegistry abi
```

### Frontend

```bash
cd dapp

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Testing

### Contract Tests

```bash
cd eth-database-document
forge test -vvv
```

### Frontend (Manual Testing)

1. Start Anvil: `anvil`
2. Deploy contract: `forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast`
3. Update `.env.local` with contract address
4. Start frontend: `npm run dev`
5. Connect MetaMask and test features

---

## Technologies Used

### Smart Contracts
- **Solidity** ^0.8.20
- **Foundry** (Forge, Anvil, Cast)
- **OpenZeppelin Contracts** (Security standards)

### Frontend
- **Next.js** 16.0.1 (React framework)
- **ethers.js** 6.15.0 (Ethereum interaction)
- **TypeScript** (Type safety)
- **Tailwind CSS** 4.0 (Styling)
- **React Query** (State management)

---

## Security Notes

- ✅ All provided private keys are for **LOCAL DEVELOPMENT ONLY**
- ✅ Never commit real private keys or mnemonics to version control
- ✅ Use environment variables for sensitive data
- ✅ Contracts use OpenZeppelin's audited libraries
- ✅ Test thoroughly before deploying to mainnet

---

## Smart Contract Features

### DocumentRegistry.sol

- ✅ Store document hashes with signatures
- ✅ Verify document authenticity
- ✅ Retrieve document information
- ✅ Event emission for blockchain tracking
- ✅ Optimized gas usage (no redundant storage)

### Key Functions

```solidity
storeDocumentHash(bytes32 _hash, uint256 _timestamp, bytes memory _signature, address _signer)
verifyDocument(bytes32 _hash, address _signer, bytes memory _signature)
getDocumentInfo(bytes32 _hash)
isDocumentStored(bytes32 _hash)
getDocumentCount()
```

---

## Troubleshooting

### "Contract not deployed" error

- ✅ Make sure Anvil is running
- ✅ Verify contract is deployed: `cast code <ADDRESS> --rpc-url http://localhost:8545`
- ✅ Check `.env.local` has correct contract address
- ✅ Restart Next.js dev server after changing `.env.local`

### MetaMask connection issues

- ✅ Make sure you're on the Anvil Local network (Chain ID 31337)
- ✅ Reset MetaMask account if needed: Settings → Advanced → Reset Account
- ✅ Check that localhost:8545 is accessible

### Transaction failures

- ✅ Ensure you have ETH in your MetaMask account
- ✅ Check Anvil terminal for error messages
- ✅ Verify contract ABI matches deployed contract

---

## Support

For issues, questions, or contributions:

- **GitHub Issues**: [Create an issue](https://github.com/diego-manriquez/sign-document/issues)
- **Repository**: [diego-manriquez/sign-document](https://github.com/diego-manriquez/sign-document)

---

## License

This project is licensed under the UNLICENSED license.

---

## Acknowledgments

- [Foundry](https://book.getfoundry.sh/) - Fast, portable and modular toolkit for Ethereum development
- [OpenZeppelin](https://www.openzeppelin.com/) - Secure smart contract libraries
- [Next.js](https://nextjs.org/) - The React Framework for Production
- [ethers.js](https://docs.ethers.org/) - Ethereum JavaScript library

---

**Happy Building!**
