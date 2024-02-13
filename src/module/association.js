import Study from './model/study'
import Room from './model/room'
import User from './model/user'
import Friendship from './model/friendship'

Study.belongsTo(User, { as: 'user', foreignKey:`userId` })
Room.belongsTo(User, { as: 'user', foreignKey:`userId` })

User.hasMany(Study, { as: 'studies', foreignKey:`userId` });
User.hasMany(Room, { as: 'rooms', foreignKey: 'userId' });

User.belongsToMany(User, {
    as: 'user1Friends',
    through: Friendship,
    foreignKey: 'user1Id',
    otherKey: 'user2Id'
});

User.belongsToMany(User, {
    as: 'user2Friends',
    through: Friendship,
    foreignKey: 'user2Id',
    otherKey: 'user1Id'
});

Friendship.belongsTo(User, { as: 'user1', foreignKey: 'user1Id' });
Friendship.belongsTo(User, { as: 'user2', foreignKey: 'user2Id' });

export {User,Room,Study,Friendship}