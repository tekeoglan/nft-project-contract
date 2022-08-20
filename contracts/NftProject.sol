// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhiteList.sol";

contract NftProject is ERC721Enumerable, Ownable {
    // Type Declarations
    // State variables
    // Events
    // Modifiers
    // Functions
    // .constructor
    // .receive
    // .fallback
    // .external
    // .public
    // .internal
    // .private
    IWhiteList whitelist;
    uint256 public constant MAX_TOKEN_IDS = 2;
    string private baseTokenURI;
    uint256 public price = 0.01 ether;
    bool public pauseContract = false;
    uint256 public tokenIds;
    bool public presaleStarted = false;
    uint256 public presaleEndedTime;

    event PresaleStarted(uint);

    modifier onlyWhenNotPaused() {
        require(!pauseContract, "Contract currently paused.");
        _;
    }

    constructor(string memory baseURI, address whitelistContract) ERC721("NftProject", "NP") {
        baseTokenURI = baseURI;
        whitelist = IWhiteList(whitelistContract);
    }

    receive() external payable {}

    fallback() external payable {}

    function startPresale() public onlyOwner {
        require(!presaleStarted, "Presale Already Started");
        presaleEndedTime = block.timestamp + 5 minutes;
        presaleStarted = true;
        emit PresaleStarted(block.timestamp);
    }

    function presaleMint() public payable onlyWhenNotPaused {
        require(presaleStarted && block.timestamp < presaleEndedTime, "Presale is not running.");
        require(whitelist.isWhiteListed(msg.sender), "You are not whitelisted.");
        require(tokenIds < MAX_TOKEN_IDS, "Exceded maximum NftProject supply");
        require(msg.value >= price, "Not enough money.");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    function mint() public payable {
        require(presaleStarted && block.timestamp >= presaleEndedTime, "Presale is not ended.");
        require(tokenIds < MAX_TOKEN_IDS, "Exceded maximum NftProject supply.");
        require(msg.value >= price, "Not enough money.");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    function setPaused(bool paused) public onlyOwner {
        pauseContract = paused;
    }

    function withdraw() public onlyOwner {
        address owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = owner.call{value: amount}("");
        require(sent, "withdrawal failed.");
    }

    function isTokenExist(uint256 _tokenId) public view returns (bool) {
        return _exists(_tokenId);
    }
}
