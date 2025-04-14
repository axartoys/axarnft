// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AxarPersonaNFT
 * @dev ERC721 token for Axar AI Personas with encrypted prompts
 */
contract AxarPersonaNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    // Mapping for IPFS CIDs containing encrypted prompts
    mapping(uint256 => string) private _promptIPFSHashes;
    
    // Events
    event PersonaMinted(address indexed owner, uint256 indexed tokenId, string promptIPFSHash);
    
    constructor() ERC721("AxarPersona", "AXAR") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new AI Persona NFT with encrypted prompt stored on IPFS
     * @param to The address that will own the minted token
     * @param uri The token URI for metadata
     * @param promptIPFSHash The IPFS hash of the encrypted prompt data
     * @return The ID of the newly minted token
     */
    function mintPersona(
        address to,
        string memory uri,
        string memory promptIPFSHash
    ) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
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
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        return _promptIPFSHashes[tokenId];
    }
    

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        return super._update(to, tokenId, auth);
    }
}
