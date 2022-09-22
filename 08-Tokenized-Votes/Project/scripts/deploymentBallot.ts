import "dotenv/config";
import { ethers } from "ethers";
import * as customBalletJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { getSignerProvider, getWallet } from "./utils";

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const network = process.argv[2];
  const tokenAddress = process.argv[3];

  if (!ethers.utils.isAddress(tokenAddress)) {
    throw new Error("Token address is required");
  }

  const wallet = getWallet();

  const { signer } = getSignerProvider(wallet, network);

  const balanceBN = await signer.getBalance();
  const balance = Number(
    parseFloat(ethers.utils.formatEther(balanceBN)).toFixed(4)
  );
  console.log(`Wallet balance ${balance}`);

  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  console.log("__________________________________________________");

  console.log("Deploying CustomBallot contract");

  console.log("Proposals: ");
  const proposals = process.argv.slice(4);
  if (proposals.length < 2) throw new Error("Not enough proposals provided");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const customBallotFactory = new ethers.ContractFactory(
    customBalletJson.abi,
    customBalletJson.bytecode,
    signer
  );
  const customBallotContract = await customBallotFactory.deploy(
    convertStringArrayToBytes32(proposals),
    tokenAddress
  );

  console.log("Awaiting confirmations");
  await customBallotContract.deployed();

  console.log("Completed");
  console.log(`Contract deployed at ${customBallotContract.address}`);

  console.log("__________________________________________________");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
