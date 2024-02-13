import Study from './model/study'
import Room from './model/room'
import User from './model/user'

Study.belongsTo(User, { as: 'user', foreignKey:`userId` })
Room.belongsTo(User, { as: 'user', foreignKey:`userId` })

User.hasMany(Study, { as: 'studies', foreignKey:`userId` });
User.hasMany(Room, { as: 'rooms', foreignKey: 'userId' });

export {User,Room,Study}