import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('PlanetaryLeaders', {
      LeaderID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'UserID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      PlanetID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Planets',
          key: 'PlanetID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      StartDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      EndDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('PlanetaryLeaders');
  },
};
