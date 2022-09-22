# Lesson 2 - Syntax
## Detailed contract structure
* (Review) Contract structure
* What are interfaces
* What are contracts, indeed
* Multiple objects per file
* Libraries
### References
https://docs.soliditylang.org/en/latest/grammar.html

https://docs.soliditylang.org/en/latest/structure-of-a-contract.html

### Code Reference
<pre><code>// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface HelloWorldInterface {
    function helloWorld() external view returns (string memory);
    function setText(string memory newText) external;
}

contract HelloWorld is HelloWorldInterface {
    string private text;

    constructor() {
        text = "Hello World";
    }

    function helloWorld() public view override returns (string memory)  {
        return text;
    }

    function setText(string memory newText) public override {
        text = newText;
    }
}</code></pre>
## Function definition
* Replacing memory with calldata when stack is enough
* Relation between identifier and parameters and MethodID
* Fallback and receive functions
* Definitions
  * Visibility
  * State mutability
  * Modifiers
  * Virtual
  * Override
### References
https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html#storage-memory-and-the-stack

https://solidity-by-example.org/function-selector/
### Code references
<pre><code>// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    string private text;

    constructor() {
        text = "Hello World";
    }

    function helloWorld() public view returns (string memory)  {
        return text;
    }

    function setText(string calldata newText) public {
        text = newText;
    }
}</code></pre>
## Variable declaration and definition
* Elementary types
  * Booleans
  * Integers
  * Fixed
  * Address
  * Bytes
  * Strings
* State Variables
* Constants
* Data locations (again)
* Arrays
* Mappings
### References
https://docs.soliditylang.org/en/latest/types.html

## Common Solidity Global Variables
* Reserved words and global variables that a programmer should know
* Global variables about blockchain state
* Global variables about the transaction
* Global variables about the transaction message
### References 
https://docs.soliditylang.org/en/latest/units-and-global-variables.html
## Assertion and Modifiers
* How errors are handled on solidity (briefly)
* Assertion
* Require statements
* Modifiers
* Where to use modifiers
### References
https://docs.soliditylang.org/en/latest/control-structures.html#error-handling-assert-require-revert-and-exceptions

https://docs.soliditylang.org/en/latest/structure-of-a-contract.html#function-modifiers
### Restricting access to functions
* Wrapping up contents
  * Modifier
  * Assertion inside modifiers
  * Message Sender
  * Visibility
  * Mutability
* Implementing basic access control on _setText_
### References
https://docs.soliditylang.org/en/latest/common-patterns.html#restricting-access
# Homework
* Create Github Issues with your questions about this lesson
* Read the references
* Get to know the [Solidity Cheatsheet](https://docs.soliditylang.org/en/latest/cheatsheet.html) in depth 
* Get familiar with the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
* Prepare your environment for next class:
  * [Node](https://nodejs.org/en/docs/guides/getting-started-guide/)
  * [NPM](https://docs.npmjs.com/cli/v8/configuring-npm/install)
  * [Yarn](https://classic.yarnpkg.com/lang/en/docs/getting-started/)
  * [Git CLI](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)
  * [VS Code](https://code.visualstudio.com/docs/setup/setup-overview)
* Create a free account on [infura](https://infura.io/)
* Create a free account on [alchemy](https://www.alchemy.com/)
* Create a free account on [etherscan](https://etherscan.io/register)
