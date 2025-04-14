'use client';

// Helper function to create IPFS gateway URL
const getIPFSGatewayURL = (hash) => {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

// Get Pinata JWT token
const getPinataJWT = () => {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
  if (!jwt) {
    throw new Error('Pinata JWT missing. Please check your .env.local file.');
  }
  return jwt;
};

// Helper function for Pinata API calls
const pinataApi = async (endpoint, options = {}) => {
  const baseUrl = 'https://api.pinata.cloud';
  const jwt = getPinataJWT();

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${jwt}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to call Pinata API');
  }

  return response.json();
};

// Create client when needed instead of at module load time
// This ensures environment variables are properly loaded

/**
 * Store JSON data on IPFS using NFT.Storage
 * @param {Object} data - The data to store on IPFS
 * @returns {Promise<string>} - The IPFS CID (Content Identifier)
 */
export const storeOnIPFS = async (data) => {
  try {
    const result = await pinataApi('/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: `NFT_Metadata_${Date.now()}`,
          keyvalues: {
            type: 'metadata',
            timestamp: Date.now().toString()
          }
        }
      })
    });

    return getIPFSGatewayURL(result.IpfsHash);
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
export const storeImageOnIPFS = async (imageFile, metadata = {}) => {
  try {
    const formData = new FormData();
    
    // Create metadata JSON
    const pinataMetadata = JSON.stringify({
      name: `NFT_Image_${Date.now()}`,
      keyvalues: {
        type: 'image',
        ...metadata,
        timestamp: Date.now().toString()
      }
    });

    formData.append('pinataMetadata', pinataMetadata);
    formData.append('file', imageFile);

    const result = await pinataApi('/pinning/pinFileToIPFS', {
      method: 'POST',
      body: formData
    });

    return {
      url: getIPFSGatewayURL(result.IpfsHash),
      ipfsHash: result.IpfsHash,
      metadata
    };
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
    // First try to use the NFT.Storage client if available
    try {
      const client = getNFTStorageClient();
      const data = await client.get(cid);
      if (data) {
        const files = await data.files();
        if (files.length > 0) {
          const text = await files[0].text();
          return JSON.parse(text);
        }
      }
    } catch (clientError) {
      console.warn('Failed to retrieve from NFT.Storage client, falling back to IPFS gateway:', clientError);
    }
    
    // Fallback to IPFS gateway
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
