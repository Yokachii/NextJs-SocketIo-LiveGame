import { NextApiRequest, NextApiResponse } from 'next';
import Users from '../../../module/model/user';
import sequelizeUser from '../../../module/model/user'
import { hashPassword } from '../../../utils/hash';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {id,link,desc} = req.body;
    // let strId = id.id

    const user = await Users.findOne({where:{id:id}})
    if(user){

      let oldLink = JSON.parse(user.dataValues.links)
      oldLink.push({desc,link})
      const strNewLink = JSON.stringify(oldLink)
      user.links=strNewLink
      user.save()

      // console.log(JSON.stringify(oldLink.push({desc,link})))
      // console.log(oldLink,{desc,link})

      // let test = []
      // test.push({desc,link})
      // console.log(test)

      // user.save()

        res
            .status(201)
            .json({ success: true, message: 'Link added succesfully', user });
    }else{
        res
            .status(422)
            .json({ success: false, message: 'An error occured', user:null });
    }
    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
