import { NextApiRequest, NextApiResponse } from 'next';
import Users from '../../../module/model/user';

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

    const user = await Users.findOne({where:{id:id}})
    
    if(user){
        res
            .status(201)
            .json({ success: true, message: 'Room geted succesfully', user });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', user:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
