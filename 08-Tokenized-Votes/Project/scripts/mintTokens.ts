import { ethers } from "hardhat";
import { getSignerProvider, getWallet } from "./utils";
import * as myTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { MyToken } from "../typechain";

async function main() {
  const myTokenContractAddress = process.argv[2];
  if (!myTokenContractAddress) {
    throw new Error("MyToken contract address needs to be specified.");
  }
  const receiverAddress = process.argv[3];
  if (!receiverAddress) {
    throw new Error("Address to send tokens to needs to be specified.");
  }
  const amount = process.argv[4];
  if (!amount || isNaN(Number(amount))) {
    throw new Error("Amount of tokens to be minted needs to be specified.");
  }
  const network = process.argv[5];
  if (!network) {
    throw new Error("Network needs to be specified.");
  }

  console.log("Connecting to provider...");
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

  await myTokenContract.mint(receiverAddress, ethers.utils.parseEther(amount));
  console.log(`Minting ${amount} tokens for address ${receiverAddress}`);
  const currentBalance = await myTokenContract.balanceOf(receiverAddress);
  console.log(
    `Account ${receiverAddress} has currently ${parseFloat(
      ethers.utils.formatEther(currentBalance)
    )} tokens balance`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
