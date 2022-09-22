// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    string private text;

    constructor() {
        text = pureText();
    }

    function helloWorld() public view returns (string memory) {
        return text;
    }

    function setText(string calldata newText) public {
        text = newText;
    }

    function pureText() public pure returns (string memory) {
        return "Hello World";
    }

    function _isPure() internal view returns (bool _check) {
        _check = keccak256(bytes(text)) == keccak256(bytes(pureText()));
    }

    function isPure() public view returns (bool _returnValue) {
        _returnValue = _isPure();
    }

    function _restore() internal {
        text = pureText();
    }

    function restore() public returns (bool) {
        if (_isPure()) return false;
        _restore();
        return true;
    }
}