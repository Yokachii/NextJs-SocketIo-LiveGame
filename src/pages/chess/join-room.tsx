"use client";
import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useRouter } from "next/router";
import styles from './styles.module.scss'

import io from 'Socket.IO-client'
import { useSession } from "next-auth/react";
import { Button } from "@mantine/core";
import Link from "next/link";
let socket:any;

type aMove = {
    from:string;
    to:string;
    promotion:string;
}





export default function PlayRandomMoveEngine() {
    const [rooms,setRooms] = useState([])
    const socketRef = useRef(null)
    const router = useRouter()

    let session = useSession()
    let user = session.data
    let id = user?.user?.id

    const socketInitializer = async () => {
        await fetch('/api/socket');
        socketRef.current = io();
        // socketRef.current.on('get-room', () => {
        //     console.log('recived')
        // })
    }

    const getPlayer = async (id:string) => {
        const response = await fetch('/api/chess/getuser', {method: 'POST',body: JSON.stringify({id:id}),headers: {'Content-Type': 'application/json',},});
        const data = await response.json();

        console.log(data,{name:data.user.firstname}.name)

        if(data.success){

            return  {name:data.user.firstname}

        }else{

            return {name:""}

        }
    }



    useEffect(()=>{
        socketInitializer()
    },[])

  return (
    <div style={{width:"60vw"}}>

        <input onChange={async(e)=>{
            const response2 = await fetch('/api/chess/searchroom', {method: 'POST',body: JSON.stringify({id:e.target.value}),headers: {'Content-Type': 'application/json',},});
            const data2 = await response2.json();
            let room = data2.room
            room = room[0]
            setRooms(room)
        }}></input>


        <div className={styles.room_container}>

            {
                rooms.map((item,i)=>(
                    <div key={i}>
                        <Link href={`/chess/room/${item.token}`}>
                            <span>Room's name : {item.id}</span>
                            <br></br>
                            <span>{item.status==="w"?`${JSON.parse(item.player).player1.name} Attend un adversaire`:`${JSON.parse(item.player).player1.name} Joue contre : ${JSON.parse(item.player).player2.name}`}</span>
                        </Link>
                    </div>
                ))
            }

        </div>
        {/* {id?(
            <Button onClick={()=>{
                socketRef.current.emit('create-room',{roomId:input,userId:id})
                return router.push(`/chess/room/${input}`)
            }}>Create a room</Button>
        ):(
            <Button disabled>Create a room</Button>
        )} */}

    </div>
  )
}