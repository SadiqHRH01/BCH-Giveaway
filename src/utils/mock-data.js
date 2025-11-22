export const mockGiveaways = [
  {
    id: 1,
    title: 'First Community Giveaway!',
    prizeAmount: 0.05,
    unlockBlock: '(mock block for 30 min delay)',
    creator: 'admin',
    status: 'funded', // waiting_funds, funded, claimed
    address: 'bchtest:mock_address_for_community_giveaway_12345',
    winner: null,
  },
  {
    id: 2,
    title: 'Test Giveaway - Waiting for Funds',
    prizeAmount: 0.1,
    unlockBlock: '(mock block for 1 hour delay)',
    creator: 'Satoshi',
    status: 'waiting_funds',
    address: 'bchtest:mock_address_for_satoshi_giveaway_67890',
    winner: null,
  }
];