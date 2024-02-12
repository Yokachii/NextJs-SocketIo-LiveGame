const { Sequelize, DataTypes, UUID, UUIDV1, json } = require('sequelize');
import sequelize from '../sequelize'
import User from './user';
import User_Study from './userstudy';

const Study = sequelize.define('studys', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    pgn:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    creater:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    private:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    name:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    basefen:{
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'studys',
    name: 'studys',
    modelNamel: 'studys'
});

(async () => {
    await Study.sync({});

    // Study.belongsTo(User, { through: User_Study });
    Study.belongsTo(User, {through: "User_Study"})

    console.log('La table "Study" a été charger');
})();

export default Study;