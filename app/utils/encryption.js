'use client';

import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';
import { NFTStorage } from 'nft.storage';

// Initialize variables that will be set on client side
let nftStorageClient = null;

// Function to initialize NFT.Storage client only on the client side
const initNFTStorageClient = async () => {
  if (typeof window === 'undefined') return null;
  if (nftStorageClient) return nftStorageClient;
  
  try {
    const apiKey = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY;
    if (!apiKey) {
      throw new Error('NFT.Storage API key is not set. Please add NEXT_PUBLIC_NFT_STORAGE_API_KEY to your .env.local file');
    }
    
    nftStorageClient = new NFTStorage({ token: apiKey });
    console.log('NFT.Storage client initialized successfully');
    return nftStorageClient;
  } catch (error) {
    console.error('Error initializing NFT.Storage client:', error);
    return null;
  }
};

/**
 * Encrypts a prompt using the user's private key (via signing) in a way that's compatible with most wallets
 * @param {string} prompt - The prompt to encrypt
 * @param {object} provider - The Ethereum provider from MetaMask
 * @returns {Promise<object>} - The encrypted prompt and key
 */
export async function encryptPrompt(prompt, provider) {
  try {
    console.log('Starting encryption process...');
    
    // Get the user's Ethereum address
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log('Got user address:', address);
    
    // Generate a random encryption key
    const randomKey = CryptoJS.lib.WordArray.random(32); // 256 bits
    const randomKeyHex = randomKey.toString(CryptoJS.enc.Hex);
    
    // Create a simple message that most wallets can sign without issues
    // This is a standard EIP-191 personal sign format
    const timestamp = Date.now().toString();
    const message = `Encrypt NFT Prompt: ${timestamp}`;
    
    console.log('Requesting signature for prompt encryption...');
    
    try {
      // Use the standard ethers signMessage which is more compatible than personal_sign
      const signature = await signer.signMessage(message);
      console.log('Signature obtained successfully');
      
      // Use the signature to derive an encryption key
      // This ensures only someone with the private key can decrypt
      const sigHash = CryptoJS.SHA256(signature).toString();
      
      // Create a derived key using both the signature and random key
      // This provides strong security and uniqueness
      const derivedKey = CryptoJS.PBKDF2(
        randomKeyHex, 
        sigHash, 
        { keySize: 256/32, iterations: 1000 }
      ).toString();
      
      // Encrypt the prompt with the derived key
      const encryptedPrompt = CryptoJS.AES.encrypt(prompt, derivedKey).toString();
      
      // For decryption later, we need to store the random key and signature hash
      // We'll encrypt the random key with the signature hash for extra security
      const encryptedKey = CryptoJS.AES.encrypt(randomKeyHex, sigHash).toString();
      
      return {
        encryptedPrompt,
        encryptedKey,
        encryptionKey: sigHash, // The signature hash is the encryption key
        timestamp // Store this for verification during decryption
      };
    } catch (sigError) {
      console.error('Error during signature request:', sigError);
      throw new Error('You must approve the signature request to encrypt your prompt securely');
    }
  } catch (error) {
    console.error('Error encrypting prompt:', error);
    throw new Error(`Failed to encrypt prompt: ${error.message}`);
  }
}

/**
 * Decrypts a prompt using the user's private key (via signing)
 * @param {string} encryptedPrompt - The encrypted prompt
 * @param {string} encryptedKey - The encrypted random key
 * @param {string} timestamp - The timestamp used during encryption
 * @param {object} provider - The Ethereum provider
 * @returns {Promise<string>} - The decrypted prompt
 */
export async function decryptPrompt(encryptedPrompt, encryptedKey, timestamp, provider) {
  try {
    // Get the signer from the provider
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    // Recreate the same message that was signed during encryption
    const message = `Encrypt NFT Prompt: ${timestamp}`;
    
    // Request the user to sign the message again
    console.log('Requesting signature for prompt decryption...');
    const signature = await signer.signMessage(message);
    
    // Derive the same signature hash as during encryption
    const sigHash = CryptoJS.SHA256(signature).toString();
    
    // Decrypt the random key using the signature hash
    const decryptedKeyBytes = CryptoJS.AES.decrypt(encryptedKey, sigHash);
    const randomKeyHex = decryptedKeyBytes.toString(CryptoJS.enc.Utf8);
    
    // Recreate the derived key using the same method as during encryption
    const derivedKey = CryptoJS.PBKDF2(
      randomKeyHex,
      sigHash,
      { keySize: 256/32, iterations: 1000 }
    ).toString();
    
    // Decrypt the prompt using the derived key
    const decryptedPromptBytes = CryptoJS.AES.decrypt(encryptedPrompt, derivedKey);
    const decryptedPrompt = decryptedPromptBytes.toString(CryptoJS.enc.Utf8);
    
    return decryptedPrompt;
  } catch (error) {
    console.error('Error decrypting prompt:', error);
    throw new Error('Failed to decrypt prompt - only the NFT owner can decrypt this prompt');
  }
}

/**
 * Stores data on IPFS using NFT.Storage
 * @param {object} data - The data to store
 * @returns {Promise<string>} - The IPFS CID (Content Identifier)
 */
export async function storeOnIPFS(data) {
  try {
    // Ensure we're on client side and initialize the client if needed
    if (typeof window === 'undefined') {
      throw new Error('NFT.Storage client can only be used in browser environment');
    }
    
    const client = await initNFTStorageClient();
    if (!client) {
      throw new Error('Failed to initialize NFT.Storage client');
    }
    
    console.log('Storing data on IPFS via NFT.Storage...');
    
    // Convert the data to a Blob
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    
    // Store the data using NFT.Storage
    const cid = await client.storeBlob(blob);
    console.log('Data stored successfully with CID:', cid);
    
    return cid;
  } catch (error) {
    console.error('Error storing on IPFS:', error);
    throw new Error(`Failed to store data on IPFS: ${error.message}`);
  }
}

/**
 * Retrieves data from IPFS
 * @param {string} cid - The IPFS CID (Content Identifier)
 * @returns {Promise<object>} - The retrieved data
 */
export async function retrieveFromIPFS(cid) {
  try {
    // Use NFT.Storage's dedicated gateway for better reliability
    const gateway = 'https://nftstorage.link/ipfs/';
    const response = await fetch(`${gateway}${cid}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw new Error(`Failed to retrieve data from IPFS: ${error.message}`);
  }
}
