import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiBn from "chai-bn";
import BN from "bn.js";
import { task, HardhatUserConfig } from "hardhat/config";

chai.use(chaiAsPromised);
chai.use(chaiBn(BN));

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const [idx, account] of accounts.entries()) {
    console.log(`\n#${idx + 1}`);
    console.log(`Address: ${account.address}`);

    const balance = await account.getBalance();
    console.log(`Balance: ${hre.ethers.utils.formatEther(balance)} ETH`);
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.6",
  paths: {
    sources: "./smart-contract/contracts",
    tests: "./smart-contract/test",
    cache: "./smart-contract/cache",
    artifacts: "./smart-contract/artifacts",
  },
  typechain: {
    outDir: "./contract-types",
  },
};

export default config;
