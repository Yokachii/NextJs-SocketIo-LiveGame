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
            },
            {
                model: Study, // Assuming Study is the model for studies
                as: 'studies', // Use the alias defined in the User model
                attributes: ['id', 'pgn', 'private', 'name', 'basefen'], // Specify the study attributes you want to include
            },
            {
                model: User,
                as: 'user1Friends',
                attributes: ['id', 'firstname', 'lastname', 'email'],
            },
        ]
    });

    // @ts-ignore
    
    if(user){
        // const room = await user.getRooms();
        res
            .status(201)
            .json({ success: true, message: 'User geted succesfully with room and study', user });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', user:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
