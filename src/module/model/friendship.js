const { Sequelize, DataTypes, UUID, UUIDV4, json } = require('sequelize');
import sequelize from '../sequelize'
import User from './user';

const Friendship = sequelize.define('friendships', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    user1Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    user2Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
}, {
    timestamps: false,
    tableName: 'friendships',
    name: 'friendships',
    modelNamel: 'friendships'
});

(async () => {
    await Friendship.sync({});

    console.log('La table "room" a été charger');
})();

export default Friendship