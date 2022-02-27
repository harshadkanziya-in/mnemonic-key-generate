const bip39 = require('bip39');
const HDWallet = require('ethereum-hdwallet')
var ethWallet = require('ethereumjs-wallet');
var ethers = require('ethers');
var providers = require('ethers').providers;
const db = require("../models");
const WalletAddress = db.WalletAddress;
const Blocks = db.Blocks;
const Transaction = db.Transaction;
const Op = db.Sequelize.Op;
const providerUrl = 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const providerW3Url = 'https://ropsten.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
var customWsProvider = new ethers.providers.WebSocketProvider(providerW3Url);

exports.getWalletAddress = async(mnemonic, path) => {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    let seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
    var response = {
        mnemonic: mnemonic,
        seed: seed,
        wallet_address: await wallet.getAddress(),
        private_key: wallet.privateKey,
        public_key: wallet._signingKey().compressedPublicKey
    }
    return response;
};

exports.saveTransactionDetails = async(transactionDetail) => {

    if (transactionDetail != null) {

        let transactionHash = transactionDetail.hash;
        let fromAddress = transactionDetail.from;
        let toAddress = transactionDetail.to;
        let timestamp = transactionDetail.timestamp;
        let amount = ethers.utils.formatEther(transactionDetail.value);

        WalletAddress.findOne({
                where: {
                    [Op.or]: {
                        wallet_address: toAddress
                    },
                    [Op.or]: {
                        wallet_address: fromAddress
                    }
                }
            })
            .then((arg) => {
                if (arg && arg != null) {
                    console.log("getAllAddress", arg);
                    Transaction.create({
                        transaction_hash: transactionHash,
                        from_address: fromAddress,
                        to_address: toAddress,
                        timestamp: timestamp,
                        amount: amount
                    });
                }
            });
    }

}
exports.getLatestBlockDetails = async(blockNumber) => {
    // Block Number
    let currentBlock = await provider.getBlock(blockNumber);


    //console.log("currentBlock", currentBlock);
    // Find all users

    //console.log("getAllAddress", getAllAddress);

    Blocks.create({
        block_hash: currentBlock.hash,
        parent_hash: currentBlock.parentHash,
        timestamp: currentBlock.timestamp
    });

    for (let tx of currentBlock.transactions) {
        let transactionDetail = await customWsProvider.getTransaction(tx);
        //console.log("getTransactionReceipt", await customWsProvider.getTransactionReceipt(tx));
        /* if (transactionDetail != null) {
            let transactionHash = transactionDetail.hash;
            let fromAddress = transactionDetail.from;
            let toAddress = transactionDetail.to;
            let timestamp = transactionDetail.timestamp;
            let amount = ethers.utils.formatEther(transactionDetail.value);

            await WalletAddress.findOne({
                    where: {
                        [Op.or]: {
                            wallet_address: toAddress
                        },
                        [Op.or]: {
                            wallet_address: fromAddress
                        }
                    }
                })
                .then((arg) => {

                    if (arg && arg != null) {
                        console.log("getAllAddress", arg);
                        Transaction.create({
                            transaction_hash: transactionHash,
                            from_address: fromAddress,
                            to_address: toAddress,
                            timestamp: timestamp,
                            amount: amount

                        });
                    }


                });
        } */

    }


}