import { ethers, upgrades, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

interface DeploymentInfo {
  network: string;
  proxy: string;
  implementation: string;
  deployer: string;
  blockNumber: number;
  timestamp: string;
}

async function main(): Promise<DeploymentInfo> {
  console.log("🚀 Deploying Box proxy...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  if (balance < ethers.parseEther("0.01")) {
    throw new Error("Insufficient balance for deployment!");
  }

  // Deploy Box proxy with UUPS pattern
  console.log("Deploying Box proxy...");
  const Box = await ethers.getContractFactory("Box");
  const box = await upgrades.deployProxy(Box, [42], {
    initializer: "initialize",
    kind: "uups",
  });

  await box.waitForDeployment();
  const proxyAddress = await box.getAddress();
  console.log("✓ Box proxy deployed to:", proxyAddress);

  // Get implementation address
  const implementationAddress =
    await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("✓ Implementation deployed to:", implementationAddress);

  // Get block number and timestamp
  const blockNumber = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNumber);
  const timestamp = new Date(
    (block?.timestamp ?? 0) * 1000
  ).toISOString();

  // Create deployment info
  const deploymentInfo: DeploymentInfo = {
    network: network.name,
    proxy: proxyAddress,
    implementation: implementationAddress,
    deployer: deployer.address,
    blockNumber,
    timestamp,
  };

  console.log(
    "📋 Deployment info:",
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Save to file
  const deployDir = path.join("deployments", network.name);
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true });
  }

  const filePath = path.join(deployDir, "deployment.json");
  fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Saved to: ${filePath}`);

  console.log("✅ Deployment complete!");
  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
