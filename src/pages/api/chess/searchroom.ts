import { NextApiRequest, NextApiResponse } from 'next';
import Rooms from '../../../module/model/room';
import sequelizeUser from '../../../module/model/user'
import { hashPassword } from '../../../utils/hash';
import sequelize from '@/module/sequelize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {id} = req.body;


    // const room = await Rooms.findAll({where:{id:`${id}%`}})
    const room = await sequelize.query(`SELECT * FROM rooms WHERE id LIKE '${id}%';`)
    res
        .status(201)
        .json({ success: true, message: 'Room geted succesfully', room });
    return;
    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}
