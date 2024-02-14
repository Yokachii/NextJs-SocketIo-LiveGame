import { NextApiRequest, NextApiResponse } from 'next';
import {Room,User,Study,Friendship} from '@/module/association'
import { hashPassword } from '../../../utils/hash';
import { Sequelize, Op } from 'sequelize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {user1Id,user2Id} = req.body;

    try {
        // Check if the friendship already exists
        const existingFriendship = await Friendship.findOne({
            where: {
                [Op.or]: [
                    { user1Id, user2Id },
                    { user1Id: user2Id, user2Id: user1Id },
                ],
            },
        });
    
        if (!existingFriendship) {
            // Friendship doesn't exist, create it
            // const newFriendship = await Friendship.create({
            //     user1Id,
            //     user2Id,
            //     // ... other fields if needed
            // });
            await Friendship.create({ user1Id: user1Id, user2Id: user2Id });
            await Friendship.create({ user1Id: user2Id, user2Id: user1Id });

            res
                .status(201)
                .json({ success: true, message: 'User geted succesfully with room and study'});
        } else {
            res
                .status(422)
                .json({ success: false, message: 'An error occured', user:null, error:`This friendship allready exist` });
        }
    } catch (error) {
        res
            .status(422)
            .json({ success: false, message: 'An error occured', user:null, error });
    }
    

    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
