import * as Mainnet from 'mainnet-js';

// Use the Contract class from the mainnet-js library
const { Contract, Wallet } = Mainnet;

// --- IMPORTANT CONFIGURATION ---

// 1. SET YOUR NETWORK: 'mainnet' or 'chipnet' (for testnet)
export const NETWORK = 'chipnet';

// 2. SET YOUR PRIVATE KEY
// This is the key that will be used to fund and claim from the contract.
// Get a testnet WIF from a faucet like https://tbch.googol.cash/
export const WIF = "KyNkXqTRrCYqvQkbQq3PPDnjZEoRokLqK3m7L84m6E2uf4qcZRr5"; // <--- REPLACE WITH YOUR TESTNET WIF, and keep it safe!

// --- END OF CONFIGURATION ---

/**
 * Initializes the default wallet from the WIF private key.
 * This must be called before any other mainnet-js function.
 */
export async function initWallet() {
  const wallet = await Wallet.fromWIF(WIF, NETWORK);
  Wallet.setAsDefault(wallet);
}

/**
 * The CashScript contract for a timed giveaway.
 * It allows anyone to claim the funds, but only after a specific block
 * height has been reached.
 */
const TimedGiveawayContract = `
pragma cashscript ^0.8.0;

contract TimedGiveaway(int unlockBlock) {
    function claim() {
        require(tx.age >= unlockBlock);
    }
}
`;

/**
 * Creates a contract instance with a specific unlock block.
 * @param {number} unlockBlock - The block height when the funds can be claimed.
 * @returns {Promise<import("mainnet-js").Contract>}
 */
export async function getContractInstance(unlockBlock) {
    // The contract is instantiated with the unlockBlock as a constructor argument
    return await Contract.new(TimedGiveawayContract, [unlockBlock]);
}

/**
 * Spends the funds from a giveaway contract.
 * @param {string} contractAddress - The address of the contract to spend from.
* @param {number} unlockBlock - The unlock block of the contract.
 * @param {string} receiverAddress - The address to send the claimed funds to.
 * @returns {Promise<string>} - The transaction ID.
 */
export async function claimGiveaway(contractAddress, unlockBlock, receiverAddress) {
    console.log(`Attempting to claim from contract: ${contractAddress}`);

    // Re-create the contract object from the known address and parameters
    const contract = await Contract.fromCashaddr(contractAddress, TimedGiveawayContract, [unlockBlock]);


    const contractBalance = await contract.getBalance();
    console.log(`Contract balance: ${contractBalance.sat} sats`);

    if (contractBalance.sat < 2000) {
        throw new Error("Contract has insufficient funds to claim (or is not yet funded).");
    }

    // Build and send the claim transaction
    const tx = await contract.functions
        .claim()
        .to(receiverAddress, contractBalance.sat - 1000) // Send balance minus a 1000 sat fee
        .age(unlockBlock) // Enforce the time lock
        .send();

    return tx.txid;
}