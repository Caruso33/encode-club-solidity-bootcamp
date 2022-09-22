import { ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

function setupProvider() {
  const infuraOptions = process.env.INFURA_API_KEY
    ? process.env.INFURA_API_SECRET
      ? {
          projectId: process.env.INFURA_API_KEY,
          projectSecret: process.env.INFURA_API_SECRET,
        }
      : process.env.INFURA_API_KEY
    : "";
  const options = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: infuraOptions,
  };
  const provider = ethers.providers.getDefaultProvider("ropsten", options);
  return provider;
}

async function deploy() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);
  const provider = setupProvider();
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  const proposals = PROPOSALS;
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const ballotFactory = new ethers.ContractFactory(
    ballotJson.abi,
    ballotJson.bytecode,
    signer
  );
  const ballotContract = await ballotFactory.deploy(
    convertStringArrayToBytes32(proposals)
  );
  console.log("Awaiting confirmations");
  await ballotContract.deployed();
  console.log("Completed");
  console.log(`Contract deployed at ${ballotContract.address}`);
  return { ballotContract, provider, signer };
}

function setListeners(
  ballotContract: ethers.Contract,
  provider: ethers.providers.BaseProvider
) {
  console.log("Setting listeners on");
  const eventFilter = ballotContract.filters.NewVoter();
  provider.on(eventFilter, (log: any) => {
    console.log("New voter");
    console.log({ log });
  });
  const eventFilter2 = ballotContract.filters.Voted();
  provider.on(eventFilter2, (log: any) => {
    console.log("New vote cast");
    console.log({ log });
  });
  const eventFilter3 = ballotContract.filters.Delegated();
  provider.on(eventFilter3, (log: any) => {
    console.log("New vote delegation");
    console.log({ log });
  });
  console.log(`Total of ${provider.listenerCount()} listeners set`);
}

async function Populate(
  ballotContract: ethers.Contract,
  provider: ethers.providers.BaseProvider,
  signer: ethers.Signer
) {
  console.log("Populating transactions");
  const wallet1 = ethers.Wallet.createRandom().connect(provider);
  const wallet2 = ethers.Wallet.createRandom().connect(provider);
  const wallet3 = ethers.Wallet.createRandom().connect(provider);
  const wallet4 = ethers.Wallet.createRandom().connect(provider);
  let tx;
  console.log(`Giving right to vote to ${wallet1.address}`);
  tx = await ballotContract.giveRightToVote(wallet1.address);
  await tx.wait();
  console.log(`Giving right to vote to ${wallet2.address}`);
  tx = await ballotContract.giveRightToVote(wallet2.address);
  await tx.wait();
  console.log(`Giving right to vote to ${wallet3.address}`);
  tx = await ballotContract.giveRightToVote(wallet3.address);
  await tx.wait();
  console.log(`Giving right to vote to ${wallet4.address}`);
  tx = await ballotContract.giveRightToVote(wallet4.address);
  await tx.wait();
  console.log(`Funding account ${wallet1.address}`);
  tx = await signer.sendTransaction({
    to: wallet1.address,
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait();
  console.log("Interacting with contract now:");
  tx = await ballotContract.connect(wallet1).vote(0);
  await tx.wait();
  console.log(`Funding account ${wallet2.address}`);
  tx = await signer.sendTransaction({
    to: wallet2.address,
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait();
  console.log("Interacting with contract now:");
  tx = await ballotContract.connect(wallet2).delegate(wallet3.address);
  await tx.wait();
  console.log(`Funding account ${wallet3.address}`);
  tx = await signer.sendTransaction({
    to: wallet3.address,
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait();
  console.log("Interacting with contract now:");
  tx = await ballotContract.connect(wallet3).vote(0);
  await tx.wait();
  console.log(`Funding account ${wallet4.address}`);
  tx = await signer.sendTransaction({
    to: wallet4.address,
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait();
  console.log("Interacting with contract now:");
  tx = await ballotContract.connect(wallet4).delegate(wallet2.address);
  await tx.wait();
  console.log("Done");
}

async function main() {
  const { ballotContract, provider, signer } = await deploy();
  setListeners(ballotContract, provider);
  await Populate(ballotContract, provider, signer);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
