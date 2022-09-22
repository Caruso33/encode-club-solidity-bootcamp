/* eslint-disable node/no-missing-import */
import { ethers } from "hardhat";
import * as readline from "readline";
import { Gas } from "../typechain";
import config from "../hardhat.config";

async function main() {
  const userSettings = config?.solidity as any;
  console.log(
    `Using ${userSettings.settings?.optimizer.runs} runs optimization`
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  mainMenu(rl);
}

async function mainMenu(rl: readline.Interface) {
  rl.question(
    "Select operation: \n Options: \n [0]: Exit \n [1]: Compare optimizations \n [2]: Compare location reading and writing choices \n [3]: Compare packing  \n",
    async (answer: string) => {
      console.log(`Selected: ${answer}\n`);
      const option = Number(answer);
      switch (option) {
        case 0:
          rl.close();
          return;
        case 1:
          await compareDeploy();
          break;
        case 2:
          await compareLocations();
          break;
        case 3:
          await comparePacking();
          break;
        default:
          throw new Error("Invalid option");
      }
      mainMenu(rl);
    }
  );
}

const TEST_VALUE = 1000;

async function compareDeploy() {
  const gasContractFactory = await ethers.getContractFactory("Gas");
  let contract: Gas = await gasContractFactory.deploy();
  contract = await contract.deployed();
  const deployTxReceipt = await contract.deployTransaction.wait();
  console.log(`Used ${deployTxReceipt.gasUsed} gas units in deployment`);
  const testTx = await contract.loopActions(TEST_VALUE);
  const testTxReceipt = await testTx.wait();
  console.log(`Used ${testTxReceipt.gasUsed} gas units in test function`);
}

const TEST2_VALUE = 1000;

async function compareLocations() {
  const gasContractFactory = await ethers.getContractFactory("Gas");
  let contract: Gas = await gasContractFactory.deploy();
  contract = await contract.deployed();
  const testTx1 = await contract.updateNumber(TEST2_VALUE);
  const testTx1Receipt = await testTx1.wait();
  console.log(
    `Used ${testTx1Receipt.gasUsed} gas units in storage and local reads test function`
  );
  const testTx2 = await contract.updateNumberOptimized(TEST2_VALUE);
  const testTx2Receipt = await testTx2.wait();
  console.log(
    `Used ${testTx2Receipt.gasUsed} gas units in optimized state and local reads test function`
  );
}

async function comparePacking() {
  const gasContractFactory = await ethers.getContractFactory("Gas");
  let contract: Gas = await gasContractFactory.deploy();
  contract = await contract.deployed();
  const testTx1 = await contract.createUnpacked();
  const testTx1Receipt = await testTx1.wait();
  console.log(
    `Used ${testTx1Receipt.gasUsed} gas units in struct packing test function`
  );
  const testTx2 = await contract.createPacked();
  const testTx2Receipt = await testTx2.wait();
  console.log(
    `Used ${testTx2Receipt.gasUsed} gas units in optimized struct packing test function`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
