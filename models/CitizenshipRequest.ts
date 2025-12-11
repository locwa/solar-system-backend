import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Citizen from './Citizen';
import Planet from './Planet';
import User from './User';

interface CitizenshipRequestAttributes {
  RequestID: number;
  CitizenID: number; // FK to Citizen.CitizenID
  FromPlanetID: number; // FK to Planet.PlanetID
  ToPlanetID: number; // FK to Planet.PlanetID
  Status: 'Pending' | 'Approved' | 'Rejected';
  RequestDate: Date;
  DecisionBy?: number | null; // FK to User.UserID
  DecisionDate?: Date | null;
}

interface CitizenshipRequestCreationAttributes extends Optional<CitizenshipRequestAttributes, 'RequestID' | 'Status' | 'RequestDate' | 'DecisionBy' | 'DecisionDate'> {}

class CitizenshipRequest extends Model<CitizenshipRequestAttributes, CitizenshipRequestCreationAttributes> implements CitizenshipRequestAttributes {
  public RequestID!: number;
  public CitizenID!: number;
  public FromPlanetID!: number;
  public ToPlanetID!: number;
  public Status!: 'Pending' | 'Approved' | 'Rejected';
  public RequestDate!: Date;
  public DecisionBy?: number | null;
  public DecisionDate?: Date | null;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly Requester?: Citizen;
  public readonly FromPlanet?: Planet;
  public readonly ToPlanet?: Planet;
  public readonly Decider?: User;
}

CitizenshipRequest.init(
  {
    RequestID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CitizenID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Citizens', // Refers to the table name
        key: 'CitizenID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    FromPlanetID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Planets', // Refers to the table name
        key: 'PlanetID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    ToPlanetID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Planets', // Refers to the table name
        key: 'PlanetID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    Status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    RequestDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    DecisionBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users', // Refers to the table name
        key: 'UserID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    DecisionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'CitizenshipRequests',
    sequelize,
    timestamps: true,
  }
);

// Associations
CitizenshipRequest.belongsTo(Citizen, { foreignKey: 'CitizenID', as: 'Requester' });
CitizenshipRequest.belongsTo(Planet, { foreignKey: 'FromPlanetID', as: 'FromPlanet' });
CitizenshipRequest.belongsTo(Planet, { foreignKey: 'ToPlanetID', as: 'ToPlanet' });
CitizenshipRequest.belongsTo(User, { foreignKey: 'DecisionBy', as: 'Decider' });

export default CitizenshipRequest;
