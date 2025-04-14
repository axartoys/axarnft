// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AxarPersonaNFT
 * @dev ERC721 token for Axar AI Personas with encrypted prompts
 */
contract AxarPersonaNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping for IPFS CIDs containing encrypted prompts
    mapping(uint256 => string) private _promptIPFSHashes;
    
    // Events
    event PersonaMinted(address indexed owner, uint256 indexed tokenId, string promptIPFSHash);
    
    constructor() ERC721("AxarPersona", "AXAR") {}
    
    /**
     * @dev Mint a new AI Persona NFT with encrypted prompt stored on IPFS
     * @param to The address that will own the minted token
     * @param tokenURI The token URI for metadata
     * @param promptIPFSHash The IPFS hash of the encrypted prompt data
     * @return The ID of the newly minted token
     */
    function mintPersona(
        address to,
        string memory tokenURI,
        string memory promptIPFSHash
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _promptIPFSHashes[tokenId] = promptIPFSHash;
        
        emit PersonaMinted(to, tokenId, promptIPFSHash);
        
        return tokenId;
    }
    
    /**
     * @dev Get the IPFS hash of the encrypted prompt for a token
     * @param tokenId The ID of the token
     * @return The IPFS hash of the encrypted prompt
     */
    function getPromptIPFSHash(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        return _promptIPFSHashes[tokenId];
    }
    
    /**
     * @dev Get all tokens owned by an address
     * @param owner The address to query
     * @return An array of token IDs owned by the address
     */
    function getTokensOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokens;
    }
    
    // Override required functions due to multiple inheritance
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
