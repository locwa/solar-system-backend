import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("CitizenshipRequests", {
      RequestID: {
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
      FromPlanetID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Planets",
          key: "PlanetID",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      ToPlanetID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Planets",
          key: "PlanetID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      Status: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
      },
      RequestDate: {
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
    await queryInterface.dropTable("CitizenshipRequests");
  },
};
