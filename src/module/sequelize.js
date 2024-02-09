import { Sequelize } from 'sequelize';
const db = {};

const sequelize = new Sequelize('yokachi04_tempp', 'yokachi04', 'Elliot2862', {
    dialect: 'mysql',
    host: 'mysql-yokachi04.alwaysdata.net',
    dialectModule: require('mysql2'),
});

export default sequelize