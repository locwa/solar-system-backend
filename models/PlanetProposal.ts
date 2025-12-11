import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Planet from './Planet';
import User from './User';

interface PlanetProposalAttributes {
  ProposalID: number;
  PlanetID: number; // FK to Planet.PlanetID
  ProposedBy: number; // FK to User.UserID
  ProposalType: 'Terraform' | 'Rename' | 'Resource Change' | 'Destruction';
  Details: string;
  Status: 'Pending' | 'Approved' | 'Rejected';
  DateProposed: Date;
  DecisionBy?: number | null; // FK to User.UserID
  DecisionDate?: Date | null;
}

interface PlanetProposalCreationAttributes extends Optional<PlanetProposalAttributes, 'ProposalID' | 'DateProposed' | 'Status' | 'DecisionBy' | 'DecisionDate'> {}

class PlanetProposal extends Model<PlanetProposalAttributes, PlanetProposalCreationAttributes> implements PlanetProposalAttributes {
  public ProposalID!: number;
  public PlanetID!: number;
  public ProposedBy!: number;
  public ProposalType!: 'Terraform' | 'Rename' | 'Resource Change' | 'Destruction';
  public Details!: string;
  public Status!: 'Pending' | 'Approved' | 'Rejected';
  public DateProposed!: Date;
  public DecisionBy?: number | null;
  public DecisionDate?: Date | null;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly Planet?: Planet;
  public readonly Proposer?: User;
  public readonly Decider?: User;
}

PlanetProposal.init(
  {
    ProposalID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    ProposedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Refers to the table name
        key: 'UserID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    ProposalType: {
      type: DataTypes.ENUM('Terraform', 'Rename', 'Resource Change', 'Destruction'),
      allowNull: false,
    },
    Details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    DateProposed: {
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
    tableName: 'PlanetProposals',
    sequelize,
    timestamps: true,
  }
);

// Associations
PlanetProposal.belongsTo(Planet, { foreignKey: 'PlanetID', as: 'Planet' });
PlanetProposal.belongsTo(User, { foreignKey: 'ProposedBy', as: 'Proposer' });
PlanetProposal.belongsTo(User, { foreignKey: 'DecisionBy', as: 'Decider' });

export default PlanetProposal;
