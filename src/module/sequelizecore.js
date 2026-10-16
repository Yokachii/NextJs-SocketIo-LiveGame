import { Sequelize } from '@sequelize/core';

// const sequelize = new Sequelize('yokachi04_tempp', 'yokachi04', 'Elliot2862', {
//     dialect: 'mysql',
//     host: 'mysql-yokachi04.alwaysdata.net',
//     dialectModule: require('mysql2'),
// });

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../../database.sqlite',
  logging: false // Optional: set to true if you want to see SQL queries in the console
});

await sequelize.authenticate().then(x=>{
    console.log('base de donnée core connecter')
})

export default sequelize