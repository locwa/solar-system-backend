"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable("Votes", {
            VoteID: {
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
            ProposalID: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "PlanetProposals",
                    key: "ProposalID",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            VoteChoice: {
                type: sequelize_1.DataTypes.ENUM("For", "Against"),
                allowNull: false,
            },
            VoteDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("Votes");
    },
};
