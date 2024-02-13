const { Sequelize, DataTypes, UUID, UUIDV4, json } = require('sequelize');
import sequelize from '../sequelize'

const Friendship = sequelize.define('friendships', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    // ... other fields if needed
}, {
    timestamps: false,
    tableName: 'friendships',
    name: 'friendships',
    modelNamel: 'friendships'
});

(async () => {
    await Friendship.sync({force:true});

    console.log('La table "room" a été charger');
})();

export default Friendship