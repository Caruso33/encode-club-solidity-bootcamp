// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract SortedBallot {
    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    Proposal[] public proposals;

    constructor(bytes32[] memory proposalNames) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function sortProposals() public {
        uint256 MAX_UINT = 2**256 - 1;
        Proposal[] memory savedArray = proposals;
        for (uint256 i = 0; i < proposals.length; i++) {
            uint256 baseCompareValue = MAX_UINT;
            uint256 index = 0;
            for (uint256 j = 0; j < proposals.length; j++) {
                if (uint256(savedArray[j].name) < baseCompareValue) {
                    baseCompareValue = uint256(savedArray[j].name);
                    index = j;
                }
            }
            proposals[i].name = savedArray[index].name;
            savedArray[index].name = bytes32(MAX_UINT);
        }
    }
}
