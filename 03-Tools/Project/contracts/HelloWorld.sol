// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    bytes32 private text;
    address public owner;

    constructor() {
        text = "Hello World";
        owner = msg.sender;
    }

    function getText() public view returns (bytes32) {
        return text;
    }

    function setText(bytes32 newText) public onlyOwner {
        text = newText;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    modifier onlyOwner()
    {
        require (msg.sender == owner, "Caller is not the owner");
        _;
    }
}