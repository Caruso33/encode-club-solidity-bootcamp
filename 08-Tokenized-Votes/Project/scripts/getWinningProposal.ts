import { ethers } from "ethers";
import { getSignerProvider, getWallet } from "./utils";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { CustomBallot } from "../typechain";

async function main() {
  const network = process.argv[2];
  if (!network) {
    throw new Error("Network needs to be specified.");
  }

  const ballotContractAddress = process.argv[3];
  if (!ballotContractAddress) {
    throw new Error("Ballot contract address needs to be specified.");
  }

  console.log("Connecting to provider...");
  const wallet = getWallet();
  const { signer } = getSignerProvider(wallet, network);

  console.log(
    `Attaching to Ballot contract address ${ballotContractAddress}...`
  );
  const ballotContract = new ethers.Contract(
    ballotContractAddress,
    ballotJson.abi,
    signer
  ) as CustomBallot;

  const winningProposalIndex = await ballotContract.winningProposal();
  const proposal = await ballotContract.proposals(winningProposalIndex);

  const proposalName = ethers.utils.parseBytes32String(proposal.name);

  console.log("The winning proposal is:", proposalName);
}

main().catch((error) => {
  throw new Error(error);
});
