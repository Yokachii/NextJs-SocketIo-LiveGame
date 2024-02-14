import { NextApiRequest, NextApiResponse } from 'next';
import { Room, User, Study } from '@/module/association';
import sequelize from '@/module/sequelize';
import { Op } from 'sequelize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { userId, name } = req.body;

    console.log('id and name bellow')
    console.log(userId,name)

    if(!userId||!name){
        return res.status(400).json({success:false,message:'please provide userId and name'})
    }

    try {

        const friendsA = await User.findOne({
            where: { id: userId },
            include: [
              {
                model: User,
                as: 'user1Friends',
                attributes: ['id', 'firstname', 'lastname', 'email'],
                where: {
                  firstname: {
                    [Op.like]: `${name}%`,
                  },
                },
              },
            ],
          });
      
          if (friendsA && friendsA.user1Friends) {
            const friendIdsA = friendsA.user1Friends.map((friend) => friend.id);
      
            // If user has 0 friends, include all users except the user itself
            const nonFriendsA = await User.findAll({
              where: {
                id: {
                  [Op.not]: [userId, ...friendIdsA], // Exclude userA and userA's friends
                },
              },
            });
      
            console.log('&&&&&&&&&&&&&&&&&')
            console.log(friendIdsA)
            console.log(nonFriendsA)
            console.log('&&&&&&&&&&&&&&&&&')
      
            res.status(201).json({
              success: true,
              message: 'Success find',
              user: nonFriendsA,
            });
          } else {
            res.status(201).json({
              success: true,
              message: 'Search successful and found nothing',
              user: [],
            });
          }
        
    } catch (error) {
        res.status(400).json({ success: false, message: 'error',error });
    }

    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}