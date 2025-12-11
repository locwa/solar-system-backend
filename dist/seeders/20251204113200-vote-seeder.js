"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert("Votes", [
            {
                VoteID: 1,
                CitizenID: 3, // citizen_beta
                ProposalID: 1, // Terraform Kepler-186f
                VoteChoice: "For",
                VoteDate: new Date(),
            },
        ]);
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("Votes", {}, {});
    },
};
