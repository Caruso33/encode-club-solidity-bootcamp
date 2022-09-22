# Homework Report

## Team name: The Buidlers

## Team members:

- Tobias Leinss <caruso33@web.de>
- Lucien Akchoté <l.akchote@gmail.com>
- Alok Sahay <alok.sahay87@gmail.com>

## Deploying contract

- Ropsten address of deployed contract: 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1
- Transaction: 0x8b75d568ddc6db8d1c24b82097fccccf206ef7da141075b9ae4613304b854199
- [Block Explorer](https://ropsten.etherscan.io/address/0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1)

## Weekend Project

- Form groups of 3 to 5 students (presently 6 ✓)
- Structure scripts to
  - Deploy (✓ deployment.ts)
  - Query proposals (✓ queryProposals.ts)
  - Give vote right passing an address as input (✓ giveVotingRights.ts)
  - Cast a vote to a ballot passing contract address and proposal as input and using the wallet in environment (✓ castVote.ts)
  - Delegate my vote passing user address as input and using the wallet in environment (✓ delegateVote.ts)
  - Query voting result and print to console (✓ votingResult.ts)
- Publish the project in Github (✓ github.com/encode-bootcamp-11-the-buidlers)
- Run the scripts with a set of proposals, cast and delegate votes and inspect results (✓)
- Write a report detailing the addresses, transaction hashes, description of the operation script being executed and console output from script execution for each step (Deployment, giving voting rights, casting/delegating and querying results). (✓)
- (Extra) Use TDD methodology (✓)

## Operation logs

### Deployment

```shell
❯ yarn deploy:ropsten
yarn run v1.22.15
$ ts-node scripts/Ballot/deployment.ts ropsten Pizza Lasagna Icecream
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Wallet balance 9.99626960148249
Deploying Ballot contract
Proposals:
Proposal N. 1: Pizza
Proposal N. 2: Lasagna
Proposal N. 3: Icecream
Awaiting confirmations
Completed
Contract deployed at 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1
✨  Done in 20.10s.
```

### Contract verification

```shell
❯ hh verify --network ropsten --constructor-args scripts/Ballot/constructorArgs.ts 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1
Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/Ballot.sol:Ballot at 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1
for verification on the block explorer. Waiting for verification result...

Error in plugin @nomiclabs/hardhat-etherscan: The Etherscan API responded with a failure status.
The verification may still succeed but should be checked manually.
Reason: Already Verified
```

### Give voting rights

#### Luc

```shell
❯ ts-node scripts/Ballot/giveVotingRights.ts 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1 0x49E499F56dA1aFd2c734584a2f3e5E7B5ad72ebb ropsten
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Wallet balance 9.994583073474619
Attaching ballot contract interface to address 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1
Giving right to vote to 0x49E499F56dA1aFd2c734584a2f3e5E7B5ad72ebb
Awaiting confirmations
Transaction completed. Hash: 0x71f98355775bcb6e5f0ccf6ac2ee5327489c607f22b365009f8d8bed5752545c
```

#### Alok

```shell
❯ ts-node scripts/Ballot/giveVotingRights.ts 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1 0x10f403726407d55de84ac831405516Fc4821b937 ropsten
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Wallet balance 9.994510087974279
Attaching ballot contract interface to address 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1
Giving right to vote to 0x10f403726407d55de84ac831405516Fc4821b937
Awaiting confirmations
Transaction completed. Hash: 0x4b30919e6fd5c5d6040e3a164bd609cca051c80921b74a058d93123eaa42b33c
```

#### Tobias 2nd address

```shell
❯ ts-node scripts/Ballot/giveVotingRights.ts 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1 0x6a439b14f527d8731794B982d785b72F5d245c6f ropsten
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Wallet balance 9.994437102473938
Attaching ballot contract interface to address 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1
Giving right to vote to 0x6a439b14f527d8731794B982d785b72F5d245c6f
========= NOTICE =========
Request-Rate Exceeded  (this message will not be repeated)

The default API keys for each service are provided as a highly-throttled,
community resource for low-traffic projects and early prototyping.

While your application will continue to function, we highly recommended
signing up for your own API keys to improve performance, increase your
request rate/limit and enable other perks, such as metrics and advanced APIs.

For more details: https://docs.ethers.io/api-keys/
==========================
Awaiting confirmations
Transaction completed. Hash: 0xfd39bd7ac6fb60816d1bc3227367acac19a159038808afa798399c230f9398fe
```

### Vote delegation

Tobias 2nd > Tobias 1st address

```shell
❯ ts-node scripts/Ballot/delegateVote 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1 0x4bFC74983D6338D3395A00118546614bB78472c2 ropsten
Using address 0x6a439b14f527d8731794B982d785b72F5d245c6f
Delegating vote to 0x4bFC74983D6338D3395A00118546614bB78472c2
Awaiting confirmations
Transaction completed. Hash: 0x6d1439c76cd24c9a0e2dd595950e6d4c957f414bbc70945b33fe18c88a5038d7
```

### Cast vote

Tobias 1st address, 2 weights available

```shell
❯ ts-node scripts/Ballot/castVote.ts 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1 2 ropsten
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Casting vote on proposal with index : 2, current vote count : 0
Awaiting confirmations
Fetching updated data for new proposal
Proposal with index 2, new vote count : 2, tx hash : 0x4e1b3891199c1683081ca441e2d41d25b229d1cc43550570a7f2676795b45d6b
```

### Query proposals

```shell
❯ ts-node scripts/Ballot/queryProposals.ts 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1 ropsten
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Proposal 0: Pizza, vote count  1
Proposal 1: Lasagna, vote count  1
Proposal 2: Icecream, vote count  2
```

### Voting result

```shell
❯ ts-node scripts/Ballot/votingResult.ts 0xee5cF4Cc94bb97E2bA0d0a115b69c6075Ce42DD1 ropsten
Using address 0x4bFC74983D6338D3395A00118546614bB78472c2
Getting the winning proposal name
Getting the winning proposal index
Fetching winning proposal struct data
Winning proposal name : Icecream, current vote count : 2
```
