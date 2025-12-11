import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; // Assuming you have a database connection setup here

interface UserAttributes {
  UserID: number;
  Username: string;
  Password?: string; // Password can be optional for some operations, but required for creation
  FullName: string;
  Role: 'Citizen' | 'Planetary Leader' | 'Galactic Leader';
  IsGalacticLeader: boolean;
  DateJoined: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'UserID' | 'DateJoined' | 'IsGalacticLeader'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public UserID!: number;
  public Username!: string;
  public Password!: string;
  public FullName!: string;
  public Role!: 'Citizen' | 'Planetary Leader' | 'Galactic Leader';
  public IsGalacticLeader!: boolean;
  public DateJoined!: Date;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
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
  },
  {
    tableName: 'Users',
    sequelize: sequelize, // This assumes you have an initialized Sequelize instance
    timestamps: true,
  }
);

export default User;
