import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  INITIAL_CONTENTS = [
    { key: 'address', prop: 'User wallet address', value: 'Loading...' },
    { key: 'etherBalance', prop: 'Ether balance', value: 'Loading...' },
    { key: 'networkName', prop: 'Network name', value: 'Loading...' },
    { key: 'number', prop: 'Last block number', value: 'Loading...' },
    { key: 'tokenAddress', prop: 'Token address', value: 'Loading...' },
    { key: 'tokenName', prop: 'Token name', value: 'Loading...' },
    { key: 'symbol', prop: 'Token symbol', value: 'Loading...' },
    { key: 'supply', prop: 'Total supply', value: 'Loading...' },
    { key: 'tokenBalance', prop: 'User balance', value: 'Loading...' },
  ];

  pageContents: { key: string; prop: string; value: string }[] = [];

  constructor(private blockchainService: BlockchainService) {}

  ngOnInit(): void {
    this.pageContents = this.INITIAL_CONTENTS;
    this.updateValues();
    this.updateVariables();
    this.watchBlockNumber();
    this.watchUserBalanceEther();
    this.watchContractSupply();
    this.watchUserBalanceToken();
  }

  private updateValues() {
    this.blockchainService.address().then((result) => {
      const itemIndex = this.pageContents.findIndex(
        (obj) => obj.key === 'address'
      );
      if (itemIndex >= 0) this.pageContents[itemIndex].value = result;
    });
    this.blockchainService.networkName().then((result) => {
      const itemIndex = this.pageContents.findIndex(
        (obj) => obj.key === 'networkName'
      );
      if (itemIndex >= 0) this.pageContents[itemIndex].value = result;
    });
    this.blockchainService.tokenAddress().then((result) => {
      const itemIndex = this.pageContents.findIndex(
        (obj) => obj.key === 'tokenAddress'
      );
      if (itemIndex >= 0) this.pageContents[itemIndex].value = result;
    });
    this.blockchainService.tokenName().then((result) => {
      const itemIndex = this.pageContents.findIndex(
        (obj) => obj.key === 'tokenName'
      );
      if (itemIndex >= 0) this.pageContents[itemIndex].value = result;
    });
    this.blockchainService.symbol().then((result) => {
      const itemIndex = this.pageContents.findIndex(
        (obj) => obj.key === 'symbol'
      );
      if (itemIndex >= 0) this.pageContents[itemIndex].value = result;
    });
  }

  private updateVariables() {
    this.updateEtherBalance();
    this.updateSupply();
    this.updateTokenBalance();
  }

  private watchUserBalanceEther() {
    this.blockchainService.watchUserBalanceEther(() => {
      this.updateEtherBalance();
    });
  }

  private watchContractSupply() {
    this.blockchainService.watchContractSupply(() => {
      this.updateSupply();
    });
  }

  private watchUserBalanceToken() {
    this.blockchainService.watchUserBalanceToken(() => {
      this.updateTokenBalance();
    });
  }

  private updateEtherBalance() {
    this.blockchainService.etherBalance().then((result) => {
      const itemIndex = this.pageContents.findIndex(
        (obj) => obj.key === 'etherBalance'
      );
      if (itemIndex >= 0) this.pageContents[itemIndex].value = result;
    });
  }

  private watchBlockNumber() {
    this.blockchainService.watchBlockNumber((result) => {
      const itemIndex = this.pageContents.findIndex(
        (obj) => obj.key === 'number'
      );
      if (itemIndex >= 0) this.pageContents[itemIndex].value = result;
    });
  }

  private updateSupply() {
    this.blockchainService.supply().then((result) => {
      const itemIndex = this.pageContents.findIndex(
        (obj) => obj.key === 'supply'
      );
      if (itemIndex >= 0) this.pageContents[itemIndex].value = result;
    });
  }

  private updateTokenBalance() {
    this.blockchainService.tokenBalance().then((result) => {
      const itemIndex = this.pageContents.findIndex(
        (obj) => obj.key === 'tokenBalance'
      );
      if (itemIndex >= 0) this.pageContents[itemIndex].value = result;
    });
  }
}
