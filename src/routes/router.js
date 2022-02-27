var express = require('express');
var router = express.Router();
const walletAddress = require("../controllers/walletAddressController");
var ValidationMiddleware = require('../middlewares/ValidatorMiddleware');

router.post("/generate-address-mnemonic", ValidationMiddleware.validateGenerateAddressMnemonic, walletAddress.generateAddressByMnemonicKey);
router.post("/generate-address", walletAddress.generateAddressRandomString);
router.post("/get-balance", ValidationMiddleware.validateGetBalance, walletAddress.getBalance);
router.post("/get-latest-block-number", walletAddress.getLatestBlockNumber);

module.exports = router;