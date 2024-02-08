import { Sequelize } from '@sequelize/core';

const sequelize = new Sequelize('yokachi04_tempp', 'yokachi04', 'Elliot2862', {
    dialect: 'mysql',
    host: 'mysql-yokachi04.alwaysdata.net',
    dialectModule: require('mysql2'),
});

await sequelize.authenticate().then(x=>{
    console.log('base de donnée core connecter')
})

export default sequelize