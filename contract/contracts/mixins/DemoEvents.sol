// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

abstract contract DemoEvents {
    
    event DemoPaused();
    event DemoUnpaused();
    event DemoMinted(address indexed owner, uint256 tokenId);
    event DemoTransfered(address indexed from, address indexed to, uint256 tokenId);
    
}
