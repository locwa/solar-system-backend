import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("Citizens", [
      {
        CitizenID: 3, // citizen_beta
        PlanetID: 1, // Alpha Centauri Bb
        CitizenshipStartDate: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("Citizens", {}, {});
  },
};
