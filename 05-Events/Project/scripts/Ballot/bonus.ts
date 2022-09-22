import { ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";

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

async function attach() {
  console.log("Attaching Ballot contract");
  const ballotFactory = new ethers.ContractFactory(
    ballotJson.abi,
    ballotJson.bytecode
  );
  const ballotContract = ballotFactory.attach(
    "0x18e9Df30603E5b11E2D729Fa8033Ad5C6273f94B"
  );
  console.log(`Contract attached to ${ballotContract.address}`);
  return ballotContract;
}

function setFilters(
  ballotContract: ethers.Contract,
  provider: ethers.providers.BaseProvider
) {
  const ballotContractConnected = ballotContract.connect(provider);
  const deploymentBlock = 12477100;
  const lastBlock = 12477126;
  console.log("Setting query filters on:\n");
  console.log("Querying for the event name NewVoter");
  const eventFilterNewVoter = ballotContractConnected.filters.NewVoter();
  ballotContractConnected
    .queryFilter(eventFilterNewVoter, deploymentBlock, lastBlock)
    .then((events) => {
      events.forEach((event) => {
        console.log("Event:");
        console.log(event);
        const data = event.data;
        const topics = event.topics;
        console.log("Packed data:");
        console.log(data);
        console.log("Packed topics:");
        console.log(topics);
        const parsedEvent = ballotContract.interface.parseLog({
          topics: topics,
          data: data,
        });
        console.log("Parsed Event using interface:");
        console.log({ parsedEvent });
      });
    });
  console.log("Querying for the event name Voted");
  const eventFilterVoted = ballotContractConnected.filters.Voted();
  ballotContractConnected
    .queryFilter(eventFilterVoted, deploymentBlock, lastBlock)
    .then((events) => {
      events.forEach((event) => {
        console.log("Event:");
        console.log(event);
        const data = event.data;
        const topics = event.topics;
        console.log("Packed data:");
        console.log(data);
        console.log("Packed topics:");
        console.log(topics);
        const parsedEvent = ballotContract.interface.parseLog({
          topics: topics,
          data: data,
        });
        console.log("Parsed Event using interface:");
        console.log({ parsedEvent });
      });
    });
  console.log("Querying for the event name Delegated");
  const eventFilterDelegated = ballotContractConnected.filters.Delegated();
  ballotContractConnected
    .queryFilter(eventFilterDelegated, deploymentBlock, lastBlock)
    .then((events) => {
      events.forEach((event) => {
        console.log("Event:");
        console.log(event);
        const data = event.data;
        const topics = event.topics;
        console.log("Packed data:");
        console.log(data);
        console.log("Packed topics:");
        console.log(topics);
        const parsedEvent = ballotContract.interface.parseLog({
          topics: topics,
          data: data,
        });
        console.log("Parsed Event using interface:");
        console.log({ parsedEvent });
      });
    });
}

async function main() {
  const provider = setupProvider();
  const ballotContract = await attach();
  setFilters(ballotContract, provider);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
