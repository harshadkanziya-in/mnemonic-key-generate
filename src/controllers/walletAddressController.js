const db = require("../models");
const WalletAddress = db.WalletAddress;
const Blocks = db.Blocks;
const Transaction = db.Transaction;
const Op = db.Sequelize.Op;
const bip39 = require('bip39');
const HDWallet = require('ethereum-hdwallet')
var ethWallet = require('ethereumjs-wallet');
var ethers = require('ethers');
var common = require("../helpers/common");
var providers = require('ethers').providers;
const providerUrl = 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const providerW3Url = 'https://ropsten.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
var customWsProvider = new ethers.providers.WebSocketProvider(providerW3Url);


var init = function() {

    customWsProvider.on("block", (blockNumber) => {
        console.log("blockNumber", blockNumber);
        common.getLatestBlockDetails(blockNumber);
        // Emitted on every block change
    })


    customWsProvider.on("pending", (tx) => {
        //console.log("tx", tx);

        customWsProvider.getTransaction(tx).then(function(transaction) {
            //  console.log("to", transaction.to);
            //console.log("transaction", transaction);
            if (transaction != null) {
                common.saveTransactionDetails(transaction);
                /*  let transactionHash = transaction.hash;
                 let fromAddress = transaction.from;
                 let toAddress = transaction.to;
                 let timestamp = transaction.timestamp;
                 let amount = ethers.utils.formatEther(transaction.value);
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


                     }); */
            }


        });
    });



    customWsProvider._websocket.on("error", async(ep) => {
        console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`);
        setTimeout(init, 3000);
    });
    customWsProvider._websocket.on("close", async(code) => {
        console.log(
            `Connection lost with code ${code}! Attempting reconnect in 3s...`
        );
        customWsProvider._websocket.terminate();
        setTimeout(init, 3000);
    });



};
init();


/**
 * Generate walltet address random based 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.generateAddressRandomString = async(req, res) => {
    var mnemonic = bip39.generateMnemonic();
    var row = req.body.row;
    var response = []
    if (row == undefined) {
        let path = "m/44'/60'/0'/0/0";
        response = [await common.getWalletAddress(mnemonic, path)];
    } else if (row && row > 0) {

        for (i = 0; i <= row; i++) {
            let path = "m/44'/60'/0'/0/" + i;
            var address = await common.getWalletAddress(mnemonic, path);
            response.push(address);
        }
    }
    WalletAddress.bulkCreate(response).then();
    return res._response({}, "success", 200, true);
};


// Create and Save a new Tutorial
exports.generateAddressByMnemonicKey = async(req, res) => {
    var mnemonic = req.body.mnemonic;
    var row = req.body.row;
    console.log(row)
    var response = []
    if (row == undefined) {
        let path = "m/44'/60'/0'/0/0";
        response = [await common.getWalletAddress(mnemonic, path)];
    } else if (row && row > 0) {
        for (i = 0; i <= row; i++) {
            let path = "m/44'/60'/0'/0/" + i;
            var address = await common.getWalletAddress(mnemonic, path);
            response.push(address);
        }
    }
    WalletAddress.bulkCreate(response).then();
    return res._response({}, "success", 200, true);
};


// Create and Save a new Tutorial
exports.getLatestBlockNumber = async(req, res) => {

    provider.getBlockNumber().then((result) => {
        console.log("Current block number: " + result);
    });


    let currentBlockNumber = await provider.getBlockNumber();

    // Block Number
    let currentBlock = await provider.getBlock();

    console.log(currentBlock);
    return res._response({}, "success", 200, true);

};

// Create and Save a new Tutorial
exports.getBalance = async(req, res) => {
    var address = req.body.address;
    let balance = await provider.getBalance(address);
    balance = ethers.utils.formatEther(balance);


    return res._response({ balance: balance }, "success", 200, true);

};