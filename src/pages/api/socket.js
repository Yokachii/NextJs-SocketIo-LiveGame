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

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      socket.on('input-change', msg => {
        console.log('aaa')
        socket.broadcast.emit('update-input', msg)
      })
    })
  }
  res.end()
}

export default SocketHandler