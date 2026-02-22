// ZK Health Data Marketplace Contract
// Starknet Cairo Module
// Stores data commitments, manages sealed auctions, and settles bids

#[starknet::contract]
mod Marketplace {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{StoragePointerMemberAccess, Map};

    #[storage]
    struct Storage {
        // Data commitments: hash -> (seller, proof_hash, ipfs_hash)
        data_commitments: Map::<u256, DataCommitment>,
        
        // Auction listings: id -> (seller, commitment_hash, min_bid, active)
        auctions: Map::<u256, AuctionListing>,
        
        // Sealed bids: (auction_id, bidder) -> encrypted_bid
        sealed_bids: Map::<(u256, ContractAddress), felt252>,
        
        // User stats
        seller_earnings: Map::<ContractAddress, u256>,
        seller_reputation: Map::<ContractAddress, u256>,
        
        // Counters
        auction_count: u256,
        total_volume: u256,
        owner: ContractAddress,
    }

    #[derive(Drop, Copy, Serde)]
    struct DataCommitment {
        seller: ContractAddress,
        data_hash: u256,
        proof_hash: felt252,
        ipfs_hash: felt252,
        timestamp: u64,
    }

    #[derive(Drop, Copy, Serde)]
    struct AuctionListing {
        seller: ContractAddress,
        commitment_hash: u256,
        min_bid: u256,
        active: bool,
        created_at: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        DataCommitted: DataCommitted,
        AuctionCreated: AuctionCreated,
        BidPlaced: BidPlaced,
        AuctionSettled: AuctionSettled,
        EarningsWithdrawn: EarningsWithdrawn,
    }

    #[derive(Drop, starknet::Event)]
    struct DataCommitted {
        seller: ContractAddress,
        data_hash: u256,
        proof_hash: felt252,
        ipfs_hash: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct AuctionCreated {
        auction_id: u256,
        seller: ContractAddress,
        min_bid: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct BidPlaced {
        auction_id: u256,
        bidder: ContractAddress,
        sealed_bid: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct AuctionSettled {
        auction_id: u256,
        winner: ContractAddress,
        final_bid: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct EarningsWithdrawn {
        seller: ContractAddress,
        amount: u256,
    }

    // Initialize contract
    #[constructor]
    fn constructor(ref self: ContractState) {
        self.owner.write(get_caller_address());
        self.auction_count.write(0);
        self.total_volume.write(0);
    }

    // Commit health data with ZK proof to blockchain
    // Returns: commitment ID (hash)
    #[external(v0)]
    fn commit_data(
        ref self: ContractState,
        data_hash: u256,
        proof_hash: felt252,
        ipfs_hash: felt252,
    ) -> u256 {
        let caller = get_caller_address();
        let timestamp = get_block_timestamp();

        let commitment = DataCommitment {
            seller: caller,
            data_hash,
            proof_hash,
            ipfs_hash,
            timestamp,
        };

        self.data_commitments.write(data_hash, commitment);

        self
            .emit(
                DataCommitted {
                    seller: caller,
                    data_hash,
                    proof_hash,
                    ipfs_hash,
                }
            );

        data_hash
    }

    // Create a sealed auction for committed data
    #[external(v0)]
    fn create_auction(
        ref self: ContractState,
        data_hash: u256,
        min_bid: u256,
    ) -> u256 {
        let caller = get_caller_address();
        let commitment = self.data_commitments.read(data_hash);

        // Verify caller is the data seller
        assert(commitment.seller == caller, 'Only seller can create auction');

        let auction_id = self.auction_count.read();
        let new_auction = AuctionListing {
            seller: caller,
            commitment_hash: data_hash,
            min_bid,
            active: true,
            created_at: get_block_timestamp(),
        };

        self.auctions.write(auction_id, new_auction);
        self.auction_count.write(auction_id + 1);

        self
            .emit(
                AuctionCreated {
                    auction_id,
                    seller: caller,
                    min_bid,
                }
            );

        auction_id
    }

    // Place a sealed bid on an auction
    #[external(v0)]
    fn place_sealed_bid(
        ref self: ContractState,
        auction_id: u256,
        encrypted_bid: felt252,
    ) {
        let caller = get_caller_address();
        let auction = self.auctions.read(auction_id);

        assert(auction.active, 'Auction is not active');
        assert(caller != auction.seller, 'Seller cannot bid on own auction');

        self.sealed_bids.write((auction_id, caller), encrypted_bid);

        self
            .emit(
                BidPlaced {
                    auction_id,
                    bidder: caller,
                    sealed_bid: encrypted_bid,
                }
            );
    }

    // Settle auction (called by seller or trusted settler)
    // Winner is determined off-chain and revealed on-chain
    #[external(v0)]
    fn settle_auction(
        ref self: ContractState,
        auction_id: u256,
        winner: ContractAddress,
        final_bid: u256,
    ) {
        let auction = self.auctions.read(auction_id);
        let caller = get_caller_address();

        assert(caller == auction.seller, 'Only seller can settle');
        assert(auction.active, 'Auction already settled');
        assert(final_bid >= auction.min_bid, 'Bid below minimum');

        // Mark auction as inactive
        let settled_auction = AuctionListing {
            seller: auction.seller,
            commitment_hash: auction.commitment_hash,
            min_bid: auction.min_bid,
            active: false,
            created_at: auction.created_at,
        };
        self.auctions.write(auction_id, settled_auction);

        // Update seller earnings
        let current_earnings = self.seller_earnings.read(auction.seller);
        self.seller_earnings.write(auction.seller, current_earnings + final_bid);

        // Update seller reputation
        let current_rep = self.seller_reputation.read(auction.seller);
        self.seller_reputation.write(auction.seller, current_rep + 1);

        // Update total volume
        let current_volume = self.total_volume.read();
        self.total_volume.write(current_volume + final_bid);

        self
            .emit(
                AuctionSettled {
                    auction_id,
                    winner,
                    final_bid,
                }
            );
    }

    // Withdraw earnings
    #[external(v0)]
    fn withdraw_earnings(ref self: ContractState, amount: u256) {
        let caller = get_caller_address();
        let balance = self.seller_earnings.read(caller);

        assert(balance >= amount, 'Insufficient balance');

        self.seller_earnings.write(caller, balance - amount);

        self
            .emit(
                EarningsWithdrawn {
                    seller: caller,
                    amount,
                }
            );

        // In production: transfer tokens to caller
        // (requires token integration)
    }

    // View functions
    #[view]
    fn get_data_commitment(
        self: @ContractState,
        data_hash: u256,
    ) -> DataCommitment {
        self.data_commitments.read(data_hash)
    }

    #[view]
    fn get_auction(
        self: @ContractState,
        auction_id: u256,
    ) -> AuctionListing {
        self.auctions.read(auction_id)
    }

    #[view]
    fn get_seller_earnings(
        self: @ContractState,
        seller: ContractAddress,
    ) -> u256 {
        self.seller_earnings.read(seller)
    }

    #[view]
    fn get_seller_reputation(
        self: @ContractState,
        seller: ContractAddress,
    ) -> u256 {
        self.seller_reputation.read(seller)
    }

    #[view]
    fn get_total_volume(
        self: @ContractState,
    ) -> u256 {
        self.total_volume.read()
    }

    #[view]
    fn get_auction_count(
        self: @ContractState,
    ) -> u256 {
        self.auction_count.read()
    }
}
