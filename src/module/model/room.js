const { Sequelize, DataTypes, UUID, UUIDV1, json } = require('sequelize');
import sequelize from '../sequelize'
import User from './user';
import User_Room from './useroom';

const Room = sequelize.define('rooms', {
    token: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    id:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    board:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    player:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    status:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    lastmove:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    chat:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    pgn:{
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'rooms',
    name: 'rooms',
    modelNamel: 'rooms'
});

(async () => {
    await Room.sync({});

    // Room.belongsTo(User, { through: User_Room });
    // Room.belongsTo(User_Room, {through: User_Room})

    Room.belongsTo(User, { as: 'user', foreignKey:`id` })

    console.log('La table "room" a été charger');
})();

export default Room;