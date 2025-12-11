import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Citizen from './Citizen';
import PlanetProposal from './PlanetProposal';

interface VoteAttributes {
  VoteID: number;
  CitizenID: number; // FK to Citizen.CitizenID
  ProposalID: number; // FK to PlanetProposal.ProposalID
  VoteChoice: 'For' | 'Against';
  VoteDate: Date;
}

interface VoteCreationAttributes extends Optional<VoteAttributes, 'VoteID' | 'VoteDate'> {}

class Vote extends Model<VoteAttributes, VoteCreationAttributes> implements VoteAttributes {
  public VoteID!: number;
  public CitizenID!: number;
  public ProposalID!: number;
  public VoteChoice!: 'For' | 'Against';
  public VoteDate!: Date;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly Voter?: Citizen;
  public readonly Proposal?: PlanetProposal;
}

Vote.init(
  {
    VoteID: {
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
    ProposalID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PlanetProposals', // Refers to the table name
        key: 'ProposalID',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    VoteChoice: {
      type: DataTypes.ENUM('For', 'Against'),
      allowNull: false,
    },
    VoteDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'Votes',
    sequelize,
    timestamps: true,
  }
);

// Associations
Vote.belongsTo(Citizen, { foreignKey: 'CitizenID', as: 'Voter' });
Vote.belongsTo(PlanetProposal, { foreignKey: 'ProposalID', as: 'Proposal' });

export default Vote;
