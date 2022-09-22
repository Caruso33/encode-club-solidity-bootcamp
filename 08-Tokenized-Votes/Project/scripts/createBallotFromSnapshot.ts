import { ethers } from "ethers";
import { getSignerProvider, getWallet } from "./utils";
import * as myTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { MyToken } from "../typechain";
import childProcess from "child_process";

async function main() {
  /*
    To create a ballot from a snapshot we trigger the snapshot by self-delegating.
    This is how it the snapshot/checkpoint of the ERC20Votes works, as we can read
    on the comments on the ERC20Votes.sol file
    */
  // Phase 1: Self-delegation
  const myTokenContractAddress = process.argv[2];
  if (!myTokenContractAddress) {
    throw new Error("MyToken contract address needs to be specified.");
  }
  const network = process.argv[3];
  if (!network) {
    throw new Error("Network needs to be specified.");
  }
  // Optional argument
  const amount = process.argv[3];

  const wallet = getWallet();
  const { signer } = getSignerProvider(wallet, network);

  console.log(
    `Attaching to Token contract address ${myTokenContractAddress}...`
  );
  const myTokenContract = new ethers.Contract(
    myTokenContractAddress,
    myTokenJson.abi,
    signer
  ) as MyToken;

  // We check here that we're successfully creating the snapshot/checkpoint
  let currentCheckpointsNumber = await myTokenContract.numCheckpoints(
    wallet.address
  );
  console.log(
    `Number of checkpoints prior the self-delegation is ${currentCheckpointsNumber}`
  );

  const selfDelegate = childProcess.fork(__dirname + "/delegate", [
    myTokenContractAddress,
    network,
    amount,
  ]);

  // Phase 2: deploy ballot
  selfDelegate.on("exit", async () => {
    currentCheckpointsNumber = await myTokenContract.numCheckpoints(
      wallet.address
    );
    console.log(
      `Number of checkpoints after the self-delegation is ${currentCheckpointsNumber}`
    );

    const deployBallot = childProcess.fork(__dirname + "/deploymentBallot", [
      network,
      myTokenContractAddress,
      `Pizza`,
      `Lasagna`,
      `Icecream`,
    ]);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
