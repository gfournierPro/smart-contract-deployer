import { ethers, upgrades } from "hardhat";

async function main() {
  const proxyAddress = "0x..."; // Address from deploy step
  
  console.log("Upgrading Box at", proxyAddress);
  
  const BoxV2 = await ethers.getContractFactory("BoxV2");
  const boxV2 = await upgrades.upgradeProxy(proxyAddress, BoxV2);
  
  console.log("BoxV2 upgraded and initialized");
  
  const implementation = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("New implementation:", implementation);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
