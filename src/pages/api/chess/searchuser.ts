import { NextApiRequest, NextApiResponse } from 'next';
import {Room,User,Study} from '@/module/association'
import sequelize from '@/module/sequelize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {name} = req.body;

    const user = await sequelize.query(`SELECT * FROM users WHERE firstname LIKE '${name}%';`)
    console.log(user)
    res
        .status(201)
        .json({ success: true, message: 'User geted succesfully', user });
    return;
    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}