// /** use this function on the frontend page to connect with the socket server inside useEffect react hook.
 
//     import  io  from 'socket.io-client'
//      let socket

//     const socketInitializer=async ()=>{
//         await fetch('/api/socket')
//         socket=io()
//       }
//  */



// import { Server } from 'socket.io'


// function handler(req, res) {
//  if(res.socket.server.io){
//    console.log('Socket is already running....')
//   }else{
//      console.log('Socket is initializing....')
//      const io=new Server(res.socket.server,{path:"/api/socket"})
//      res.socket.server.io=io

//      io.on('connection',(socket)=>{

//       socket.on('test',(data)=>{
//         socket.broadcast.emit("test")
//         console.log('tested')
//       })

//        socket.on('disconnect',()=>{
//           console.log(`client ${socket.id} disconnected.....`)
//        })

//      })
//     }
  
//     res
//     .status(201)
//     .json({ success: true, message: 'succesfully'});
// }



// export default handler

// import { Server } from 'Socket.IO'

// const SocketHandler = (req, res) => {
//   if (res.socket.server.io) {
//     console.log('Socket is already running')
//   } else {
//     console.log('Socket is initializing')
//     const io = new Server(res.socket.server)

//     io.on('connection', socket => {
//       socket.on('input-change', msg => {
//         socket.broadcast.emit('update-input', msg)
//       })
//     })

//     // io.on('connection',(socket)=>{

//     //   socket.on('test',(data)=>{
//     //     socket.broadcast.emit("test")
//     //     console.log('tested')
//     //   })

//     //    socket.on('disconnect',()=>{
//     //       console.log(`client ${socket.id} disconnected.....`)
//     //    })

//     //  })
     
//      res.socket.server.io = io
//      res
//        .status(201)
//        .json({ success: true, message: 'succesfully'});
//     }
    
//   }


// export default SocketHandler

import { Server } from 'Socket.IO'
import Rooms from '@/module/model/room'
import { where } from 'sequelize'
import Users from '@/module/model/user'

const SocketHandler = async (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', async (socket) => {
      let roomIdLet


      socket.emit('get-room')


      socket.on('set-room', roomid => {
        roomIdLet=roomid
        console.log(roomid)
        socket.join(roomid)
        socket.emit('room-joined',{message:"Room joined succesfully",id:socket.id})
      })


      socket.on('create-room', data=>{
        const {roomId, userId} = data

        Rooms.create({
          id:roomId,
          board:`rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`,
          player:JSON.stringify({player1:{color:"w",id:userId}}),
          status:`w`,
          lastmove:JSON.stringify({after:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",before:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}),
          chat:JSON.stringify([]),
        })
      })


      socket.on('move', async (data) => {
        let room = await Rooms.findOne({where:{id:data.roomid}})
        room.lastmove = JSON.stringify(data.move)
        room.board = data.fen
        room.save();
        socket.to(data.roomid).emit('move-played',data)
      })



      socket.on('send-message', async (data) => {
        const room = await Rooms.findOne({where:{id:data.roomid}})
        let tmp = JSON.parse(room.dataValues.chat)
        tmp.push({message:data.message,name:data.name,id:data.id})
        room.chat = JSON.stringify(tmp)
        room.save()
        socket.to(data.roomid).emit('new-message',data)
      })



      socket.on('join-game-try', async (data) => {
        let { roomid,userid } = data
        let room = await Rooms.findOne({where:{id:roomid}})
        let user = await Users.findOne({where:{id:userid}})
        if(room&&user){

          // TODO : attendre que le player2 envoie une réponse puis start le 1v1

          let players = JSON.parse(room.dataValues.player)
          let player1 = players.player1
          let player1user = await Users.findOne({where:{id:player1.id}})
          if(player1.id===user.dataValues.id){

            socket.emit('set-playing-as',{lastmove:room.dataValues.lastmove,chat:JSON.parse(room.dataValues.chat),color:player1.color,isPlaying:true,isOponentsFinded:false,players:{player1:{name:player1user.dataValues.firstname,id:player1.id},player2:{}}})
            
          }else{
            
            socket.emit('set-playing-as',{lastmove:room.dataValues.lastmove,chat:JSON.parse(room.dataValues.chat),color:player1.color==="w"?"b":"w",isPlaying:true,isOponentsFinded:true,players:{player1:{name:player1user.dataValues.firstname,id:player1.id},player2:{name:user.dataValues.firstname,id:user.dataValues.id}}})

          }

        }else{
          socket.emit('set-playing-as',{lastmove:room.dataValues.lastmove,chat:JSON.parse(room.dataValues.chat),color:"w",isPlaying:false,players:{player1:{name:player1user.dataValues.firstname,id:player1.id},player2:{}}})
        }
        // socket.to(roomid).emit
      })

      socket.on('disconnect', async ()=>{
        if(roomIdLet){
          let usersInRoom = await io.in(roomIdLet).fetchSockets();
          if(usersInRoom.length==0){
            setTimeout(async() => {
              

              let usersInRoom2 = await io.in(roomIdLet).fetchSockets();
              if(usersInRoom2.length==0){
                const room = await Rooms.findOne({where:{id:roomIdLet}})
                if(room&&room.dataValues){

                  // TODO : arrèter la partie si elle est en cour est donner des résultat

                  room.destroy();
                }
              }



            }, 30000);
          }
        }
        console.log(`client ${socket.id} disconnected..... ?${roomIdLet}`)
      })



    })
  }
  res.end()
}

export default SocketHandler

























