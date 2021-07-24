import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiBn from "chai-bn";
import BN from "bn.js";

chai.use(chaiAsPromised);
chai.use(chaiBn(BN));

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.6",
};

export default config;
