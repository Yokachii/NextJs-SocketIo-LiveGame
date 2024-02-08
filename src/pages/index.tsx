
// import { Hero } from "../components/core/Hero";
// import { FeaturesCards } from "../components/core/Features";
// import  io  from 'socket.io-client'
// import { useEffect } from "react";


// const Home = () => {

//   //@ts-ignore
//   // let socket

//   // const socketInitializer=async ()=>{
//   //     await fetch('/api/socket')
//   //     socket=io()
//   //     socket.on('test',()=>{
//   //       console.log('bahahahah')
//   //     })
//   //     // socket.emit("test", "world");
//   //     console.log(socket)

//   //     // setTimeout(() => {
//   //     //   //@ts-ignore
//   //     // }, 5000);
//   // }

//   // useEffect(()=>{

//   //   socketInitializer()

//   //   // socket.emit("test", "world");

//   // },[])

//   // let socket

//   // useEffect(() => {
//   //     // initialize your socket
//   //     socket = io('/api/socketio');

//   //     socket.emit('test',{data:'a'})
//   // }, []);


//   return (
//     <>
//       <div>
        
//         <span>Stockage all your data</span>

//         {/* <button onClick={()=>{socket.emit('test',{data:'a'})}}>Test</button> */}

//       </div>
//     </>
//   );
// }

// export default Home;


import { useEffect, useState } from 'react'
import io from 'Socket.IO-client'
let socket:any;

const Home = () => {
  const [input, setInput] = useState('')

  
  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io()
    
    socket.on('connect', () => {
      console.log('connected')
    })
    
    socket.on('update-input', msg => {
      setInput(msg)
    })
  }

  useEffect(()=>{
    socketInitializer()
  },[])

  // useEffect(() => socketInitializer(), [])

  const onChangeHandler = (e:any) => {
    setInput(e.target.value)
    socket.emit('input-change', e.target.value)
  }

  return (
    <div>
      <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
    </div>
  )
}

export default Home;