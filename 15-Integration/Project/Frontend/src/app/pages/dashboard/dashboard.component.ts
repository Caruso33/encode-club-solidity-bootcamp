import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
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

  watchServerBlockInterval: NodeJS.Timeout | null = null;
  watchPendingTxsInterval: NodeJS.Timeout | null = null;
  serverBlock = 0;
  pendingTx: {
    amount: number;
    hash: string;
    confirmations: number;
    updateOngoing?: boolean;
  }[] = [];

  constructor(
    private blockchainService: BlockchainService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.pageContents = this.INITIAL_CONTENTS;
    this.updateValues();
    this.updateVariables();
    this.watchBlockNumber();
    this.watchUserBalanceEther();
    this.watchContractSupply();
    this.watchUserBalanceToken();
    this.watchServerBlock();
    this.watchPendingRequests();
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

  private watchServerBlock() {
    this.watchServerBlockInterval = setInterval(() => {
      this.apiService.getServerBlock().subscribe((res) => {
        this.serverBlock = res.number;
      });
    }, 10000);
  }

  private watchPendingRequests() {
    this.watchPendingTxsInterval = setInterval(() => {
      this.pendingTx.forEach((tx) => {
        if (tx.confirmations < 5 && !tx.updateOngoing) {
          tx.updateOngoing = true;
          this.apiService
            .getTransactionReceipt(tx.hash)
            .subscribe((receipt) => {
              tx.confirmations = receipt.confirmations;
              tx.updateOngoing = false;
            });
        }
      });
    }, 10000);
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

  requestToken(amountStr: string) {
    const amount = Number(amountStr);
    this.blockchainService.signTokenRequest(amount).then((signature) => {
      this.apiService
        .requestToken(
          this.blockchainService.userWallet.address,
          amount,
          signature
        )
        .subscribe((res) => {
          this.pendingTx.push({
            amount: amount,
            hash: res.hash,
            confirmations: res.confirmations,
          });
        });
    });
  }
}
