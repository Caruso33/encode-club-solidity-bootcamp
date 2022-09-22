import 'dotenv/config';
import { ethers } from 'hardhat';
import * as tokenJson from '../artifacts/contracts/GoatToken.sol/GoatToken.json';

import { getSignerProvider, getWallet } from './utils';

async function main() {
  const network = process.argv[2];

  const wallet = getWallet();

  const { signer } = getSignerProvider(wallet, network);

  const balanceBN = await signer.getBalance();
  const balance = Number(
    parseFloat(ethers.utils.formatEther(balanceBN)).toFixed(4),
  );
  console.log(`Wallet balance ${balance}`);

  if (balance < 0.01) {
    throw new Error('Not enough ether');
  }

  console.log('__________________________________________________');

  console.log('Deploying Token contract');
  const myTokenFactory = new ethers.ContractFactory(
    tokenJson.abi,
    tokenJson.bytecode,
    signer,
  );
  const tokenContract = await myTokenFactory.deploy();

  console.log('Awaiting confirmations');
  await tokenContract.deployed();

  console.log(`Contract deployed at ${tokenContract.address}`);

  console.log('Completed');

  console.log('__________________________________________________');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
