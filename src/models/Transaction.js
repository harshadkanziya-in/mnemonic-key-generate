module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        transaction_hash: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        from_address: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        to_address: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        timestamp: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        amount: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE
        }

    });
    return Transaction;
};