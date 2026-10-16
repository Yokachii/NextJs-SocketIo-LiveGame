import { Sequelize } from 'sequelize';
const db = {};

// const sequelize = new Sequelize(process.env.DB_URL, process.env.DB_NAME, process.env.DB_PSWRD, {
//     dialect: 'mysql',
//     host: 'mysql-yokachi04.alwaysdata.net',
//     dialectModule: require('mysql2'),
// });

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../../database.sqlite',
  logging: false // Optional: set to true if you want to see SQL queries in the console
});

export default sequelize