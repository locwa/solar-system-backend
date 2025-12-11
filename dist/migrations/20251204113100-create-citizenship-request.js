"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable("CitizenshipRequests", {
            RequestID: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            CitizenID: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Citizens",
                    key: "CitizenID",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            FromPlanetID: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Planets",
                    key: "PlanetID",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            ToPlanetID: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Planets",
                    key: "PlanetID",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            Status: {
                type: sequelize_1.DataTypes.ENUM("Pending", "Approved", "Rejected"),
                allowNull: false,
                defaultValue: "Pending",
            },
            RequestDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
            DecisionBy: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Users",
                    key: "UserID",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            DecisionDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("CitizenshipRequests");
    },
};
