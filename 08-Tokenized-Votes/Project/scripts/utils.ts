import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

function getWallet(): ethers.Wallet {
  // This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
  // Do never expose your keys like this
  const EXPOSED_KEY =
    "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

  const isUsingMnemonic =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0;
  const path = `m/44'/60'/0'/0/0`; // change last 0 for using a different account

  const wallet = isUsingMnemonic
    ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC!, path)
    : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);

  return wallet;
}

function getSignerProvider(
  wallet: ethers.Wallet,
  network: string
): {
  provider: ethers.providers.JsonRpcProvider | ethers.providers.BaseProvider;
  signer: ethers.Wallet;
} {
  let provider:
    | ethers.providers.JsonRpcProvider
    | ethers.providers.BaseProvider;
  if (network === "localhost") {
    provider = new ethers.providers.JsonRpcProvider();
  } else {
    const options: Record<string, any> = {};
    if (process.env.ETHERSCAN_API_KEY)
      options.etherscan = process.env.ETHERSCAN_API_KEY;
    if (process.env.INFURA_URL) options.infura = process.env.INFURA_URL;

    provider = ethers.providers.getDefaultProvider(network, options);
  }
  const signer = wallet.connect(provider);

  return { provider, signer };
}

const testNetVoters = [
  {
    address: "0x49E499F56dA1aFd2c734584a2f3e5E7B5ad72ebb",
    owner: "Luc",
  },
  {
    address: "0x10f403726407d55de84ac831405516Fc4821b937",
    owner: "Alok",
  },
  {
    address: "0x4bFC74983D6338D3395A00118546614bB78472c2",
    owner: "Tobias",
  },
  {
    address: "0xD89ffDef0d21c3E03A6AF09Aa31695B6e0414c31",
    owner: "Vid",
  },
  {
    address: "0x5Ed02CF700D92d64776e11c6E85D2D7d11e9bcf8",
    owner: "Bitcoinera",
  },
];

async function getVotingAddresses(network: string) {
  if (network !== "localhost") {
    return testNetVoters.map((voter) => voter.address);
  } else {
    const isUsingMnemonic =
      process.env.MNEMONIC && process.env.MNEMONIC.length > 0;

    if (!isUsingMnemonic) return [];

    const voters = [];
    for (let i = 0; i < 5; i++) {
      const path = `m/44'/60'/0'/0/${i}`;
      const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC!, path);
      const { signer } = getSignerProvider(wallet, network);

      voters.push(await signer.getAddress());
    }
    return voters;
  }
}

export { getWallet, getSignerProvider, getVotingAddresses };
