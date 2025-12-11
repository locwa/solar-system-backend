"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable("PlanetProposals", {
            ProposalID: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            PlanetID: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Planets",
                    key: "PlanetID",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            ProposedBy: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "UserID",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            ProposalType: {
                type: sequelize_1.DataTypes.ENUM("Terraform", "Rename", "Resource Change", "Destruction"),
                allowNull: false,
            },
            Details: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            Status: {
                type: sequelize_1.DataTypes.ENUM("Pending", "Approved", "Rejected"),
                allowNull: false,
                defaultValue: "Pending",
            },
            DateProposed: {
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
        await queryInterface.dropTable("PlanetProposals");
    },
};
