var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
const result = dotenv.config();
var logger = require('morgan');
if (result.error) {
    throw result.error;
}
const { parsed: envs } = result;

const db = require("./src/models");
db.sequelize.sync();

//routes
var apirouter = require('./src/routes/router');
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({
    limit: '100mb',
    parameterLimit: 1000000,
    extended: true
}));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));
var whitelist = ['http://localhost:4200'];
var corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(createError(404, 'Not allowed by CORS'))
        }
    }
}

//success response function
app.use(function(req, res, next) {
    res._response = function(result, status, code, message) {
        var output = {};
        output.status_code = code || 200;
        output.status_message = message || "success";
        output.status = status || "success";
        output.response = result;
        res.json(output);
    };
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.use(cors());

app.get("/", function(req, res, next) {
    return res._response('Api is working fine');
})
app.use("/api/", apirouter);

app.use('/upload', express.static('upload'));
app.use('/images', express.static('images'));
// catch 404 and forward to error handler

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        var response = {};
        response.status_code = err.status || 500;
        response.status_message = err.status_message || err.message || err.stack || "Unknown Error";
        response.errors = err.errors || "";
        response.status = "fail";

        //      res.json(response);
        res.status(response.status_code).send(response);

    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    var response = {};
    response.status_code = err.status || 500;
    response.status_message = err.status_message || err.message || err.stack || "Unknown Error";
    response.errors = err.errors || "";
    response.status = "fail";
    res.json(response);
});
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,DELETE,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});


module.exports = { app, envs };