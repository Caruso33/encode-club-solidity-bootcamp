import { POSClient, use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-ethers";
import { ethers, providers, utils, Wallet } from "ethers";
import * as readline from "readline";
import "dotenv/config";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

// install ethers plugin
use(Web3ClientPlugin);

async function main() {
  const parentProvider = new providers.JsonRpcProvider(
    process.env.CUSTOM_RPC_URL_ETHEREUM
  );
  const childProvider = new providers.JsonRpcProvider(
    process.env.CUSTOM_RPC_URL_MATIC
  );
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? Wallet.fromMnemonic(process.env.MNEMONIC)
      : new Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);
  const parentSigner = wallet.connect(parentProvider);
  const childSigner = wallet.connect(childProvider);
  const networkParent = await parentSigner.provider.getNetwork();
  console.log(
    `Parent network name: ${networkParent.name}\nChain Id: ${networkParent.chainId}`
  );
  const networkChild = await childSigner.provider.getNetwork();
  console.log(
    `Child network name: ${networkChild.name}\nChain Id: ${networkChild.chainId}`
  );
  const posClient = new POSClient();
  await posClient.init({
    network: "testnet",
    version: "mumbai",
    parent: {
      provider: parentSigner,
      defaultConfig: {
        from: wallet.address,
      },
    },
    child: {
      provider: childSigner,
      defaultConfig: {
        from: wallet.address,
      },
    },
  });
  const balanceBN = await parentSigner.getBalance();
  const balance = Number(utils.formatEther(balanceBN));
  console.log(`Wallet balance in parent network: ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough network tokens");
  }
  const balanceChildBN = await childSigner.getBalance();
  const balanceChild = Number(utils.formatEther(balanceChildBN));
  console.log(`Wallet balance in child network: ${balanceChild}`);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("How many tokens do you want to send?\n", async (ans) => {
    const tokensToSend = ethers.utils.parseEther(ans);
    console.log("\nSending tokens\n");
    const result = await posClient.depositEther(
      tokensToSend.toString(),
      wallet.address,
      {
        returnTransaction: false,
      }
    );
    console.log("Awaiting confirmations\n");
    const txHash = await result.getTransactionHash();
    const txReceipt = await result.getReceipt();
    console.log("Completed\n");
    console.log({ txHash, txReceipt });
    checkStatus(Date.now(), rl, posClient, parentSigner, childSigner);
  });
}

async function checkStatus(
  startingTime: number,
  rl: readline.Interface,
  posClient: POSClient,
  parentSigner: ethers.Wallet,
  childSigner: ethers.Wallet
) {
  const balanceBN = await parentSigner.getBalance();
  const balance = Number(utils.formatEther(balanceBN));
  console.log(`Wallet balance in parent network: ${balance}\n`);
  const balanceChildBN = await childSigner.getBalance();
  const balanceChild = Number(utils.formatEther(balanceChildBN));
  console.log(`Wallet balance in child network: ${balanceChild}\n`);
  console.log(
    `Time elapsed ${(Date.now() - startingTime) / 60 / 1000} minutes\n`
  );
  rl.question("Check deposit status again? [Y/N]\n", (ans) => {
    if (ans.toLowerCase() === "y")
      checkStatus(startingTime, rl, posClient, parentSigner, childSigner);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
