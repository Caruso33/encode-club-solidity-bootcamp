import { ethers } from "hardhat";
import { getSignerProvider, getWallet } from "./utils";
import * as myTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { MyToken } from "../typechain";

async function main() {
  const myTokenContractAddress = process.argv[2];
  if (
    !myTokenContractAddress ||
    !ethers.utils.isAddress(myTokenContractAddress)
  ) {
    throw new Error("MyToken contract address needs to be specified.");
  }
  const network = process.argv[3];
  if (!network) {
    throw new Error("Network needs to be specified.");
  }
  // Optional arguments
  const amount = process.argv[4];
  if (amount && isNaN(Number(amount))) {
    throw new Error("Amount needs to be a number");
  }
  let delegateeAddress = process.argv[5];
  if (delegateeAddress && !ethers.utils.isAddress(delegateeAddress)) {
    throw new Error("Wrong address to delegate voting power/tokens.");
  }

  console.log("Connecting to provider...");
  const wallet = getWallet();
  const { signer } = getSignerProvider(wallet, network);

  // If delegatee address is not specified, we will default to self-delegation
  delegateeAddress = process.argv[5] || wallet.address;

  console.log(
    `Attaching to Token contract address ${myTokenContractAddress}...`
  );
  const myTokenContract = new ethers.Contract(
    myTokenContractAddress,
    myTokenJson.abi,
    signer
  ) as MyToken;

  const priorDelegateVotePower = await myTokenContract.getVotes(
    delegateeAddress
  );

  if (amount) {
    const mintTx = await myTokenContract.mint(
      delegateeAddress,
      ethers.utils.parseEther(amount)
    );
    await mintTx.wait();
    console.log(`Successfully minted ${amount}!`);
  }

  const delegateTx = await myTokenContract.delegate(delegateeAddress);
  await delegateTx.wait();

  const postDelegateVotePower = await myTokenContract.getVotes(
    delegateeAddress
  );

  const isSelfDelegation = wallet.address === delegateeAddress;

  let outputString = `${isSelfDelegation ? "Self-" : ""}Delegation:\n`;
  outputString += `Address ${signer.address} successfully delegated  ${
    amount || 0
  } of voting power to ${delegateeAddress}`;
  outputString += `${isSelfDelegation ? " to self" : ""}\n`;
  outputString += `Current voting power for address ${delegateeAddress} is ${parseFloat(
    ethers.utils.formatEther(postDelegateVotePower)
  )}, was ${parseFloat(ethers.utils.formatEther(priorDelegateVotePower))}`;

  console.log(outputString);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
