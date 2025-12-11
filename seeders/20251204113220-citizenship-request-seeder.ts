import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("CitizenshipRequests", [
      {
        RequestID: 1,
        CitizenID: 3, // citizen_beta
        FromPlanetID: 1, // Alpha Centauri Bb
        ToPlanetID: 2, // Kepler-186f
        Status: "Pending",
        RequestDate: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("CitizenshipRequests", {}, {});
  },
};
