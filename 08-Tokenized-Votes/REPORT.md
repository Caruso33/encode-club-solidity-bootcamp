# Homework Report

## Team name: The Buidlers

## Team members:

- Tobias Leinss <caruso33@web.de>
- Lucien Akchoté <l.akchote@gmail.com>
- Alok Sahay <alok.sahay87@gmail.com>
- Ana G. Jordano <anagjordano@gmail.com>
- Vid Topolovec <weetopol@gmail.com>

## Deploying contract

### MyToken

- Ropsten address of deployed contract: 0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26
- Transaction: 0x043c4ef7aed117650165e9baff5f14e7a909aa2bd33ff7a5f668c1ac1e550031
- [Block Explorer](https://ropsten.etherscan.io/address/0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26)

### CustomBallot

- Ropsten address of deployed contract: 0xdf74169524cc9f8A74b9b14D4a8B67D524190085
- Transaction: 0x276b7abc4306731fc39943fe4641662fb97a4b9645eeafbb4047ae50e6e93cf8
- [Block Explorer](https://ropsten.etherscan.io/address/0xdf74169524cc9f8a74b9b14d4a8b67d524190085)

## Weekend Project

- Form groups of 3 to 5 students
- Complete the contracts together
- Structure scripts to
  - Deploy everything
  - Interact with the ballot factory
  - Query proposals for each ballot
  - Operate scripts
- Publish the project in Github
- Run the scripts with a few set of proposals, play around with token balances, cast and delegate votes, create ballots from snapshots, interact with the ballots and inspect results
- Write a report detailing the addresses, transaction hashes, description of the operation script being executed and console output from script execution for each step
- (Extra) Use TDD methodology

## Operation logs

### Deployment

#### Token

```shell
❯ yarn deploy:ropsten:token
yarn run v1.22.15
$ ts-node scripts/deploymentToken.ts ropsten
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Wallet balance 9.980619454909341
__________________________________________________
Deploying MyToken contract
Awaiting confirmations
========= NOTICE =========
Request-Rate Exceeded  (this message will not be repeated)

The default API keys for each service are provided as a highly-throttled,
community resource for low-traffic projects and early prototyping.

While your application will continue to function, we highly recommended
signing up for your own API keys to improve performance, increase your
request rate/limit and enable other perks, such as metrics and advanced APIs.

For more details: https://docs.ethers.io/api-keys/
==========================
Contract deployed at 0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26
Minting tokens for address 0x4bFC74983D6338D3395A00118546614bB78472c2, previous balance : 0.0 tokens...
Minted tokens for address 0x4bFC74983D6338D3395A00118546614bB78472c2, new balance : 20.0 tokens.
Self delegating to track voting power and enable checkpoints...
Minting 20 tokens to 0x49E499F56dA1aFd2c734584a2f3e5E7B5ad72ebb...
Minting 20 tokens to 0x10f403726407d55de84ac831405516Fc4821b937...
Minting 20 tokens to 0xD89ffDef0d21c3E03A6AF09Aa31695B6e0414c31...
Minting 20 tokens to 0x5Ed02CF700D92d64776e11c6E85D2D7d11e9bcf8...
Completed
__________________________________________________
✨  Done in 98.65s.
```

#### Ballot

```shell
❯ ts-node scripts/deploymentBallot.ts ropsten 0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26 Pizza Lasagna Icecream
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Wallet balance 9.973081594375465
__________________________________________________
Deploying CustomBallot contract
Proposals:
Proposal N. 1: Pizza
Proposal N. 2: Lasagna
Proposal N. 3: Icecream
Awaiting confirmations
Completed
Contract deployed at 0xdf74169524cc9f8A74b9b14D4a8B67D524190085
__________________________________________________
```

### Create constructor args

```shell
❯ yarn create:args
yarn run v1.22.15
$ ts-node scripts/createConstructorArgs.ts Pizza Lasagna Icecream
[
  '0x50697a7a61000000000000000000000000000000000000000000000000000000',
  '0x4c617361676e6100000000000000000000000000000000000000000000000000',
  '0x496365637265616d000000000000000000000000000000000000000000000000'
]
✨  Done in 2.24s.
```

### Contract verification

#### MyToken

```shell
❯ yarn hardhat verify --network ropsten 0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26
yarn run v1.22.15
$ /Users/tobias/Code/encode_bootcamp/08-Tokenized-Votes/Project/node_modules/.bin/hardhat verify --network ropsten 0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26
Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/Token.sol:MyToken at 0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26
for verification on the block explorer. Waiting for verification result...

Successfully verified contract MyToken on Etherscan.
https://ropsten.etherscan.io/address/0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26#code
✨  Done in 36.31s.
```

#### CustomBallot

```shell
❯ yarn hardhat verify --network ropsten --constructor-args scripts/constructorArgs.ts 0x662F26b3A3Ddd5E91D5e6B85Fd9E253a873e33E6
yarn run v1.22.15
$ /Users/tobias/Code/encode_bootcamp/08-Tokenized-Votes/Project/node_modules/.bin/hardhat verify --network ropsten --constructor-args scripts/constructorArgs.ts 0x662F26b3A3Ddd5E91D5e6B85Fd9E253a873e33E6
Generating typings for: 12 artifacts in dir: typechain for target: ethers-v5
Successfully generated 17 typings!
Compiled 12 Solidity files successfully
Successfully submitted source code for contract
contracts/CustomBallot.sol:CustomBallot at 0x662F26b3A3Ddd5E91D5e6B85Fd9E253a873e33E6
for verification on the block explorer. Waiting for verification result...

Successfully verified contract CustomBallot on Etherscan.
https://ropsten.etherscan.io/address/0x662F26b3A3Ddd5E91D5e6B85Fd9E253a873e33E6#code
✨  Done in 38.27s.
```

### Balance

```shell
❯ yarn ts-node scripts/getBalance.ts 0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26 0x4bFC74983D6338D3395A00118546614bB78472c2 ropsten
yarn run v1.22.15
$ /Users/tobias/Code/encode_bootcamp/08-Tokenized-Votes/Project/node_modules/.bin/ts-node scripts/getBalance.ts 0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26 0x4bFC74983D6338D3395A00118546614bB78472c2 ropsten
Connecting to provider...
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Attaching to Token contract address 0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26...
Account 0x4bFC74983D6338D3395A00118546614bB78472c2 has currently 20 tokens balance and 20.0 votes
✨  Done in 5.54s.
```

### Voting

```shell
❯ yarn ts-node scripts/castVote.ts 0xdf74169524cc9f8A74b9b14D4a8B67D524190085 0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26 2 ropsten
yarn run v1.22.15
$ /Users/tobias/Code/encode_bootcamp/08-Tokenized-Votes/Project/node_modules/.bin/ts-node scripts/castVote.ts 0xdf74169524cc9f8A74b9b14D4a8B67D524190085 0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26 2 ropsten
Connecting to provider...
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Attaching to Ballot contract address 0xdf74169524cc9f8A74b9b14D4a8B67D524190085...
Attaching to MyToken contract address 0xa3F57F3F651e6E55d9eF6FC21D960B60ED375F26...
Proposal to vote on has currently 5.0 votes.
Casting vote on proposal index 2 using 5 vote power...
Proposal to vote on has now 5.0 votes.
Account 0x4bFC74983D6338D3395A00118546614bB78472c2 has now 15.0 voting power left.
Spent voting power for 0x4bFC74983D6338D3395A00118546614bB78472c2 : 5.0
✨  Done in 7.99s.
```

### Results

```shell
❯ yarn ts-node scripts/getResults.ts 0xdf74169524cc9f8A74b9b14D4a8B67D524190085 ropsten
yarn run v1.22.15
$ /Users/tobias/Code/encode_bootcamp/08-Tokenized-Votes/Project/node_modules/.bin/ts-node scripts/getResults.ts 0xdf74169524cc9f8A74b9b14D4a8B67D524190085 ropsten
Connecting to provider...
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Attaching to Ballot contract address 0xdf74169524cc9f8A74b9b14D4a8B67D524190085...

      Contract Address:  0xdf74169524cc9f8A74b9b14D4a8B67D524190085
      -----------------------------------------------------
      Name:  Pizza
      Vote count:  0
      -----------------------------------------------------
      Name:  Lasagna
      Vote count:  15
      -----------------------------------------------------
      Name:  Icecream
      Vote count:  20
      -----------------------------------------------------
      Winning proposal: Icecream
✨  Done in 5.04s.
```
