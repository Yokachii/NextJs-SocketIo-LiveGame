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
import { parse } from '@mliebelt/pgn-parser'
import {Room,User,Study} from '@/module/association'

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
        socket.join(roomid)
        socket.emit('room-joined',{message:"Room joined succesfully",id:socket.id})
      })


      socket.on('create-room', async (data) =>{
        const {roomId, userId} = data

        const user = await User.findOne({where:{id:userId}})

        if(user){

          Room.create({
            id:roomId,
            board:`rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`,
            player:JSON.stringify({player1:{color:"w",id:userId,name:user.dataValues.firstname},player2:{color:"b",id:false}}),
            status:`w`,
            lastmove:JSON.stringify({after:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",before:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}),
            chat:JSON.stringify([]),
            pgn:``,
            userId:userId,
          }).then(x=>{
  
            socket.emit(`room-created`,{roomId,roomToken:x.token})
  
          })
  
          socket.join(`${roomId}/P1`)

        }

      })

      socket.on(`room-first-connect`, async (data) =>{

        // socket.join(`${data.roomId}/P1`)

      })


      socket.on('move', async (data) => {
        let room = await Room.findOne({where:{token:data.roomid}})

        
        room.lastmove = JSON.stringify(data.move)
        room.board = data.fen
        room.pgn = data.pgn
        room.save();
        socket.to(data.roomid).emit('move-played',data)


        let {isOver} = data
        if(isOver){
          let players = JSON.parse(room.dataValues.player)
          let p1 = players.player1
          let p2 = players.player2
          let winner = data.winner
          let result
          let termination
          if(winner==="w"){
            result = `1-0`
            termination=`${p1.name} wined against ${p2.name}`
          }else if(winner==="b"){
            result = `0-1`
            termination=`${p2.name} wined against ${p1.name}`
          }else{
            result = `0-0`
            termination=`${p1.name} Drawed against ${p2.name}`
          }
          let strAdd = `[Result "${result}"]\n[Termination "${termination}"]\n`
          let newPgn = strAdd+data.pgn
          room.pgn=newPgn
          room.status="end"
          room.save();
          socket.to(data.roomid).emit('game-end',data)
          // let parsed = await parse(testNew, {startRule: "game"})


        }


      })



      socket.on('send-message', async (data) => {
        const room = await Room.findOne({where:{token:data.roomid}})
        let tmp = JSON.parse(room.dataValues.chat)
        tmp.push({message:data.message,name:data.name,id:data.id})
        room.chat = JSON.stringify(tmp)
        room.save()
        socket.to(data.roomid).emit('new-message',data)
      })

      socket.on('join-game-alr-start', async (data) => {

        console.log('joni alr start')

        let { roomid,userid } = data
        let room = await Room.findOne({where:{token:roomid}})
        

        if(room){
          let players = JSON.parse(room.dataValues.player)

          console.log('datavalue')
          
          console.log(userid)
          if(userid){
            let user = await User.findOne({where:{id:userid}})
            console.log(user)
            if(user){


              let player1 = players.player1
              let player2 = players.player2
  
              console.log('user id test')
              console.log(userid===player1.id)
              console.log(userid===player2.id)
  
              if(userid===player1.id){
  
                socket.emit('set-playing-as',{pgn:room.dataValues.pgn,isFirstTime:false,playerType:"first",lastmove:room.dataValues.lastmove,chat:JSON.parse(room.dataValues.chat),color:player1.color,isPlaying:true,isOponentsFinded:true,players:players})
                
                console.log('set as first by id')
  
              }else if(userid===player2.id){

                console.log('set as last by id')
  
                socket.emit('set-playing-as',{pgn:room.dataValues.pgn,isFirstTime:false,playerType:"last",lastmove:room.dataValues.lastmove,chat:JSON.parse(room.dataValues.chat),color:player2.color,isPlaying:true,isOponentsFinded:true,players:players})
  
              }else{

                console.log('set as spec (pas le bon)')
  
                socket.emit('set-player-spec',{isFirstTime:false,pgn:room.dataValues.pgn,chat:JSON.parse(room.dataValues.chat),players:players})
  
              }


            }
            

          }else{
            console.log('set as spec' + "pas d'id")

            socket.emit('set-player-spec',{pgn:room.dataValues.pgn,chat:JSON.parse(room.dataValues.chat),players:players})

          }

        }

      })

      socket.on('join-game-end', async (data) => {

        console.log('joni alr end')

        let { roomid,userid } = data
        let room = await Room.findOne({where:{token:roomid}})
        

        if(room){
          let players = JSON.parse(room.dataValues.player)
          socket.emit('set-spec-ended',{pgn:room.dataValues.pgn,chat:JSON.parse(room.dataValues.chat),players:players})
        }

      })

      socket.on('join-game-try', async (data) => {
        let { roomid,userid } = data
        let room = await Room.findOne({where:{token:roomid}})
        let players = JSON.parse(room.dataValues.player)
        let player1 = players.player1
        let player1user = await User.findOne({where:{id:player1.id}})
        if(userid){
          console.log('i get id')
          let user = await User.findOne({where:{id:userid}})

          if(user.dataValues.id){
            console.log('user exist')

            // TODO : attendre que le player2 envoie une réponse puis start le 1v1
            console.log(player1.id)
            console.log(user.dataValues.id)
            if(player1.id===user.dataValues.id){
              console.log('myself')
              socket.join(`${roomid}/P1`)
              socket.emit('set-playing-as',{pgn:room.dataValues.pgn,isFirstTime:true,playerType:"first",lastmove:room.dataValues.lastmove,chat:JSON.parse(room.dataValues.chat),color:player1.color,isPlaying:true,isOponentsFinded:false,players:{player1:{name:player1user.dataValues.firstname,id:player1.id},player2:{name:"Waiting",elo:"1299? (en attente)"}}})
              
            }else{
              console.log('p2')
              
              socket.emit('set-playing-as',{pgn:room.dataValues.pgn,isFirstTime:true,playerType:"last",lastmove:room.dataValues.lastmove,chat:JSON.parse(room.dataValues.chat),color:player1.color==="w"?"b":"w",isPlaying:true,isOponentsFinded:true,players:{player1:{name:player1user.dataValues.firstname,id:player1.id},player2:{name:user.dataValues.firstname,id:user.dataValues.id}}})
  
            }
  
          }else{

            console.log('get id but not user exist')

            // socket.emit('set-playing-as',{playerType:"",lastmove:room.dataValues.lastmove,chat:JSON.parse(room.dataValues.chat),color:"w",isPlaying:false,players:{player1:{name:player1user.dataValues.firstname,id:player1.id},player2:{name:"Waiting",elo:"1299? (en attente)"}}})
            socket.emit('set-player-spec',{pgn:room.dataValues.pgn,chat:JSON.parse(room.dataValues.chat),players:{player1:{name:player1user.dataValues.firstname,id:player1.id},player2:{name:"Waiting",elo:"1299? (en attente)",id:false}}})
          }
        }else{

          console.log('i dont get id')

          // socket.emit('set-playing-as',{playerType:"",lastmove:room.dataValues.lastmove,chat:JSON.parse(room.dataValues.chat),color:"w",isPlaying:false,players:{player1:{name:player1user.dataValues.firstname,id:player1.id},player2:{name:"Waiting",elo:"1299? (en attente)"}}})
          socket.emit('set-player-spec',{pgn:room.dataValues.pgn,chat:JSON.parse(room.dataValues.chat),players:{player1:{name:player1user.dataValues.firstname,id:player1.id},player2:{name:"Waiting",elo:"1299? (en attente)",id:false}}})

        }
        // console.log('|||||||||||||||||||||||')
        // console.log(user,userid)
        // console.log('|||||||||||||||||||||||')
        
        // socket.to(roomid).emit
      })

      socket.on('accept-play', async (data) => {

        console.log('&&&&&&&&&&& accepting play p2')
        console.log(data)

        if(data.playerType="last"){

          socket.join(`${data.roomId}/P2`)
          let room = await Room.findOne({where:{token:data.roomId}})
          let user2 = await User.findOne({where:{id:data.userId}})
          let player = JSON.parse(room.dataValues.player)
          let user1 = await User.findOne({where:{id:player.player1.id}})
          user2.addRoom(room)
          user1.addRoom(room)
          console.log(user1,user2)
          player.player2 = {color:player.player1.color=="w"?"b":"w",id:data.userId,name:user2.dataValues.firstname}
          room.player=JSON.stringify(player)
          room.status="p"

          let p1Color = player.player1.color
          let white = "cant load mhh"
          let black = "cant load mhh"
          let whiteElo = "1199"
          let blackElo = "1199"
          if(p1Color==="w"){
            white = user1.dataValues.firstname
            black = user2.dataValues.firstname
          }else{
            white = user2.dataValues.firstname
            black = user1.dataValues.firstname
          }
          let pgn = `[Event "Live Chess"]\n[Site "YokaChess.com"]\n[Date "2024.02.23"]\n[Round "-"]\n[White "${white}"]\n[Black "${black}"]\n[CurrentPosition "${room.board}"]\n[Timezone "UTC"]\n[ECO "B21"]\n[ECOUrl "https://google.com"]\n[UTCDate "2024.02.23"]\n[UTCTime "08:25:35"]\n[WhiteElo "${whiteElo}"]\n[BlackElo "${blackElo}"]\n[TimeControl "900+10"]\n[StartTime "08:25:35"]\n[EndDate "2024.02.23"]\n[EndTime "08:48:21"]\n[Link "http://localhost:3000/chess/room/${room.dataValues.token}"]`
          room.pgn=pgn
          
          room.save()
          console.log(`the room : ${room.dataValues.id} got saved as playing`)
          io.to(`${data.roomId}/P1`).emit(`game-starting-as-p1`,{player2:user2.dataValues})
          socket.emit(`game-start`,{pgn,oponentsName:user1.dataValues.firstname,oponentsElo:`1199?`})

        }else if(data.playerType="first"){

        }else{

        }

        

      })

      socket.on('disconnect', async ()=>{
        if(roomIdLet){
          let usersInRoom = await io.in(roomIdLet).fetchSockets();
          if(usersInRoom.length==0){
            setTimeout(async() => {
              

              let usersInRoom2 = await io.in(roomIdLet).fetchSockets();
              if(usersInRoom2.length==0){
                const room = await Room.findOne({where:{token:roomIdLet}})
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

























