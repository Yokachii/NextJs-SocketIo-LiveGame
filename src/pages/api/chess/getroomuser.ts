import { NextApiRequest, NextApiResponse } from 'next';
import {Room,User,Study} from '@/module/association'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {id} = req.body;

    if(!id){
      res
        .status(422)
        .json({ success: false, message: 'An error occured', user:null });
      return
    }

    const room = await Room.findOne({
        where: { token: id },
        include: [
            {
                model: User, // Assuming User is the model for users
                as: 'user', // Use the alias defined in the Room model
                attributes: ['id', 'firstname', 'lastname', 'email'], // Specify the user attributes you want to include
            },
        ],
    });

    // @ts-ignore
    
    if(room){
        // const room = await room.getRooms();
        res
            .status(201)
            .json({ success: true, message: 'room geted succesfully', room });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', room:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
