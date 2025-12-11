import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("Votes", {
      VoteID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      CitizenID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Citizens",
          key: "CitizenID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ProposalID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PlanetProposals",
          key: "ProposalID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      VoteChoice: {
        type: DataTypes.ENUM("For", "Against"),
        allowNull: false,
      },
      VoteDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("Votes");
  },
};
