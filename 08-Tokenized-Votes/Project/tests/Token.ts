import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { beforeEach } from "mocha";
import { MyToken } from "../typechain";

const MINTER_ROLE = "MINTER_ROLE";
const BASE_MINT_AMOUNT = 10;

describe("MyToken", function () {
  let myTokenFactory: any;
  let myTokenContract: MyToken;
  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    myTokenFactory = await ethers.getContractFactory("MyToken");
    myTokenContract = await myTokenFactory.deploy();
    await myTokenContract.deployed();
    accounts = await ethers.getSigners();
  });

  describe("When the contract is deployed", function () {
    it("should give the MINTER_ROLE to the contract owner", async () => {
      console.log(keccak256(toUtf8Bytes(MINTER_ROLE)));
      expect(
        await myTokenContract.hasRole(
          keccak256(toUtf8Bytes(MINTER_ROLE)),
          accounts[0].address
        )
      ).to.eq(true);
    });

    it("should give the DEFAULT_ADMIN_ROLE to the contract owner", async () => {
      expect(
        await myTokenContract.hasRole(
          ethers.utils.hexZeroPad("0x00", 32),
          accounts[0].address
        )
      ).to.eq(true);
    });
  });

  describe("When the mint function is called", function () {
    describe("And the sender has the MINTER_ROLE", function () {
      let previousBalance: BigNumber;
      let previousTotalSupply: BigNumber;
      let mintTx: ContractTransaction;

      beforeEach(async () => {
        previousBalance = await myTokenContract.balanceOf(accounts[0].address);
        previousTotalSupply = await myTokenContract.totalSupply();
        mintTx = await myTokenContract.mint(
          accounts[0].address,
          ethers.utils.parseEther(BASE_MINT_AMOUNT.toFixed(18))
        );
      });

      it("should update his account balance with the tokens minted", async () => {
        const newBalanceTx = await myTokenContract.balanceOf(
          accounts[0].address
        );
        const diff = newBalanceTx.sub(previousBalance);
        expect(Number(ethers.utils.formatEther(diff))).to.eq(BASE_MINT_AMOUNT);
      });

      it("should increase token total supply by the amount of tokens minted", async () => {
        const newTotalSupply = await myTokenContract.totalSupply();
        const diff = newTotalSupply.sub(previousTotalSupply);
        expect(Number(ethers.utils.formatEther(diff))).to.eq(BASE_MINT_AMOUNT);
      });

      it("should update checkpoints if he has delegated to himself", async () => {
        const delegateTx = await myTokenContract.delegate(accounts[0].address);

        const accountCheckpointsAfter = await myTokenContract.numCheckpoints(
          accounts[0].address
        );

        expect(accountCheckpointsAfter).to.eq(1);
      });

      it("should not update checkpoints if he has not delegated to himself", async () => {
        const accountCheckpointsAfter = await myTokenContract.numCheckpoints(
          accounts[0].address
        );

        expect(accountCheckpointsAfter).to.eq(0);
      });

      it("should be able to delegate voting power", async () => {
        const delegatee = accounts[1],
          delegateeAddress = accounts[1].address;

        mintTx = await myTokenContract.mint(
          delegateeAddress,
          ethers.utils.parseEther(BASE_MINT_AMOUNT.toFixed(18))
        );

        const delegateeConnect = myTokenContract.connect(delegatee);

        let votingPowerBefore = await myTokenContract.getVotes(
          delegateeAddress
        );

        // minting alone doesn't give voting power
        expect(ethers.utils.formatUnits(votingPowerBefore)).to.eq(
          (0.0).toFixed(1)
        );

        // self-delegation triggers the snapshot
        await delegateeConnect.delegate(delegateeAddress);

        let currentVotingPower = await delegateeConnect.getVotes(
          delegateeAddress
        );

        expect(Number(ethers.utils.formatUnits(currentVotingPower))).to.eq(
          Number(ethers.utils.formatUnits(votingPowerBefore)) + BASE_MINT_AMOUNT
        );

        // delegation triggers the snapshot
        await myTokenContract.delegate(delegateeAddress);

        votingPowerBefore = currentVotingPower;
        currentVotingPower = await delegateeConnect.getVotes(delegateeAddress);

        expect(Number(ethers.utils.formatUnits(currentVotingPower))).to.eq(
          Number(ethers.utils.formatUnits(votingPowerBefore)) + BASE_MINT_AMOUNT
        );
      });
    });

    describe("And the sender has not the MINTER_ROLE", function () {
      it("should fail", async () => {
        const mintTx = myTokenContract
          .connect(accounts[1])
          .mint(
            accounts[0].address,
            ethers.utils.parseEther(BASE_MINT_AMOUNT.toFixed(18))
          );
        await expect(mintTx).to.be.reverted;
      });
    });
  });
});
