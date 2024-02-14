import { NextApiRequest, NextApiResponse } from 'next';
import {Room,User,Study} from '@/module/association'
import sequelize from '@/module/sequelize';
import { Op } from 'sequelize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {userId,name} = req.body;

    const userByPk = await User.findByPk(userId)


    const friendsA = await User.findOne({
        where: { id: userId },
        include: [
            {
                model: User,
                as: 'user1Friends',
                attributes: ['id', 'firstname', 'lastname', 'email'],
                where: {
                    firstname:{
                        [Op.like]: `${name}%`,
                    }
                },
            },
        ],
    });


    if(friendsA){

        const friendIdsA = new Set([
            ...friendsA.user1Friends.map((friend) => friend.id),
        ]);
    
        const nonFriendsA = await User.findAll({
            where: {
                id: {
                    [Op.not]: [userId, ...friendIdsA], // Exclude userA and userA's friends
                },
            },
        });
    
    
        res
            .status(201)
            .json({ success: true, message: 'Succes find', user:nonFriendsA });
            
    }else{

        res
            .status(201)
            .json({ success: true, message: 'Search succesfull and find nothing', user:[] });

    }

    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}