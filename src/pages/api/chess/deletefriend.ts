import { NextApiRequest, NextApiResponse } from 'next';
import {Room,User,Study, Friendship} from '@/module/association'
import { Op } from 'sequelize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    
    try {

        const {user1Id,user2Id} = req.body;

        if(!user1Id || !user2Id){
        res
            .status(422)
            .json({ success: false, message: 'Please provide every field', user:null });
        return
        }

        const friendShip1 = await Friendship.findOne({where:{user1Id:user2Id,user2Id:user1Id}})
        const friendShip2 = await Friendship.findOne({where:{user1Id:user1Id,user2Id:user2Id},})
        
        if(friendShip1&&friendShip2){
            friendShip2.destroy()
            friendShip1.destroy().then(x=>{
                res
                    .status(201)
                    .json({ success: true, message: 'Deleted succesfuly' });
            })
        }else{
            res
                .status(422)
                .json({ success: false, message: `Can't find friendship` });
        }
        
    } catch (error) {

        res.status(402).json({success:false,error})
        
    }

    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
