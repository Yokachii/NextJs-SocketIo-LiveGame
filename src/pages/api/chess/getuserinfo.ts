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

    const user = await User.findOne({
        where: { id: id },
        include: [
            {
                model: Room,
                as: 'rooms', // Use the alias defined in the User model
                attributes: ['token', 'board', 'player', 'status', 'lastmove', 'chat', 'pgn'] // Specify the attributes you want to include
            }
        ]
    });

    // @ts-ignore
    
    if(user){
        // const room = await user.getRooms();
        res
            .status(201)
            .json({ success: true, message: 'User geted succesfully', user });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', user:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
