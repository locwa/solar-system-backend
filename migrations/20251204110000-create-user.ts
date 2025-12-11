import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('Users', {
      UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      Password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      FullName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      Role: {
        type: DataTypes.ENUM('Citizen', 'Planetary Leader', 'Galactic Leader'),
        allowNull: false,
      },
      IsGalacticLeader: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      DateJoined: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('Users');
  },
};
