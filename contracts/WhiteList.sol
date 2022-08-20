//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract WhiteList {
    uint8 private s_maxWhiteListed;
    uint8 private s_numOfWhiteListed;
    mapping(address => bool) private s_userToWhiteListed;

    event WhiteListed(address _user, uint8 _numWhiteListed);

    constructor(uint8 _maxWhiteListed) {
        s_maxWhiteListed = _maxWhiteListed;
        s_numOfWhiteListed = 0;
    }

    function addToWhiteList() external {
        require(s_numOfWhiteListed < s_maxWhiteListed, "Max participents reached.");
        require(!s_userToWhiteListed[msg.sender], "User already whitelisted.");

        s_numOfWhiteListed += 1;
        s_userToWhiteListed[msg.sender] = true;
        emit WhiteListed(msg.sender, s_numOfWhiteListed);
    }

    function getMaxWhiteList() external view returns (uint8) {
        return s_maxWhiteListed;
    }

    function getNumOfWhiteListed() external view returns (uint8) {
        return s_numOfWhiteListed;
    }

    function isWhiteListed(address _user) external view returns (bool) {
        return s_userToWhiteListed[_user];
    }
}
