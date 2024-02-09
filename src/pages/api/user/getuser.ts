import { NextApiRequest, NextApiResponse } from 'next';
import Users from '../../../module/model/user';
import sequelizeUser from '../../../module/model/user'
import { hashPassword } from '../../../utils/hash';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {id} = req.body;
    console.log(id,`&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&`)


    const user = await Users.findOne({where:{id:id}})
    console.log(user?.dataValues,id)
    if(user){
        res
            .status(201)
            .json({ success: true, message: 'User signed up successfuly', user });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', user:null });
    }




    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
