import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Deploying Box proxy...");
  
  const Box = await ethers.getContractFactory("Box");
  const box = await upgrades.deployProxy(Box, [42], {
    initializer: 'initialize',
  });
  
  await box.waitForDeployment();
  console.log("Box proxy deployed to:", await box.getAddress());
  
  const implementation = await upgrades.erc1967.getImplementationAddress(
    await box.getAddress()
  );
  console.log("Implementation deployed to:", implementation);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
