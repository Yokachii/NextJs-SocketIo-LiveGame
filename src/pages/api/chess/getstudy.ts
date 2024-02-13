import { NextApiRequest, NextApiResponse } from 'next';
import {Room,User,Study} from '@/module/association'
import { hashPassword } from '../../../utils/hash';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {id} = req.body;


    const study = await Study.findOne({where:{id:id}})
    console.log(study?.dataValues,id)
    if(study){
        res
            .status(201)
            .json({ success: true, message: 'study geted succesfully', study });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', study:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
