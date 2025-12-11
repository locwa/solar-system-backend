import { QueryInterface, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await queryInterface.bulkInsert("Users", [
      {
        UserID: 1,
        Username: "galactic_leader",
        Password: hashedPassword,
        FullName: "Galactic Leader One",
        Role: "Galactic Leader",
        DateJoined: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserID: 2,
        Username: "planetary_leader_alpha",
        Password: hashedPassword,
        FullName: "Planetary Leader Alpha",
        Role: "Planetary Leader",
        DateJoined: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserID: 3,
        Username: "citizen_beta",
        Password: hashedPassword,
        FullName: "Citizen Beta",
        Role: "Citizen",
        DateJoined: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("Users", {}, {});
  },
};
