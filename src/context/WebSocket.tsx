import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useRouter } from "next/router";
import io from 'Socket.IO-client'
import Link from "next/link";
import styles from './styles.module.scss'
import { useSession } from "next-auth/react";
import { Button } from "@mantine/core";
import { createContext } from "react";

type socket = {
    socket?:any
}

export const WebSocketContext = createContext<socket>({})

export const WebSocketConponent = ()=>{

    // let session = useSession()
    // let data = session.data
    // let user = data?.user

    const socketRef = useRef(null)
  
    const socketInitializer = async () => {
        await fetch('/api/socket');
        socketRef.current = io();
        socketRef.current.on('get-room', () => {
            socketRef.current.emit('set-room',roomid)
        })
        socketRef.current.on('room-joined',(data:{id:string,message:string})=>{
            setSocketId(data.id)
        })
    }

    const fetchRoom = async () => {
      console.log(`fetched ${user?.email} and ${roomid}`)
      const response = await fetch('/api/chess/getroom', {
        method: 'POST',
        body: JSON.stringify({token:roomid}),
        headers: {
            'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if(data.success){

        setTimeout(() => {

          if(data.room.status==="w"){

            setTimeout(() => {
              socketRef.current.emit(`join-game-try`,{roomid:roomid,userid:user?.id?user?.id:false})
            }, 300);

          }else if(data.room.status==="p"){

            // TODO WARNING SET THE PLAYER AS SPEC

            socketRef.current.emit(`join-game-alr-start`,{roomid:roomid,userid:user?.id?user?.id:false})

            setIsPlayingVar(false)

          }
          
        }, 400);

        
        

      }else{

        setIsRoomExist(false)

      }
    }



    useEffect(()=>{
        fetchRoom()

        socketInitializer()
    },[])

    return(
        <WebSocketContext.Provider value={{socket:""}}></WebSocketContext.Provider>
    )
    
}