const { Sequelize, DataTypes, UUID, UUIDV1, json } = require('sequelize');
import sequelize from '../sequelize'
import User from './user'
import Room from './room'





const User_Study = sequelize.define('User_Study', {
    isPrivate: DataTypes.BOOLEAN
}, {
    timestamps: false,
    tableName: 'User_study',
    name: 'User_study',
    modelName: 'User_study'
});


// User.belongsToMany(Room, { through: User_Study });
// Room.belongsToMany(User, { through: User_Study });


(async () => {
    await User_Study.sync({});
    console.log('La table "user" a été charger');
})();

export default User_Study