import { Sequelize } from 'sequelize';
const db = {};

const sequelize = new Sequelize(process.env.DB_URL, process.env.DB_NAME, process.env.DB_PSWRD, {
    dialect: 'mysql',
    host: 'mysql-yokachi04.alwaysdata.net',
    dialectModule: require('mysql2'),
});

export default sequelize