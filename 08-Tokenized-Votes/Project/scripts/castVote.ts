import { ethers } from "ethers";
import { getSignerProvider, getWallet } from "./utils";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as myTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { CustomBallot, MyToken } from "../typechain";

async function main() {
  const BASE_VOTE_POWER = 5;

  const ballotContractAddress = process.argv[2];
  if (!ballotContractAddress) {
    throw new Error("Ballot contract address needs to be specified.");
  }
  const myTokenContractAddress = process.argv[3];
  if (!myTokenContractAddress) {
    throw new Error("MyToken contract address needs to be specified.");
  }
  const proposalIndexToVote = process.argv[4];
  if (!proposalIndexToVote) {
    throw new Error("Proposal index to vote on needs to be specified.");
  }
  const network = process.argv[5];
  if (!network) {
    throw new Error("Network needs to be specified.");
  }

  console.log("Connecting to provider...");
  const wallet = getWallet();
  const { signer } = getSignerProvider(wallet, network);
  const signerAddress = await signer.getAddress();

  console.log(
    `Attaching to Ballot contract address ${ballotContractAddress}...`
  );
  const ballotContract = new ethers.Contract(
    ballotContractAddress,
    ballotJson.abi,
    signer
  ) as CustomBallot;
  console.log(
    `Attaching to MyToken contract address ${myTokenContractAddress}...`
  );
  const myTokenContract = new ethers.Contract(
    myTokenContractAddress,
    myTokenJson.abi,
    signer
  ) as MyToken;

  const currentProposalToVote = await ballotContract.proposals(
    proposalIndexToVote
  );
  console.log(
    `Proposal to vote on has currently ${parseFloat(
      ethers.utils.formatEther(currentProposalToVote.voteCount)
    )} votes.`
  );

  console.log(
    `Casting vote on proposal index ${proposalIndexToVote} using ${BASE_VOTE_POWER} of voting power...`
  );

  const voteTx = await ballotContract.vote(
    proposalIndexToVote,
    ethers.utils.parseEther(BASE_VOTE_POWER.toFixed(18))
  );

  await voteTx.wait();

  const proposalUpdated = await ballotContract.proposals(proposalIndexToVote);
  console.log(
    `Proposal to vote on has now ${parseFloat(
      ethers.utils.formatEther(proposalUpdated.voteCount)
    )} votes.`
  );
  const votingPowerAfter = await ballotContract.votingPower();
  console.log(
    `Account ${signerAddress} has now ${parseFloat(
      ethers.utils.formatEther(votingPowerAfter)
    )} voting power left.`
  );
  const spentVotePower = await ballotContract.spentVotePower(signerAddress);
  console.log(
    `Spent voting power for ${signerAddress}: ${parseFloat(
      ethers.utils.formatEther(spentVotePower)
    )}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
