import "dotenv/config";
import { Contract, ethers } from "ethers";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";
import { getSignerProvider, getWallet } from "./utils";

async function main() {
  const network = process.argv[4] || "localhost";

  const wallet = getWallet();

  const { signer } = getSignerProvider(wallet, network);

  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);

  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  if (process.argv.length < 3) throw new Error("Ballot address missing");
  const ballotAddress = process.argv[2];

  if (process.argv.length < 4) throw new Error("Voter address missing");
  const voterAddress = process.argv[3];
  console.log(
    `Attaching ballot contract interface to address ${ballotAddress}`
  );

  const ballotContract: Ballot = new Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  ) as Ballot;

  const chairpersonAddress = await ballotContract.chairperson();

  if (chairpersonAddress !== signer.address)
    throw new Error("Caller is not the chairperson for this contract");

  console.log(`Giving right to vote to ${voterAddress}`);
  const tx = await ballotContract.giveRightToVote(voterAddress);

  console.log("Awaiting confirmations");
  await tx.wait();

  console.log(`Transaction completed. Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
