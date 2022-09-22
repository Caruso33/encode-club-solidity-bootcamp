import { ethers } from "ethers";
import { getSignerProvider, getWallet } from "./utils";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { CustomBallot } from "../typechain";

async function main() {
  const ballotContractAddress = process.argv[2];
  if (!ballotContractAddress) {
    throw new Error("Ballot contract address needs to be specified.");
  }
  const network = process.argv[3];
  if (!network) {
    throw new Error("Network needs to be specified.");
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

  const proposals = await ballotContract.getProposals();
  let string = `\n      Contract Address:  ${ballotContract.address}`;
  await proposals.map((proposal) => {
    string = string.concat(`
      -----------------------------------------------------
      Name:  ${ethers.utils.parseBytes32String(proposal.name)}
      Vote count:  ${parseFloat(
        ethers.utils.formatEther(proposal.voteCount)
      )}`);
  });
  const winningProposal = await ballotContract.winnerName();
  string = string.concat(`
      -----------------------------------------------------
      Winning proposal: ${ethers.utils.parseBytes32String(winningProposal)}`);
  console.log(string);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
