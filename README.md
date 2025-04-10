# Axar NFT Marketplace

A decentralized NFT marketplace built with Next.js and Ethereum smart contracts. This platform allows users to create, collect, and trade NFTs on the Sepolia testnet.

## Features

- Create NFTs from text strings
- Update NFT metadata (owner only)
- Connect with Web3 wallet
- Modern and responsive UI
- Deployed on Sepolia testnet

## Technology Stack

- Frontend: Next.js, TailwindCSS
- Smart Contracts: Solidity, Hardhat
- Blockchain: Ethereum (Sepolia testnet)
- Web3 Integration: ethers.js, Web3Modal

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `env.example` to `.env` and fill in your environment variables:
   ```bash
   cp env.example .env
   ```
4. Deploy the smart contract:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
5. Update the contract address in your `.env` file
6. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Smart Contract Development

- The smart contract is located in `contracts/AxarNFT.sol`
- Test the contract: `npx hardhat test`
- Deploy to Sepolia: `npx hardhat run scripts/deploy.js --network sepolia`

## Environment Variables

Create a `.env` file with the following variables:

```env
SEPOLIA_RPC_URL=your_sepolia_rpc_url_here
PRIVATE_KEY=your_wallet_private_key_here
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address_here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
