# Lesson 5 - Events and async operations
## Events with solidity
* Event syntax
* Event storage
* Event indexing
* Topics and filters
* Transaction structure
* State changes with events
### References
https://docs.soliditylang.org/en/latest/contracts.html#events

https://dev.to/hideckies/ethers-js-cheat-sheet-1h5j
### Code reference
<pre><code>    event NewVoter(address indexed voter);

    event Delegated(
        address indexed voter,
        address indexed finalDelegate,
        uint256 finalWeight,
        bool voted,
        uint256 proposal,
        uint256 proposalVotes
    );

    event Voted(
        address indexed voter,
        uint256 indexed proposal,
        uint256 weight
    );
</code></pre>
## Watching for events in tests
* Event syntax in waffle
* Triggering an event
* Checking arguments
### References
https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#emitting-events
### Code reference

<pre><code>    it("triggers the NewVoter event with the address of the new voter", async function () {
      const voterAddress = accounts[1].address;
      await expect(ballotContract.giveRightToVote(voterAddress))
        .to.emit(ballotContract, "NewVoter")
        .withArgs(voterAddress);
    });
</code></pre>

## Watching for events in scripts with Ethers.js
* Event syntax for Ethers.js library
* Filters, EventFilters and topics
* Event arguments
* Event listeners and memory usage
* Async logic
* Triggering functions inside the script
* Cleaning up after usage

### References
https://docs.ethers.io/v5/concepts/events/

https://docs.ethers.io/v5/api/contract/contract/#Contract--events

https://docs.ethers.io/v5/api/providers/types/#providers-Filter

https://docs.ethers.io/v5/api/providers/types/#providers-EventFilter

Pooling time [issue](https://github.com/NomicFoundation/hardhat/issues/1692#issuecomment-905674692)
## Watching for events in scripts connected to the Testnet
* (Review) Connecting to a testnet with a RPC Provider
* Triggering events in a public blockchain
* Viewing events in etherscan
### References
https://docs.soliditylang.org/en/latest/abi-spec.html#events
# Homework
* Read the references
* Expand the script for logging from the last activity:
  * Voting right given
    * Print address of the receiver
  * Vote delegated
    * Print address of the final delegate
    * Print final voting weight of that delegate
    * Print if the delegate has already voted
  * Vote given
    * Whenever a vote is cast, display the winning proposal
    * (Optional Level 1) Also display its vote count
    * (Optional Level 2) Also display the name and vote counts of all other proposals
