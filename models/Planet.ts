import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface PlanetAttributes {
  PlanetID: number;
  Name: string;
  Description: string;
  Status: 'Active' | 'Terraforming' | 'Destroyed';
  Population: number;
  CreatedBy: number; // FK to User.UserID
  CreatedByGalacticLeader: boolean;
  CreatedDate: Date;
}

interface PlanetCreationAttributes extends Optional<PlanetAttributes, 'PlanetID' | 'CreatedDate' | 'CreatedByGalacticLeader'> {}

class Planet extends Model<PlanetAttributes, PlanetCreationAttributes> implements PlanetAttributes {
  public PlanetID!: number;
  public Name!: string;
  public Description!: string;
  public Status!: 'Active' | 'Terraforming' | 'Destroyed';
  public Population!: number;
  public CreatedBy!: number;
  public CreatedByGalacticLeader!: boolean;
  public CreatedDate!: Date;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly Creator?: User;
}

Planet.init(
  {
    PlanetID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Status: {
      type: DataTypes.ENUM('Active', 'Terraforming', 'Destroyed'),
      allowNull: false,
      defaultValue: 'Active',
    },
    Population: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // This refers to the table name
        key: 'UserID',
      },
    },
    CreatedByGalacticLeader: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'Planets',
    sequelize,
    timestamps: true,
  }
);

// Association
Planet.belongsTo(User, { foreignKey: 'CreatedBy', as: 'Creator' });

export default Planet;
