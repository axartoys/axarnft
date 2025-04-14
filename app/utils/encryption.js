'use client';

import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';
import { encrypt } from '@metamask/eth-sig-util';

// Initialize variables that will be set on client side
let ipfsClient = null;

// Function to initialize IPFS client only on the client side
const initIPFSClient = async () => {
  if (typeof window === 'undefined') return null;
  if (ipfsClient) return ipfsClient;
  
  try {
    const { create } = await import('ipfs-http-client');
    const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID || '';
    const projectSecret = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET || '';
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

    ipfsClient = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth,
      },
    });
    
    return ipfsClient;
  } catch (error) {
    console.error('Error initializing IPFS client:', error);
    return null;
  }
};

/**
 * Encrypts a prompt using the user's public key derived from their Ethereum address
 * @param {string} prompt - The prompt to encrypt
 * @param {object} provider - The Ethereum provider from MetaMask
 * @returns {Promise<object>} - The encrypted prompt and key
 */
export async function encryptPrompt(prompt, provider) {
  try {
    // Generate a random symmetric key for AES encryption
    const symmetricKey = CryptoJS.lib.WordArray.random(32); // 256 bits
    const symmetricKeyHex = symmetricKey.toString(CryptoJS.enc.Hex);
    
    // Encrypt the prompt with AES using the symmetric key
    const encryptedPrompt = CryptoJS.AES.encrypt(prompt, symmetricKeyHex).toString();
    
    // Get the user's Ethereum address
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    // Request the user to sign a message to derive encryption key
    const message = `Sign this message to securely encrypt your AI persona prompt. This doesn't cost any gas and keeps your prompt secure.\n\nAddress: ${address}\nTimestamp: ${Date.now()}`;
    const signature = await signer.signMessage(message);
    
    // Use the signature as an encryption key
    const encryptionKey = CryptoJS.SHA256(signature).toString();
    
    // Encrypt the symmetric key with the derived encryption key
    const encryptedKey = CryptoJS.AES.encrypt(symmetricKeyHex, encryptionKey).toString();
    
    return {
      encryptedPrompt,
      encryptedKey,
      encryptionKey // This will be used for decryption later
    };
  } catch (error) {
    console.error('Error encrypting prompt:', error);
    throw new Error('Failed to encrypt prompt');
  }
}

/**
 * Decrypts a prompt using the encryption key
 * @param {string} encryptedPrompt - The encrypted prompt
 * @param {string} encryptedKey - The encrypted symmetric key
 * @param {string} encryptionKey - The encryption key derived from signature
 * @returns {string} - The decrypted prompt
 */
export function decryptPrompt(encryptedPrompt, encryptedKey, encryptionKey) {
  try {
    // Decrypt the symmetric key
    const decryptedKeyBytes = CryptoJS.AES.decrypt(encryptedKey, encryptionKey);
    const symmetricKey = decryptedKeyBytes.toString(CryptoJS.enc.Utf8);
    
    // Use the symmetric key to decrypt the prompt
    const decryptedPromptBytes = CryptoJS.AES.decrypt(encryptedPrompt, symmetricKey);
    const decryptedPrompt = decryptedPromptBytes.toString(CryptoJS.enc.Utf8);
    
    return decryptedPrompt;
  } catch (error) {
    console.error('Error decrypting prompt:', error);
    throw new Error('Failed to decrypt prompt');
  }
}

/**
 * Stores data on IPFS
 * @param {object} data - The data to store
 * @returns {Promise<string>} - The IPFS CID (Content Identifier)
 */
export async function storeOnIPFS(data) {
  try {
    // Ensure we're on client side and initialize the client if needed
    if (typeof window === 'undefined') {
      throw new Error('IPFS client can only be used in browser environment');
    }
    
    const client = await initIPFSClient();
    if (!client) {
      throw new Error('Failed to initialize IPFS client');
    }
    
    const result = await client.add(JSON.stringify(data));
    return result.path;
  } catch (error) {
    console.error('Error storing on IPFS:', error);
    throw new Error('Failed to store data on IPFS');
  }
}

/**
 * Retrieves data from IPFS
 * @param {string} cid - The IPFS CID (Content Identifier)
 * @returns {Promise<object>} - The retrieved data
 */
export async function retrieveFromIPFS(cid) {
  try {
    const gateway = 'https://ipfs.io/ipfs/';
    const response = await fetch(`${gateway}${cid}`);
    return await response.json();
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw new Error('Failed to retrieve data from IPFS');
  }
}
