import { NextApiRequest, NextApiResponse } from 'next';
import Studys from '../../../module/model/study';
import sequelizeUser from '../../../module/model/user'
import { hashPassword } from '../../../utils/hash';
import Users from '../../../module/model/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {name,userId,isPrivate} = req.body;


    const user = await Users.findOne({where:{id:userId}})


    const study = await Studys.create({

        pgn:``,
        name:name,
        creater:userId,
        private:isPrivate,
        basefen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",

    }).then(x=>{

        console.log(x)
        // @ts-ignore
        // user.addUser_Study(x, {through: { isPrivate:isPrivate }})

        res
            .status(201)
            .json({ success: true, message: 'study geted succesfully', study:x });

    })






    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
