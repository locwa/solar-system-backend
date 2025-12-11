import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Planet from './Planet';

interface PlanetaryLeaderAttributes {
  LeaderID: number; // PK, FK to User.UserID
  PlanetID: number; // FK to Planet.PlanetID
  StartDate: Date;
  EndDate?: Date | null;
}

interface PlanetaryLeaderCreationAttributes extends Optional<PlanetaryLeaderAttributes, 'EndDate'> {}

class PlanetaryLeader extends Model<PlanetaryLeaderAttributes, PlanetaryLeaderCreationAttributes> implements PlanetaryLeaderAttributes {
  public LeaderID!: number;
  public PlanetID!: number;
  public StartDate!: Date;
  public EndDate?: Date | null;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly Leader?: User;
  public readonly Planet?: Planet;
}

PlanetaryLeader.init(
  {
    LeaderID: {
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
    StartDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    EndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'PlanetaryLeaders',
    sequelize,
    timestamps: true,
  }
);

// Associations
PlanetaryLeader.belongsTo(User, { foreignKey: 'LeaderID', as: 'Leader' });
PlanetaryLeader.belongsTo(Planet, { foreignKey: 'PlanetID', as: 'Planet' });

export default PlanetaryLeader;
