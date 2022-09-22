// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract CorrectSortedBallot {
    uint256 public constant MAX_UINT = 2**256 - 1;
    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    Proposal[] public proposals;
    Proposal[] public proposalsSavedArray;
    Proposal[] public proposalsBeingSorted;
    uint256 baseCompareValue;
    uint256 public sortedWords;
    uint256 public savedIndex;
    uint256 public lastIndex;

    constructor(bytes32[] memory proposalNames) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
            proposalsBeingSorted.push(
                Proposal({name: bytes32(0), voteCount: 0})
            );
        }
        baseCompareValue = MAX_UINT;
        proposalsSavedArray = proposals;
    }

    function restartSorting() public {
        baseCompareValue = MAX_UINT;
        sortedWords = 0;
        savedIndex = 0;
        lastIndex = 0;
        proposalsSavedArray = proposals;
        delete (proposalsBeingSorted);
    }

    function sortProposals(uint256 steps) public returns (bool) {
        uint256 step = 0;
        while (sortedWords < proposals.length) {
            if (step >= steps) return (false);
            if (savedIndex == proposals.length) {
                proposalsBeingSorted[sortedWords].name = proposalsSavedArray[
                    lastIndex
                ].name;
                proposalsSavedArray[lastIndex].name = bytes32(MAX_UINT);
                baseCompareValue = MAX_UINT;
                sortedWords++;
                savedIndex = 0;
            } else {
                if (
                    uint256(proposalsSavedArray[savedIndex].name) <
                    baseCompareValue
                ) {
                    lastIndex = savedIndex;
                    baseCompareValue = uint256(
                        proposalsSavedArray[lastIndex].name
                    );
                }
                savedIndex++;
            }
            step++;
        }
        proposals = proposalsBeingSorted;
        return (true);
    }

    function sorted() public view returns (bool isSorted) {
        isSorted = sortedWords == proposals.length;
    }
}
