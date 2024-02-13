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

    const user = await User.findByPk(id)

    // @ts-ignore
    const studies = await user.getRooms();
    
    if(studies){
        res
            .status(201)
            .json({ success: true, message: 'Room geted succesfully', studies });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', studies:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
