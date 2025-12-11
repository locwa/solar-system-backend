"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert("PlanetaryLeaders", [
            {
                LeaderID: 2, // planetary_leader_alpha
                PlanetID: 1, // Alpha Centauri Bb
                StartDate: new Date(),
            },
        ]);
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("PlanetaryLeaders", {}, {});
    },
};
