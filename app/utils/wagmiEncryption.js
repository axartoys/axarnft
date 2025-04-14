'use client';

import CryptoJS from 'crypto-js';
import { useSignMessage } from 'wagmi';

/**
 * Encrypts a prompt using a signature from the user's wallet
 * @param {string} prompt - The prompt to encrypt
 * @param {string} address - The user's wallet address
 * @param {function} signMessageAsync - The wagmi signMessageAsync function
 * @returns {Promise<Object>} - The encrypted data object
 */
export const encryptPrompt = async (prompt, address, signMessageAsync) => {
  try {
    // Generate a timestamp for this encryption
    const timestamp = Date.now().toString();
    
    // Create a message to sign
    const message = `Sign this message to securely encrypt your AI persona prompt. This doesn't cost any gas and keeps your prompt secure.\n\nAddress: ${address}\nTimestamp: ${timestamp}`;
    
    // Get signature from wallet
    const signature = await signMessageAsync({ message });
    
    // Use the signature to derive an encryption key
    const signatureHash = CryptoJS.SHA256(signature).toString();
    
    // Generate a random key for AES encryption
    const randomKey = CryptoJS.lib.WordArray.random(16);
    const randomKeyHex = randomKey.toString();
    
    // Encrypt the prompt with the random key
    const encryptedPrompt = CryptoJS.AES.encrypt(prompt, randomKeyHex).toString();
    
    // Encrypt the random key with the signature hash
    const encryptedKey = CryptoJS.AES.encrypt(randomKeyHex, signatureHash).toString();
    
    // Return the encrypted data
    return {
      encryptedPrompt,
      encryptedKey,
      timestamp
    };
  } catch (error) {
    console.error('Error encrypting prompt:', error);
    throw new Error('Failed to encrypt prompt');
  }
};

/**
 * Decrypts a prompt using a signature from the user's wallet
 * @param {string} encryptedPrompt - The encrypted prompt
 * @param {string} encryptedKey - The encrypted random key
 * @param {string} timestamp - The timestamp used during encryption
 * @param {string} address - The user's wallet address
 * @param {function} signMessageAsync - The wagmi signMessageAsync function
 * @returns {Promise<string>} - The decrypted prompt
 */
export const decryptPrompt = async (encryptedPrompt, encryptedKey, timestamp, address, signMessageAsync) => {
  try {
    // Create the same message that was used during encryption
    const message = `Sign this message to securely encrypt your AI persona prompt. This doesn't cost any gas and keeps your prompt secure.\n\nAddress: ${address}\nTimestamp: ${timestamp}`;
    
    // Get signature from wallet
    const signature = await signMessageAsync({ message });
    
    // Use the signature to derive the same encryption key
    const signatureHash = CryptoJS.SHA256(signature).toString();
    
    // Decrypt the random key
    const decryptedKeyBytes = CryptoJS.AES.decrypt(encryptedKey, signatureHash);
    const randomKey = decryptedKeyBytes.toString(CryptoJS.enc.Utf8);
    
    // Decrypt the prompt with the random key
    const decryptedPromptBytes = CryptoJS.AES.decrypt(encryptedPrompt, randomKey);
    const decryptedPrompt = decryptedPromptBytes.toString(CryptoJS.enc.Utf8);
    
    return decryptedPrompt;
  } catch (error) {
    console.error('Error decrypting prompt:', error);
    throw new Error('Failed to decrypt prompt');
  }
};

/**
 * React hook for using the encryption utilities with wagmi
 */
export const useEncryption = () => {
  const { signMessageAsync } = useSignMessage();
  
  return {
    encryptPrompt: async (prompt, address) => {
      return encryptPrompt(prompt, address, signMessageAsync);
    },
    decryptPrompt: async (encryptedPrompt, encryptedKey, timestamp, address) => {
      return decryptPrompt(encryptedPrompt, encryptedKey, timestamp, address, signMessageAsync);
    }
  };
};
