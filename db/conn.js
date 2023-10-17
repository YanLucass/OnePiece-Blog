import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

try {
    sequelize.authenticate();
    console.log('Conectado ao MySql!');
}catch(err) {
    console.log(`Não foi possível conectar ${err}`);
}

module.exports = sequelize