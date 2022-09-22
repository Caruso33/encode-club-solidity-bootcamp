import { Injectable } from '@nestjs/common';
import { ProviderService } from 'src/shared/services/provider/provider.service';
import { SignerService } from 'src/shared/services/signer/signer.service';
import { ethers } from 'ethers';
import * as TokenContract from 'src/assets/contracts/Token.json';

@Injectable()
export class ContractService {
  contractPublicInstance: ethers.Contract;
  contractSignedInstance: ethers.Contract;

  constructor(
    private providerService: ProviderService,
    private signerService: SignerService,
  ) {
    this.setupContractInstances();
  }

  setupContractInstances() {
    const contractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
    if (!contractAddress || contractAddress.length === 0) return;
    this.contractPublicInstance = new ethers.Contract(
      contractAddress,
      TokenContract.abi,
      this.providerService.provider,
    );
    this.contractSignedInstance = new ethers.Contract(
      contractAddress,
      TokenContract.abi,
      this.signerService.signer,
    );
  }

  async tokenBalanceOf(address: string) {
    const balanceBN = await this.contractPublicInstance.balanceOf(address);
    const balance = ethers.utils.formatEther(balanceBN);
    return balance;
  }

  async mintTokens(address: string, amount: number) {
    const tx = await this.contractSignedInstance.mint(
      address,
      ethers.utils.parseEther(amount.toFixed(18)),
    );
    return tx;
  }

  checkSignature(address: string, amount: number, signature: string) {
    const signatureObject = {address: address, amount: amount};
    const signatureMessage = JSON.stringify(signatureObject);
    const signerAddress = ethers.utils.verifyMessage(signatureMessage, signature);
    return signerAddress == address;
  }
}
