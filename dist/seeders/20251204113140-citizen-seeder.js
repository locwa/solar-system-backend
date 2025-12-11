"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert("Citizens", [
            {
                CitizenID: 3, // citizen_beta
                PlanetID: 1, // Alpha Centauri Bb
                CitizenshipStartDate: new Date(),
            },
        ]);
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("Citizens", {}, {});
    },
};
