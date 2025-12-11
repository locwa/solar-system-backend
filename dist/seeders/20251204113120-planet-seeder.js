"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert("Planets", [
            {
                PlanetID: 1,
                Name: "Alpha Centauri Bb",
                Status: "Active",
                Population: 1000000,
                CreatedBy: 1, // Assuming Galactic Leader with UserID 1 creates planets
                CreatedDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                PlanetID: 2,
                Name: "Kepler-186f",
                Status: "Terraforming",
                Population: 0,
                CreatedBy: 1, // Assuming Galactic Leader with UserID 1 creates planets
                CreatedDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("Planets", {}, {});
    },
};
