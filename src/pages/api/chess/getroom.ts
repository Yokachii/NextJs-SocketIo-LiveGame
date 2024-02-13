import { NextApiRequest, NextApiResponse } from 'next';
import {Room,User,Study} from '@/module/association'
import { hashPassword } from '../../../utils/hash';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {token} = req.body;


    const room = await Room.findOne({where:{token:token}})
    console.log(room?.dataValues,token)
    if(room){
        res
            .status(201)
            .json({ success: true, message: 'Room geted succesfully', room });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', room:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
