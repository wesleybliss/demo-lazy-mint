// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "./DemoEvents.sol";

abstract contract DemoCore is
    ERC1155,
    Ownable,
    Pausable,
    ERC1155Supply,
    DemoEvents {
    
    function pause() public onlyOwner {
        _pause();
        emit DemoPaused();
    }
    
    function unpause() public onlyOwner {
        _unpause();
        emit DemoUnpaused();
    }
    
    // The following functions are overrides required by Solidity.
    
    /* function uri(uint256 id) public view override returns (string memory) {
        return super.uri(id);
    } */
    
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
    
}
