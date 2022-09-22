import { ethers } from "ethers";
import "dotenv/config";
import * as tokenJson from "../artifacts/contracts/ERC20.sol/EncodeBootcampMayToken.json";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

const GAS_OPTIONS = {
  maxFeePerGas: 60 * 10 ** 9,
  maxPriorityFeePerGas: 60 * 10 ** 9,
};

function setupProvider() {
  const rpcUrl = process.env.CUSTOM_RPC_URL_MATIC;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return provider;
}

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);
  const provider = setupProvider();
  console.log(`Connected to the node at ${provider.connection.url}`);
  const network = await provider.getNetwork();
  console.log(`Network name: ${network.name}\nChain Id: ${network.chainId}`);
  const lastBlock = await provider.getBlock("latest");
  console.log(`Connected at height: ${lastBlock.number}`);
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough network tokens");
  }
  const maxFeePerGasGwei = ethers.utils.formatUnits(
    GAS_OPTIONS.maxFeePerGas,
    "gwei"
  );
  const maxPriorityFeePerGasGwei = ethers.utils.formatUnits(
    GAS_OPTIONS.maxPriorityFeePerGas,
    "gwei"
  );
  console.log(
    `Using ${maxFeePerGasGwei} maximum Gwei per gas unit and ${maxPriorityFeePerGasGwei} maximum Gwei of priority fee per gas unit`
  );
  console.log("Deploying Token contract");
  const tokenFactory = new ethers.ContractFactory(
    tokenJson.abi,
    tokenJson.bytecode,
    signer
  );
  const tokenContract = await tokenFactory.deploy(GAS_OPTIONS);
  console.log("Awaiting confirmations");
  await tokenContract.deployed();
  console.log("Completed");
  console.log(`Contract deployed at ${tokenContract.address}`);
  const mintTx = await tokenContract.mint(wallet.address, 100);
  await mintTx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
