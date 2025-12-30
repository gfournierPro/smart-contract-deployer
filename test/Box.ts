import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Box", function () {
  async function deployFixture() {
    const [owner] = await ethers.getSigners();
    const Box = await ethers.getContractFactory("Box");
    const box = await upgrades.deployProxy(Box, [42], { initializer: 'initialize' });
    return { box, owner };
  }

  describe("Deployment", function () {
    it("Should set the right initial value", async function () {
      const { box } = await loadFixture(deployFixture);
      expect(await box.getValue()).to.equal(42);
    });
  });

  describe("Upgrade", function () {
    it("Should upgrade to V2 and retain storage", async function () {
      const { box } = await loadFixture(deployFixture);
      
      // Upgrade to V2
      const BoxV2 = await ethers.getContractFactory("BoxV2");
      const boxV2 = await upgrades.upgradeProxy(await box.getAddress(), BoxV2);
      
      // Original value preserved
      expect(await boxV2.getValue()).to.equal(42);
      
      // New functionality works
      await boxV2.setText("Hello World");
      expect(await boxV2.getText()).to.equal("Hello World");
    });
  });
});
