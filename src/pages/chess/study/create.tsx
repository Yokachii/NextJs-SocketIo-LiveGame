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
    const [succes,setSucces] = useState(true)
    const socketRef = useRef(null)
    const router = useRouter()

    let session = useSession()
    let user = session.data
    let id = user?.user?.id

    const socketInitializer = async () => {
        await fetch('/api/socket');
        socketRef.current = io();
        socketRef.current.on('room-created', async (data:{roomToken:string,roomId:string;})=>{
            router.push(`/chess/room/${data.roomToken}`)
        })
    }



    useEffect(()=>{
        socketInitializer()
    },[])

  return (
    <div style={{width:"60vw"}}>

        <input onChange={(e)=>{setInput(e.target.value)}}></input>
        {id?(
            <Button onClick={async()=>{
                const response2 = await fetch('/api/chess/createstudy', {method: 'POST',body: JSON.stringify({userId:user?.user?.id,name:input,isPrivate:false}),headers: {'Content-Type': 'application/json',},});
                const data2 = await response2.json();
                if(data2.success){

                    let study = data2.study
                    router.push(`/chess/study/view/${study.id}`)

                }else{

                    setSucces(false)
                    setTimeout(() => {
                        setSucces(true)
                    }, 2000);

                }
            }}>Create a room</Button>
        ):(
            <Button disabled>Create a room</Button>
        )}

    </div>
  )
}

