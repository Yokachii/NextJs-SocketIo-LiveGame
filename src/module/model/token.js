const { Sequelize, DataTypes, UUID, UUIDV1, json } = require('sequelize');
import sequelize from '../sequelize'

const User = sequelize.define('token', {
    userId: { type: DataTypes.STRING, required: true, ref: 'user' },
    token: { type: DataTypes.TEXT, required: true },
    createdAt: { type: DataTypes.DATE, default: Date.now, expires: 300 }, // Exprire in 5 mins
}, {
    timestamps: false,
    tableName: 'token',
    name: 'token',
    modelNamel: 'token'
});

(async () => {
    await User.sync({force:true});
    console.log('La table "user" a été charger');
})();

export default User;