import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("Citizens", {
      CitizenID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Users",
          key: "UserID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      CitizenshipStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("Citizens");
  },
};
