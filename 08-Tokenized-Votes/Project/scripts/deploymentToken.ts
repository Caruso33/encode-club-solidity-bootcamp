import "dotenv/config";
import { ethers } from "ethers";
import * as myTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";

import { getSignerProvider, getVotingAddresses, getWallet } from "./utils";

async function main() {
  const BASE_MINT_AMOUNT = 20;
  const network = process.argv[2];

  const wallet = getWallet();

  const { signer } = getSignerProvider(wallet, network);
  const signerAddress = await signer.getAddress();
  const balanceBN = await signer.getBalance();
  const balance = Number(
    parseFloat(ethers.utils.formatEther(balanceBN)).toFixed(4)
  );
  console.log(`Wallet balance ${balance}`);

  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  console.log("__________________________________________________");

  console.log("Deploying MyToken contract");
  const myTokenFactory = new ethers.ContractFactory(
    myTokenJson.abi,
    myTokenJson.bytecode,
    signer
  );
  const myTokenContract = await myTokenFactory.deploy();

  console.log("Awaiting confirmations");
  await myTokenContract.deployed();

  console.log(`Contract deployed at ${myTokenContract.address}`);

  // minting for signer
  const previousBalanceTx = await myTokenContract.balanceOf(signerAddress);
  console.log(
    `Minting tokens for address ${signerAddress}, previous balance : ${parseFloat(
      ethers.utils.formatEther(previousBalanceTx)
    )} tokens...`
  );
  const mintTx = await myTokenContract.mint(
    signerAddress,
    ethers.utils.parseEther(BASE_MINT_AMOUNT.toFixed(18))
  );
  await mintTx.wait();
  const newBalanceTx = await myTokenContract.balanceOf(signerAddress);
  console.log(
    `Minted tokens for address ${signerAddress}, new balance : ${parseFloat(
      ethers.utils.formatEther(newBalanceTx)
    )} tokens.\n`
  );

  // minting for preset addresses
  const voterAddresses = (await getVotingAddresses(network)).filter(
    (address) => address !== signerAddress
  );

  if (voterAddresses.length !== 0) {
    console.log("Minting for preset addresses...");
  }
  for (const voterAddress of voterAddresses) {
    console.log(`Minting ${BASE_MINT_AMOUNT} tokens to ${voterAddress}...`);
    await myTokenContract.mint(
      voterAddress,
      ethers.utils.parseEther(BASE_MINT_AMOUNT.toFixed(18))
    );
  }

  // delegation
  console.log(
    "\nSelf delegating to track voting power and enable checkpoints..."
  );
  const previousVotesTx = await myTokenContract.getVotes(signerAddress);
  const delegateTx = await myTokenContract.delegate(signer.address);
  await delegateTx.wait();
  const newVotesTx = await myTokenContract.getVotes(signerAddress);
  console.log(
    `Address ${signerAddress}, previous votes: ${parseFloat(
      ethers.utils.formatEther(previousVotesTx)
    )} current votes: ${parseFloat(ethers.utils.formatEther(newVotesTx))}`
  );

  console.log("Completed");

  console.log("__________________________________________________");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
