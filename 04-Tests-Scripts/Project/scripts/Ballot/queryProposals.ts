import "dotenv/config";
import { ethers } from "ethers";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
import { getSignerProvider, getWallet } from "./utils";

async function main() {
  const contractAddress = process.argv[2];
  if (!contractAddress) {
    throw new Error("Contract address needs to be specified.");
  }
  const network = process.argv[3] || "localhost";

  const wallet = getWallet();

  const { signer } = getSignerProvider(wallet, network);

  const ballotContract = new ethers.Contract(
    contractAddress,
    ballotJson.abi,
    signer
  );

  let index = 0;
  let hasProposal = true;
  while (hasProposal) {
    try {
      const proposal = await ballotContract.proposals(index);

      const proposalString = ethers.utils.parseBytes32String(proposal.name);
      const proposalVoteCount = proposal.voteCount;

      console.log(
        `Proposal ${index}: ${proposalString}, vote count  ${proposalVoteCount}`
      );
      index++;
    } catch (e) {
      hasProposal = false;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
