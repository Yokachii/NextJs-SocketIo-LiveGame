import { useEffect, useRef, useState } from 'react'
import io from 'Socket.IO-client'
let socket:any;

const Home = () => {
  const [input, setInput] = useState('')
  const socketRef = useRef(null)

  
  const socketInitializer = async () => {
    await fetch('/api/socket');
    socketRef.current = io();
    socketRef.current.on('update-input', () => {
      console.log('recived')
    })
  }

  useEffect(()=>{
    socketInitializer()


  },[])

  // useEffect(() => socketInitializer(), [])

  const onChangeHandler = (e:any) => {
    setInput(e.target.value)
    socketRef.current.emit("input-change", {data:e.target.value});
    // socket.emit('input-change', e.target.value)
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