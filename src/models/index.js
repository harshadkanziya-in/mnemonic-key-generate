const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    logging: false
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.WalletAddress = require("./WalletAddressModel")(sequelize, Sequelize);
db.Blocks = require("./Blocks")(sequelize, Sequelize);
db.Transaction = require("./Transaction")(sequelize, Sequelize);

module.exports = db;