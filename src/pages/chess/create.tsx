"use client";
import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useRouter } from "next/router";

import io from 'Socket.IO-client'
import { useSession } from "next-auth/react";
import { Button } from "@mantine/core";
let socket:any;

type aMove = {
    from:string;
    to:string;
    promotion:string;
}





export default function PlayRandomMoveEngine() {
    const [socketId,setSocketId] = useState('')
    const [input,setInput] = useState('')
    const socketRef = useRef(null)
    const router = useRouter()

    let session = useSession()
    let user = session.data
    let id = user?.user?.id

    const socketInitializer = async () => {
        await fetch('/api/socket');
        socketRef.current = io();
        socketRef.current.on('get-room', () => {
            console.log('recived')
        })
        socketRef.current.on('room-joined',(data)=>{
            setSocketId(data.id)
            console.log(data)
        })
        socketRef.current.on('move-played',(data)=>{
            let id = data.id
            console.log(data)
            if(id===socketId) return
            makeAMove(data.move)
        })
    }



    useEffect(()=>{
        socketInitializer()
    },[])

  return (
    <div style={{width:"60vw"}}>

        <input onChange={(e)=>{setInput(e.target.value)}}></input>
        {id?(
            <Button onClick={()=>{
                socketRef.current.emit('create-room',{roomId:input,userId:id})
                return router.push(`/chess/room/${input}`)
            }}>Create a room</Button>
        ):(
            <Button disabled>Create a room</Button>
        )}

    </div>
  )
}