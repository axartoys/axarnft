const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AxarNFT", function () {
  let AxarNFT;
  let axarNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    AxarNFT = await ethers.getContractFactory("AxarNFT");
    [owner, addr1, addr2] = await ethers.getSigners();
    axarNFT = await AxarNFT.deploy();
    await axarNFT.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await axarNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await axarNFT.name()).to.equal("AxarNFT");
      expect(await axarNFT.symbol()).to.equal("AXAR");
    });
  });

  describe("Minting", function () {
    it("Should create a new token", async function () {
      const tx = await axarNFT.createNFT("Test NFT", "ipfs://test");
      await tx.wait();
      expect(await axarNFT.ownerOf(1)).to.equal(owner.address);
    });

    it("Should store the token text", async function () {
      await axarNFT.createNFT("Test NFT", "ipfs://test");
      expect(await axarNFT.getTokenText(1)).to.equal("Test NFT");
    });
  });

  describe("Metadata", function () {
    beforeEach(async function () {
      await axarNFT.createNFT("Test NFT", "ipfs://test");
    });

    it("Should update metadata if owner", async function () {
      await axarNFT.updateMetadata(1, "ipfs://updated");
      expect(await axarNFT.tokenURI(1)).to.equal("ipfs://updated");
    });

    it("Should not allow non-owners to update metadata", async function () {
      await expect(
        axarNFT.connect(addr1).updateMetadata(1, "ipfs://hacked")
      ).to.be.revertedWith("Caller is not owner nor approved");
    });
  });
});
