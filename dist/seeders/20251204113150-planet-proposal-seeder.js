"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert("PlanetProposals", [
            {
                ProposalID: 1,
                PlanetID: 2, // Kepler-186f
                ProposedBy: 1, // galactic_leader
                ProposalType: "Terraform",
                Details: "Initiate terraforming process for Kepler-186f to make it habitable.",
                Status: "Pending",
                DateProposed: new Date(),
            },
        ]);
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("PlanetProposals", {}, {});
    },
};
