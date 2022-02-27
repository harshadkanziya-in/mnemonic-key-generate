var moment = require("moment");
exports.validateGetBalance = function(req, res, next) {
    if (!req.body.address) {
        var response = {};
        response.status_code = 400;
        response.status_message = "Please provide valid address";
        response.status = "forbidden";
        res.status(400).send(response);
    } else next();
}

exports.validateGenerateAddressMnemonic = function(req, res, next) {
    if (!req.body.mnemonic) {
        var response = {};
        response.status_code = 400;
        response.status_message = "Please provide valid mnemonic text.";
        response.status = "forbidden";
        res.status(400).send(response);
    } else next();
};