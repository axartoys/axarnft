'use client';

import { NFTStorage } from 'nft.storage';

// Initialize the NFT.Storage client
const client = new NFTStorage({ 
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY 
});

/**
 * Store JSON data on IPFS using NFT.Storage
 * @param {Object} data - The data to store on IPFS
 * @returns {Promise<string>} - The IPFS CID (Content Identifier)
 */
export const storeOnIPFS = async (data) => {
  try {
    // Store the data as a JSON blob
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const cid = await client.storeBlob(blob);
    return cid;
  } catch (error) {
    console.error('Error storing data on IPFS:', error);
    throw new Error(`Failed to store data on IPFS: ${error.message}`);
  }
};

/**
 * Store an image on IPFS using NFT.Storage
 * @param {Blob|File} imageFile - The image file to store
 * @returns {Promise<string>} - The IPFS CID (Content Identifier)
 */
export const storeImageOnIPFS = async (imageFile) => {
  try {
    const cid = await client.storeBlob(imageFile);
    return cid;
  } catch (error) {
    console.error('Error storing image on IPFS:', error);
    throw new Error(`Failed to store image on IPFS: ${error.message}`);
  }
};

/**
 * Store NFT metadata on IPFS using NFT.Storage
 * @param {Object} metadata - The NFT metadata
 * @param {File|Blob} imageFile - The image file
 * @returns {Promise<string>} - The IPFS URL for the metadata
 */
export const storeNFTData = async (metadata, imageFile) => {
  try {
    // Store the image and get its CID
    const imageCid = await storeImageOnIPFS(imageFile);
    
    // Create the NFT metadata with the image URL
    const nftMetadata = {
      ...metadata,
      image: `ipfs://${imageCid}`
    };
    
    // Store the metadata and get its CID
    const metadataCid = await storeOnIPFS(nftMetadata);
    
    return {
      metadataCid,
      imageCid,
      metadataUrl: `ipfs://${metadataCid}`,
      imageUrl: `ipfs://${imageCid}`
    };
  } catch (error) {
    console.error('Error storing NFT data on IPFS:', error);
    throw new Error(`Failed to store NFT data on IPFS: ${error.message}`);
  }
};

/**
 * Retrieve data from IPFS using the CID
 * @param {string} cid - The IPFS CID (Content Identifier)
 * @returns {Promise<Object>} - The retrieved data
 */
export const retrieveFromIPFS = async (cid) => {
  try {
    // Construct the IPFS gateway URL
    const url = `https://ipfs.io/ipfs/${cid}`;
    
    // Fetch the data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }
    
    // Parse the JSON data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving data from IPFS:', error);
    throw new Error(`Failed to retrieve data from IPFS: ${error.message}`);
  }
};
