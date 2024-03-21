const { Sequelize, DataTypes, UUID, UUIDV1, json } = require('sequelize');
import sequelize from '../sequelize'
import User from './user'
import Room from './room'





const User_Room = sequelize.define('User_Room', {
    selfGranted: DataTypes.BOOLEAN
}, {
    timestamps: false,
    tableName: 'User_Room',
    name: 'User_Room',
    modelName: 'User_Room'
});



(async () => {
    await User_Room.sync({});
    console.log('La table "user" a été charger');
})();


export default User_Room