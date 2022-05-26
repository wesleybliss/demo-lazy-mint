// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

library DemoModels {
    
    struct EIP712Domain {
        string name;
        string version;
        uint256 chainId;
        address verifyingContract;
        bytes32 salt;
    }
    
    struct Identity {
        uint256 userId;
        address wallet;
    }
    
    struct Bid {
        uint256 amount;
        Identity bidder;
    }
    
    struct DemoVoucher {
        
        /// @todo tokenId derrived from Postgres database
        
        /// Number of tokens this voucher can be redeemed for
        uint256 amount;
        
        /// The minimum price (in Wei) that the NFT creator is willing to accept for the initial sale of this NFT
        uint256 reservePrice;
        
        /// The metadata URI to associate with this token
        string metadataUri;
        
        /// EIP-712 signature of all other fields in the NFTVoucher struct
        /// For a voucher to be valid, it must be signed by an account with the MINTER_ROLE
        // bytes signature;
        
    }

}
