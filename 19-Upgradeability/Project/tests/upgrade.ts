/* eslint-disable camelcase */
/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";
import { ethers, upgrades } from "hardhat";
import {
  Token,
  TokenUpgradableV1,
  TokenUpgradableV2,
  Token__factory,
  TokenUpgradableV1__factory,
  TokenUpgradableV2Wrong__factory,
  TokenUpgradableV2__factory,
} from "../typechain";

chaiUse(chaiAsPromised);

const MINT_TEST_VALUE = 1;

describe("Upgrade", async () => {
  let tokenFactory: Token__factory;
  let tokenUpgradableV1Factory: TokenUpgradableV1__factory;
  let tokenUpgradableV2WrongFactory: TokenUpgradableV2Wrong__factory;
  let tokenUpgradableV2Factory: TokenUpgradableV2__factory;

  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const [
      tokenFactory_,
      tokenUpgradableV1Factory_,
      tokenUpgradableV2WrongFactory_,
      tokenUpgradableV2Factory_,
    ] = await Promise.all([
      ethers.getContractFactory("Token"),
      ethers.getContractFactory("TokenUpgradableV1"),
      ethers.getContractFactory("TokenUpgradableV2Wrong"),
      ethers.getContractFactory("TokenUpgradableV2"),
    ]);
    tokenFactory = tokenFactory_ as Token__factory;
    tokenUpgradableV1Factory =
      tokenUpgradableV1Factory_ as TokenUpgradableV1__factory;
    tokenUpgradableV2WrongFactory =
      tokenUpgradableV2WrongFactory_ as TokenUpgradableV2Wrong__factory;
    tokenUpgradableV2Factory =
      tokenUpgradableV2Factory_ as TokenUpgradableV2__factory;
  });

  describe("When deploying the common ERC20 token", async () => {
    let token: Token;
    beforeEach(async () => {
      token = await tokenFactory.deploy();
      await token.deployed();
    });

    it("Mints tokens correctly using a valid minter", async () => {
      const totalSupplyBefore = await token.totalSupply();
      const mintTx = await token.mint(
        accounts[0].address,
        ethers.utils.parseEther(MINT_TEST_VALUE.toFixed(18))
      );
      await mintTx.wait();
      const totalSupplyAfter = await token.totalSupply();
      const diff = totalSupplyAfter.sub(totalSupplyBefore);
      expect(Number(ethers.utils.formatEther(diff))).to.eq(MINT_TEST_VALUE);
      const balanceAfter = await token.balanceOf(accounts[0].address);
      expect(Number(ethers.utils.formatEther(balanceAfter))).to.eq(
        MINT_TEST_VALUE
      );
    });

    describe("When trying to upgrade", async () => {
      it("Fails", async () => {
        await expect(
          upgrades.deployProxy(tokenFactory)
        ).to.eventually.be.rejectedWith("Contract `Token` is not upgrade safe");
      });
    });
  });

  describe("When deploying the upgradeable ERC20 token", async () => {
    let tokenProxy: TokenUpgradableV1;

    beforeEach(async () => {
      const tokenProxy_ = await upgrades.deployProxy(tokenUpgradableV1Factory);
      tokenProxy = tokenProxy_ as TokenUpgradableV1;
    });

    describe("When the contract is deployed", async () => {
      it("Mints tokens correctly using a valid minter", async () => {
        const totalSupplyBefore = await tokenProxy.totalSupply();
        const mintTx = await tokenProxy.mint(
          accounts[0].address,
          ethers.utils.parseEther(MINT_TEST_VALUE.toFixed(18))
        );
        await mintTx.wait();
        const totalSupplyAfter = await tokenProxy.totalSupply();
        const diff = totalSupplyAfter.sub(totalSupplyBefore);
        expect(Number(ethers.utils.formatEther(diff))).to.eq(MINT_TEST_VALUE);
        const balanceAfter = await tokenProxy.balanceOf(accounts[0].address);
        expect(Number(ethers.utils.formatEther(balanceAfter))).to.eq(
          MINT_TEST_VALUE
        );
      });
    });

    describe("When the upgrade contract is wrong", async () => {
      it("Fails", async () => {
        await expect(
          upgrades.upgradeProxy(
            tokenProxy.address,
            tokenUpgradableV2WrongFactory
          )
        ).to.eventually.be.rejectedWith("New storage layout is incompatible");
      });
    });

    describe("When the upgrade contract is correct", async () => {
      const TEST_AUDIT_VALUE = 1000;
      const TEST_UPDATE_MINT_VALUE = TEST_AUDIT_VALUE + 1;

      let tokenProxyUpdated: TokenUpgradableV2;
      beforeEach(async () => {
        const tokenProxyUpdated_ = await upgrades.upgradeProxy(
          tokenProxy.address,
          tokenUpgradableV2Factory
        );
        tokenProxyUpdated = tokenProxyUpdated_ as TokenUpgradableV2;
        const AUDIT_ROLE = await tokenProxyUpdated.AUDIT_ROLE();
        const grantRoleTX = await tokenProxyUpdated.grantRole(
          AUDIT_ROLE,
          accounts[1].address
        );
        await grantRoleTX.wait();
        const submitAudit = await tokenProxyUpdated
          .connect(accounts[1])
          .auditReport(ethers.utils.parseEther(TEST_AUDIT_VALUE.toFixed(18)));
        await submitAudit.wait();
      });

      it("Mints tokens correctly using a valid minter after the audit report is registered", async () => {
        expect(TEST_AUDIT_VALUE >= MINT_TEST_VALUE);
        const totalSupplyBefore = await tokenProxyUpdated.totalSupply();
        const mintTx = await tokenProxyUpdated.mint(
          accounts[0].address,
          ethers.utils.parseEther(MINT_TEST_VALUE.toFixed(18))
        );
        await mintTx.wait();
        const totalSupplyAfter = await tokenProxyUpdated.totalSupply();
        const diff = totalSupplyAfter.sub(totalSupplyBefore);
        expect(Number(ethers.utils.formatEther(diff))).to.eq(MINT_TEST_VALUE);
        const balanceAfter = await tokenProxyUpdated.balanceOf(
          accounts[0].address
        );
        expect(Number(ethers.utils.formatEther(balanceAfter))).to.eq(
          MINT_TEST_VALUE
        );
      });

      it("Fails when minting more than registered", async () => {
        expect(TEST_UPDATE_MINT_VALUE >= TEST_AUDIT_VALUE);
        await expect(
          tokenProxyUpdated.mint(
            accounts[0].address,
            ethers.utils.parseEther(TEST_UPDATE_MINT_VALUE.toFixed(18))
          )
        ).to.be.revertedWith(
          "Mint value is greater than what is available to be minted"
        );
      });
    });
  });
});
