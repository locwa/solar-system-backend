import { Sequelize } from 'sequelize';

const databaseUrl = process.env.DATABASE_URL;

let sequelize: Sequelize;

if (databaseUrl) {
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: 'postgres',
    logging: false,
  });
  console.warn('DATABASE_URL not set - database operations will fail at runtime');
}

export default sequelize;
