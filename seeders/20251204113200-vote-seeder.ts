import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
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

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("Votes", {}, {});
  },
};
