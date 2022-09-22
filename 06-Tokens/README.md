# Lesson 6 - ERC20 and ERC721 Tokens
## Quickstart with OpenZeppelin wizard
* Overview about Ethereum Improvement Proposals (EIPs)
* Overview about Application-level standards and conventions (ERCs)
* Explain about OpenZeppelin Contracts library
* Overview about ERC20
* Overview about ERC721
* Using OpenZeppelin wizard
### References
https://eips.ethereum.org/

https://eips.ethereum.org/erc

https://docs.openzeppelin.com/contracts/4.x/

https://docs.openzeppelin.com/contracts/4.x/erc20

https://docs.openzeppelin.com/contracts/4.x/erc721

https://docs.openzeppelin.com/contracts/4.x/wizard

### Plain ERC20 Code reference

<pre><code>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {}
}
</code></pre>
### Plain ERC721 Code reference

<pre><code>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyToken is ERC721 {
    constructor() ERC721("MyToken", "MTK") {}
}
</code></pre>
## Contract structure
* Syntax about inheritance
* Overview about OpenZeppelin features for ERC20 and ERC721
* Overview about OpenZeppelin features for Access Control
* Overview about OpenZeppelin utilities and components
* Adding minting feature
* Adding RBAC feature
### References
https://www.npmjs.com/package/@openzeppelin/contracts

https://docs.openzeppelin.com/contracts/4.x/extending-contracts

https://docs.openzeppelin.com/contracts/4.x/access-control
## Operating the contracts with scripts
* (Review) Script operation
* (Review) Accounts and funding
* (Review) Providers
* (Review) Async operations
* (Review) Running scripts on test environment
* Running the scripts on chain
* Contract factory and json imports
* Transaction receipts and async complexities when running onchain
# Homework
* Create Github Issues with your questions about this lesson
* Read the references
* Complete the operation scripts for ERC20 and ERC721
* (Optional) Study test structure for ERC20 contract from [OpenZeppelin Contracts Library](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/test/token/ERC20)
* (Optional) Study test structure for ERC721 contract from [OpenZeppelin Contracts Library](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/test/token/ERC721)
* (Optional) Study what is “supportsInterface” function and [ERC165](https://medium.com/@chiqing/ethereum-standard-erc165-explained-63b54ca0d273)
