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

    // const user = await User.findAll({
    //     where: {
    //         id: {
    //             [Op.not]: userId, // Exclude the user itself from the result
    //         },
    //     },
    //     include: [
    //         {
    //             model: User,
    //             as: 'user1Friends',
    //             attributes: ['id', 'firstname', 'lastname', 'email'],
    //             where: {
    //                 firstname: {
    //                     [Op.like]: `${name}%`, // Case-insensitive LIKE query
    //                 },
    //                 id: { [Op.notIn]: [userId] }, // Exclude friends of the user
    //             },
    //             required: false, // Use 'required: false' for LEFT JOIN
    //         },
    //         {
    //             model: User,
    //             as: 'user2Friends',
    //             attributes: ['id', 'firstname', 'lastname', 'email'],
    //             where: {
    //                 firstname: {
    //                     [Op.like]: `${name}%`, // Case-insensitive LIKE query
    //                 },
    //                 id: { [Op.notIn]: [userId] }, // Exclude friends of the user
    //             },
    //             required: false, // Use 'required: false' for LEFT JOIN
    //         },
    //     ],
    // });

    // const user = await User.findAll({
    //     where: {
    //         id: {
    //             [Op.not]: userId, // Exclude the user itself from the result
    //         },
    //         firstname: {
    //             [Op.like]: `${name}%`, // Case-insensitive LIKE query for user names
    //         },
    //     },
    //     include: [
    //         {
    //             model: User,
    //             as: 'user1Friends',
    //             attributes: ['id', 'firstname', 'lastname', 'email'],
    //             where: {
    //                 id: { [Op.notIn]: [userId] }, // Exclude friends of the user
    //             },
    //             required: false, // Use 'required: false' for LEFT JOIN
    //         },
    //         // {
    //         //     model: User,
    //         //     as: 'user2Friends',
    //         //     attributes: ['id', 'firstname', 'lastname', 'email'],
    //         //     where: {
    //         //         id: { [Op.notIn]: [userId] }, // Exclude friends of the user
    //         //     },
    //         //     required: false, // Use 'required: false' for LEFT JOIN
    //         // },
    //     ],
    // })

    const userByPk = await User.findByPk(userId)

    // @ts-ignore
    // const user = await userByPk.getUser1Friends()

    const friendsA = await User.findOne({
        where: { id: userId },
        include: [
            {
                model: User,
                as: 'user1Friends',
                attributes: ['id', 'firstname', 'lastname', 'email'],
                where: {
                    firstname:{
                        [Op.like]: `${name}%`,
                    }
                },
            },
            // {
            //     model: User,
            //     as: 'user2Friends',
            //     attributes: ['id', 'firstname', 'lastname', 'email'],
            //     where: {
            //         firstname:{
            //             [Op.like]: `${name}%`,
            //         }
            //     },
            // },
        ],
    });

    const friendIdsA = new Set([
        ...friendsA.user1Friends.map((friend) => friend.id),
    ]);

    const nonFriendsA = await User.findAll({
        where: {
            id: {
                [Op.not]: [userId, ...friendIdsA], // Exclude userA and userA's friends
            },
        },
    });

    console.log('|||||||||||||||||')
    console.log(nonFriendsA)
    console.log('|||||||||||||||||')

    res
        .status(201)
        .json({ success: true, message: 'Room geted succesfully', user:nonFriendsA });
    
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
}