const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const AxarPersonaNFT = await hre.ethers.getContractFactory("AxarPersonaNFT");
  console.log("Deploying AxarPersonaNFT...");
  const axarPersonaNFT = await AxarPersonaNFT.deploy();

  console.log("AxarPersonaNFT deployed to:", axarPersonaNFT.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
