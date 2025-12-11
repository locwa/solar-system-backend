import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("Planets", {
      PlanetID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      Description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      Status: {
        type: DataTypes.ENUM("Active", "Terraforming", "Destroyed"),
        allowNull: false,
        defaultValue: "Active",
      },
      Population: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      CreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Refers to the table name
          key: "UserID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      CreatedByGalacticLeader: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("Planets");
  },
};
