"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('PlanetaryLeaders', {
            LeaderID: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Users',
                    key: 'UserID',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            PlanetID: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Planets',
                    key: 'PlanetID',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            StartDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            EndDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('PlanetaryLeaders');
    },
};
