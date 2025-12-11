import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Planet from './Planet';

interface CitizenAttributes {
  CitizenID: number; // PK, FK to User.UserID
  PlanetID: number; // FK to Planet.PlanetID
  CitizenshipStartDate: Date;
}

interface CitizenCreationAttributes extends Optional<CitizenAttributes, 'CitizenshipStartDate'> {}

class Citizen extends Model<CitizenAttributes, CitizenCreationAttributes> implements CitizenAttributes {
  public CitizenID!: number;
  public PlanetID!: number;
  public CitizenshipStartDate!: Date;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly User?: User;
  public readonly Planet?: Planet;
}

Citizen.init(
  {
    CitizenID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users', // Refers to the table name
        key: 'UserID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    PlanetID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Planets', // Refers to the table name
        key: 'PlanetID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    CitizenshipStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'Citizens',
    sequelize,
    timestamps: true,
  }
);

// Associations
Citizen.belongsTo(User, { foreignKey: 'CitizenID', as: 'User' });
Citizen.belongsTo(Planet, { foreignKey: 'PlanetID', as: 'Planet' });

export default Citizen;
