// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

/// @title A ballot tied to a ERC20Votes token
/// @author Encode Club
/// @notice You can use this contract for learning about tokenized votes in Solidity
/// @dev Enjoy learning 😎
/// @custom:learning This is a contract with learning purposes only.
interface IERC20Votes {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract CustomBallot {
    /**
     * @dev This declares the event that we emit when some address successfully calls the'vote' method.
     * We will work here with all relevant values for the 'vote' event.
     * - voter is the address voting
     * - proposal is the index of the proposal voted for
     * - weight is accumulated by delegation. It is the voting power represented in uint256
     * - proposalVotes is the current votes that the voted proposal has
     */
    event Voted(
        address indexed voter,
        uint256 indexed proposal,
        uint256 weight,
        uint256 proposalVotes
    );

    /// @dev This is a type for a single proposal.
    struct Proposal {
        /// @dev short name (up to 32 bytes)
        bytes32 name;
        /// @dev number of accumulated votes
        uint256 voteCount;
    }

    /// @dev This declares a state variable that stores the spent voting power for each possible address.
    mapping(address => uint256) public spentVotePower;

    /// @dev A dynamically-sized array of `Proposal` structs
    Proposal[] public proposals;
    /// @dev The tokenized votes contract address we tie this ballot to
    IERC20Votes public voteToken;
    /// @dev The block we take the snapshot of the current voting power of each possible address
    uint256 public referenceBlock;

    /// @dev Create a new custom ballot to choose one of `proposalNames`.
    /// @param proposalNames Array of proposals to vote from
    /// @param _voteToken Token contract address for the tokenized votes contract
    constructor(bytes32[] memory proposalNames, address _voteToken) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
        voteToken = IERC20Votes(_voteToken);
        referenceBlock = block.number;
    }

    /// @notice Vote for a proposal
    /// @dev We account for each vote through the voteCount property in each proposal struct
    /// @param proposal The proposal index we want to vote for
    /// @param amount The amount of voting power we want to vote with
    function vote(uint256 proposal, uint256 amount) external {
        uint256 votingPowerAvailable = votingPower();
        require(votingPowerAvailable >= amount, "Has not enough voting power");
        spentVotePower[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
        emit Voted(msg.sender, proposal, amount, proposals[proposal].voteCount);
    }

    /// @notice Returns the winning proposal position relative to the others proposals
    /// @dev There are no draws, so the order will matter in case of a draw
    /// @return winningProposal_ The winning proposal index
    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        Proposal[] memory localProposals = proposals;
        for (uint256 p = 0; p < localProposals.length; ++p) {
            if (localProposals[p].voteCount > winningVoteCount) {
                winningVoteCount = localProposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /// @notice Returns the current winning proposal at the time of request
    /// @return winnerName_ The proposal string
    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

    /// @notice Returns the voting power of the address requesting it
    /// @dev The voting power for each voter cannot be changed once this contract is deployed
    /// It is expressed in the number of tokens that the address holds or has been delegated with
    function votingPower() public view returns (uint256 votingPower_) {
        votingPower_ =
            voteToken.getPastVotes(msg.sender, referenceBlock) -
            spentVotePower[msg.sender];
    }

    /// @dev This function works as a getter
    /// @return proposals The proposals from storage
    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
}
