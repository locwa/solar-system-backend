"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('Users', {
            UserID: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            Username: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            Password: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            FullName: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
            },
            Role: {
                type: sequelize_1.DataTypes.ENUM('Citizen', 'Planetary Leader', 'Galactic Leader'),
                allowNull: false,
            },
            IsGalacticLeader: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            DateJoined: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Users');
    },
};
