import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("PlanetProposals", {
      ProposalID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      PlanetID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Planets",
          key: "PlanetID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ProposedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "UserID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ProposalType: {
        type: DataTypes.ENUM("Terraform", "Rename", "Resource Change", "Destruction"),
        allowNull: false,
      },
      Details: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      Status: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
      },
      DateProposed: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      DecisionBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "UserID",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      DecisionDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("PlanetProposals");
  },
};
