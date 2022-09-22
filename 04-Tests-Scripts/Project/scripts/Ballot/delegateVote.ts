import "dotenv/config";
import { ethers } from "ethers";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
import { getSignerProvider, getWallet } from "./utils";

async function main() {
  const contractAddress = process.argv[2];
  if (!contractAddress) {
    throw new Error("Contract address needs to be specified.");
  }
  const delegateAddress = process.argv[3];
  if (!delegateAddress) {
    throw new Error("Delegate address needs to be specified.");
  }
  const network = process.argv[4] || "localhost";

  const wallet = getWallet();

  const { signer } = getSignerProvider(wallet, network);

  const ballotContract = new ethers.Contract(
    contractAddress,
    ballotJson.abi,
    signer
  );

  console.log(`Delegating vote to ${delegateAddress}`);
  const tx = await ballotContract.delegate(delegateAddress);

  console.log("Awaiting confirmations");
  await tx.wait();

  console.log(`Transaction completed. Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
