import fs from 'fs';
import { ethers } from 'hardhat';
import path from 'path';
import * as tokenJson from '../artifacts/contracts/GoatToken.sol/GoatToken.json';
import { GoatToken } from '../typechain-types/contracts/GoatToken';
import { getSignerProvider, getWallet } from './utils';

async function main() {
  const tokenContractAddress = process.argv[2];
  if (!tokenContractAddress) {
    throw new Error('Token contract address needs to be specified.');
  }

  const receiverAddress = process.argv[3];
  if (!receiverAddress) {
    throw new Error('Receiver address needs to be specified.');
  }

  const metaDataFilePath = process.argv[4];
  if (!metaDataFilePath) {
    throw new Error('Filepath to metadata needs to be specified.');
  }

  const network = process.argv[5];
  if (!network) {
    throw new Error('Network needs to be specified.');
  }

  console.log('Connecting to provider...');
  const wallet = getWallet();
  const { signer } = getSignerProvider(wallet, network);

  console.log(`Attaching to Token contract address ${tokenContractAddress}...`);
  const tokenContract = new ethers.Contract(
    tokenContractAddress,
    tokenJson.abi,
    signer,
  ) as GoatToken;

  const metaDataFile = fs.readFileSync(
    path.resolve(__dirname, '..', metaDataFilePath),
    'utf-8',
  );

  for (const [tokenIndex] of Object.entries(
    JSON.parse(metaDataFile,),
  )) {  
    // @ts-ignore
    const tokenUri = process.env.BACKEND_URL + '/metadata/' + tokenIndex;
    
    console.log(`Minting ${tokenIndex} for address ${receiverAddress}`);

    const safeMintTx = await tokenContract.safeMint(receiverAddress, tokenUri);
    await safeMintTx.wait();

    const currentBalance = await tokenContract.balanceOf(receiverAddress);
    console.log(
      `Account ${receiverAddress} has currently ${parseFloat(
        currentBalance.toString(),
      )} tokens balance`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
