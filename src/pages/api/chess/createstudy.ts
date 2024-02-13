import { NextApiRequest, NextApiResponse } from 'next';
import {Room,User,Study} from '@/module/association'
import { hashPassword } from '../../../utils/hash';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {name,userId,isPrivate} = req.body;


    const user = await User.findOne({where:{id:userId}})


    const study = await Study.create({

        pgn:``,
        name:name,
        // creater:userId,
        private:isPrivate,
        basefen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",

    }).then(x=>{

        console.log(x)
        // @ts-ignore
        // user.addUser_Study(x, {through: { isPrivate:isPrivate }})
        user.addStudy(x)

        res
            .status(201)
            .json({ success: true, message: 'study geted succesfully', study:x });

    })






    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
