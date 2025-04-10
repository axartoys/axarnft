const hre = require("hardhat");

async function main() {
  const AxarNFT = await hre.ethers.getContractFactory("AxarNFT");
  const axarNFT = await AxarNFT.deploy();
  await axarNFT.deployed();

  console.log("AxarNFT deployed to:", axarNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
