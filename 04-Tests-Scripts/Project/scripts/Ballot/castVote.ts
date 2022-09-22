import "dotenv/config";
import { ethers } from "ethers";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
import { getSignerProvider, getWallet } from "./utils";

async function main() {
  const contractAddress = process.argv[2];
  if (!contractAddress) {
    throw new Error("Contract address needs to be specified.");
  }
  const proposalIndex = process.argv[3];
  if (!proposalIndex) {
    throw new Error("Proposal index needs to be specified.");
  }
  const network = process.argv[4] || "localhost";

  const wallet = getWallet();

  const { signer } = getSignerProvider(wallet, network);

  const ballotContract = new ethers.Contract(
    contractAddress,
    ballotJson.abi,
    signer
  );

  const currentProposal = await ballotContract.proposals(proposalIndex);
  console.log(
    `Casting vote on proposal with index : ${proposalIndex}, current vote count : ${currentProposal.voteCount}`
  );
  const tx = await ballotContract.vote(proposalIndex);
  console.log("Awaiting confirmations");
  await tx.wait();
  console.log("Fetching updated data for new proposal");
  const updatedProposal = await ballotContract.proposals(proposalIndex);
  console.log(
    `Proposal with index ${proposalIndex}, new vote count : ${updatedProposal.voteCount}, tx hash : ${tx.hash}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
