module.exports = (sequelize, Sequelize) => {
    const WalletAddress = sequelize.define("wallet_address", {
        mnemonic: {
            type: Sequelize.DataTypes.TEXT('long'),
            allowNull: true
        },
        seed: {
            type: Sequelize.DataTypes.TEXT('long'),
            allowNull: true
        },
        wallet_address: {
            type: Sequelize.DataTypes.TEXT('long'),
            allowNull: true
        },
        public_key: {
            type: Sequelize.DataTypes.TEXT('long'),
            allowNull: true
        },
        private_key: {
            type: Sequelize.DataTypes.TEXT('long'),
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
    return WalletAddress;
};