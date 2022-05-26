// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
import { DemoModels as Models } from "./models/DemoModels.sol";
import "./utils/CountersEx.sol";
import "./mixins/DemoCore.sol";

import { StringUtils } from "./utils/StringUtils.sol";

contract Demo is DemoCore, EIP712, StringUtils {
    
    using CountersEx for CountersEx.Counter;
    
    uint256 constant chainId = 1337;
    string private constant SIGNING_DOMAIN = "DemoVoucher";
    string private constant SIGNATURE_VERSION = "1";
    
    bytes32 constant salt = 0x5f16f4c7f149ac4f9510d9cf8cf384038ad348b3bcdc01915f95de12df9d1b02;
    string private constant EIP712_DOMAIN =
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)";
    bytes32 private constant EIP712_DOMAIN_TYPEHASH = keccak256(abi.encodePacked(EIP712_DOMAIN));
    
    bytes32 private DOMAIN_SEPARATOR = keccak256(abi.encode(
        EIP712_DOMAIN_TYPEHASH,
        keccak256("Demo"),
        keccak256("1"),
        chainId,
        address(this), // verifyingContract
        salt
    ));
    
    // Token ID counter
    CountersEx.Counter internal _tokenIdCounter;
    
    constructor()
    ERC1155("")
    EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
        // NOOP
    }
    
    /// todo just for testing
    function isDeployed() public pure returns (bool) {
        return true;
    }
    
    /**
     * @dev Mints a single new token
     * The `to` param is always `msg.sender`, from the `mint` function
     * The param `data` is additional data with no specified format that you can use for your own purpose
     * 
     * Emits a {DemoMinted} event
     */
    function mint(
        address account,
        bytes memory data
    ) external payable {
        
        uint256 _tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _mint(account, _tokenId, 1, data);
        
        emit DemoMinted(account, _tokenId);
        
    }
    
    function mintBatch(
        address to,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        
        uint256 nextId = _tokenIdCounter.current();
        _tokenIdCounter.incrementBy(amounts.length);
        
        uint256 max = nextId + amounts.length;
        uint256[] memory tokenIds = new uint256[](nextId);
        
        for (uint256 i = 1; i < max; i++) {
            tokenIds[i] = nextId + i;
        }
        
        _mintBatch(to, tokenIds, amounts, data);
        
    }
    
    /// Returns the chain id of the current blockchain.
    /// @dev This is used to workaround an issue with ganache returning different
    /// values from the on-chain chainid() function and the eth_chainId RPC method
    /// See https://github.com/protocol/nft-website/issues/121
    function getChainID() external view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }
    
    /// Returns a hash of the given Models.DemoVoucher, prepared using EIP712 typed data hashing rules
    /// @param voucher A Models.DemoVoucher to hash
    function _hash(Models.DemoVoucher calldata voucher) internal view returns (bytes32) {
        return _hashTypedDataV4(keccak256(abi.encode(
            keccak256("DemoVoucher(uint256 amount,uint256 reservePrice,string metadataUri)"),
            voucher.amount,
            voucher.reservePrice,
            keccak256(bytes(voucher.metadataUri))
        )));
    }
    
    /// Verifies the signature for a given DemoVoucher, returning the address of the signer
    /// @dev Will revert if the signature is invalid. Does not verify that the signer is authorized to mint NFTs.
    /// @param voucher A Models.DemoVoucher describing an unminted NFT
    function _verify(
        Models.DemoVoucher calldata voucher,
        bytes memory signature
    ) internal view returns (address) {
        require(voucher.amount > 0, "Param amount is required");
        require(voucher.reservePrice > 0, "Param reservePrice is required");
        require(bytes(voucher.metadataUri).length > 0, "Param metadataUri is required");
        require(signature.length > 0, 'Param signature is required');
        
        bytes32 digest = _hash(voucher);
        bytes32 totalHash = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, digest));
        
        return ECDSA.recover(totalHash, signature);
    }
    
    function verifyVoucher(
        Models.DemoVoucher calldata voucher,
        bytes memory signature
    ) public view returns (address) {
        return _verify(voucher, signature);
    }
    
    /// @notice Redeems a Models.DemoVoucher for an actual NFT, creating it in the process
    /// @param voucher A signed NFTVoucher that describes the NFT to be redeemed.
    function redeem(
        Models.DemoVoucher calldata voucher,
        bytes memory signature
    ) public payable returns (uint256) {
        
        // Make sure signature is valid and get the address of the signer
        address signer = _verify(voucher, signature);
        
        // Make sure that the redeemer is paying enough to cover the buyer's cost
        require(msg.value >= voucher.reservePrice, "Insufficient funds to redeem");
        
        //
        // @todo Token ID hard coded to 1 here, until signature verification works
        //
        
        // First assign the token to the signer, to establish provenance on-chain
        _mint(signer, 1, voucher.amount, "");
        
        emit DemoMinted(signer, 1);
        
        return 1;
        
    }
    
    /// Debug function to get a hash of the voucher data
    function debugSignDigest(
        Models.DemoVoucher calldata voucher
    ) public view returns (bytes32) {
        
        require(voucher.amount > 0, "Param amount is required");
        require(voucher.reservePrice > 0, "Param reservePrice is required");
        require(bytes(voucher.metadataUri).length > 0, "Param metadataUri is required");
        
        bytes32 digest = _hash(voucher);
        
        return digest;
        
    }
    
    /// Debug function to get a hash of the voucher data + other required fields (domain, etc)
    function debugSignTotalHash(
        Models.DemoVoucher calldata voucher
    ) public view returns (bytes32) {
        
        require(voucher.amount > 0, "Param amount is required");
        require(voucher.reservePrice > 0, "Param reservePrice is required");
        require(bytes(voucher.metadataUri).length > 0, "Param metadataUri is required");
        
        bytes32 digest = _hash(voucher);
        bytes32 totalHash = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, digest));
        
        return totalHash;
        
    }
    
    /// Debug function to verify the hash of the voucher data
    function debugVerifyString1(
        Models.DemoVoucher calldata voucher,
        bytes memory signature
    ) public view returns (address) {
        require(voucher.amount > 0, "Param amount is required");
        require(voucher.reservePrice > 0, "Param reservePrice is required");
        require(bytes(voucher.metadataUri).length > 0, "Param metadataUri is required");
        require(signature.length > 0, 'Param signature is required');
        
        bytes32 digest = _hash(voucher);
        return ECDSA.recover(digest, signature);
    }
    
    /// Debug function to verify the hash of the voucher data + other required fields (domain, etc)
    function debugVerifyString2(
        Models.DemoVoucher calldata voucher,
        bytes memory signature
    ) public view returns (address) {
        require(voucher.amount > 0, "Param amount is required");
        require(voucher.reservePrice > 0, "Param reservePrice is required");
        require(bytes(voucher.metadataUri).length > 0, "Param metadataUri is required");
        require(signature.length > 0, 'Param signature is required');
        
        bytes32 digest = _hash(voucher);
        bytes32 totalHash = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, digest));
        return ECDSA.recover(totalHash, signature);
    }
    
}
