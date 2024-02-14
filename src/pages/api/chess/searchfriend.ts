import { NextApiRequest, NextApiResponse } from 'next';
import {Room,User,Study} from '@/module/association'
import sequelize from '@/module/sequelize';
import { Op } from 'sequelize';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {userId,name} = req.body;

    // const user = await User.findOne({
    //     where: { id: userId },
    //     include: [
    //         // {
    //         //     model: User,
    //         //     as: 'user1Friends',
    //         //     attributes: ['id', 'firstname', 'lastname', 'email'],
    //         //     where: {
    //         //         firstname: {
    //         //             [Op.like]: `${name}%`, // Case-insensitive LIKE query
    //         //         },
    //         //     },
    //         // },
    //         // {
    //         //     model: User,
    //         //     as: 'user2Friends',
    //         //     attributes: ['id', 'firstname', 'lastname', 'email'],
    //         //     where: {
    //         //         firstname: {
    //         //             [Op.like]: `${name}%`, // Case-insensitive LIKE query
    //         //         },
    //         //     },
    //         // },
    //         {
    //             model: User,
    //             as: 'user1Friends',
    //             attributes: ['id', 'firstname', 'lastname', 'email'],
    //             where:{
    //               firstname: {
    //                   [Op.like]: `${name}%`, // Case-insensitive LIKE query
    //               },
    //             }
    //         },
    //     ],
    // });

    if(!userId){
        res
            .status(422)
            .json({ success: false, message: 'No userId', user:null });
        return
    }

    try {

        const user = await User.findOne({
            where: { id: userId },
            include: [
                {
                    model: User,
                    as: 'user1Friends',
                    attributes: ['id', 'firstname', 'lastname', 'email'],
                    where: {
                        firstname:{
                            [Op.like]:`${name}%`
                        }
                    },
                },
            ],
        });
        
    
        console.log(user)
    
        if(user){
            res
                .status(201)
                .json({ success: true, message: 'Room geted succesfully', user });
        }else{
            res
                .status(422)
                .json({ success: false, message: 'User not find', user:null });
        }
        
    } catch (error) {

        res
                .status(422)
                .json({ success: false, message: 'An error occured', user:null, error });
        
    }
    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}