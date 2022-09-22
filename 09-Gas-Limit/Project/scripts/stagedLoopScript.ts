import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { CorrectSortedBallot } from "../typechain";
import "dotenv/config";
import words from "random-words";

const BLOCK_GAS_LIMIT = 30000000;
const WORD_COUNT = 300;
const STEP_SIZE = 10000;

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const ballotFactory = await ethers.getContractFactory("CorrectSortedBallot");
  const proposals = words({ exactly: WORD_COUNT });
  const ballotContract: CorrectSortedBallot = await ballotFactory.deploy(
    convertStringArrayToBytes32(proposals)
  );
  await ballotContract.deployed();
  let completed = false;
  while (!completed) {
    console.log("Sorting proposals");
    const sortTx = await ballotContract.sortProposals(STEP_SIZE);
    console.log("Awaiting confirmations");
    const sortReceipt = await sortTx.wait();
    console.log("Operation completed");
    const percentUsed = sortReceipt.gasUsed
      .mul(100)
      .div(BLOCK_GAS_LIMIT)
      .toNumber();
    console.log(
      `${sortReceipt.gasUsed} units of gas used at ${ethers.utils.formatUnits(
        sortReceipt.effectiveGasPrice,
        "gwei"
      )} GWEI effective gas price, total of ${ethers.utils.formatEther(
        sortReceipt.effectiveGasPrice.mul(sortReceipt.gasUsed)
      )} ETH spent. This used ${percentUsed} % of the block gas limit`
    );
    const [sortedWords, savedIndex, lastIndex] = await Promise.all([
      ballotContract.sortedWords(),
      ballotContract.savedIndex(),
      ballotContract.lastIndex(),
    ]);
    const props = [];
    for (let index = 0; sortedWords.gt(index); index++) {
      const prop = await ballotContract.proposalsBeingSorted(index);
      props.push(ethers.utils.parseBytes32String(prop.name));
    }
    console.log(
      `Currently sorting word ${sortedWords.add(
        1
      )}, starting at position ${savedIndex}, where the word ${lastIndex} is the best candidate so far `
    );
    completed = await ballotContract.sorted();
    console.log(
      `The sorting process has${completed ? " " : " not "}been completed`
    );
    if (completed) {
      console.log(`Passed ${WORD_COUNT} proposals:`);
      console.log(proposals.join(", "));
      console.log(`Sorted ${sortedWords} proposals: `);
      console.log(props.join(", "));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
