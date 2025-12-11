import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("PlanetaryLeaders", [
      {
        LeaderID: 2, // planetary_leader_alpha
        PlanetID: 1, // Alpha Centauri Bb
        StartDate: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("PlanetaryLeaders", {}, {});
  },
};
