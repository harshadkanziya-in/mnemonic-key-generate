module.exports = (sequelize, Sequelize) => {
    const Blocks = sequelize.define("blocks", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        block_hash: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        parent_hash: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        timestamp: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        process: {
            type: Sequelize.TEXT,
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
    return Blocks;
};