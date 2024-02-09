"use client";
import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useRouter } from "next/router";
import io from 'Socket.IO-client'
import Link from "next/link";
import styles from './styles.module.scss'
import { useSession } from "next-auth/react";
import { Button } from "@mantine/core";
let socket:any;

type aMove = {
    from:string;
    to:string;
    promotion:string;
}





export default function PlayRandomMoveEngine() {
    const router = useRouter()
    const { roomid } = router.query

    const [game, setGame] = useState(new Chess());
    const [fen,setFen] = useState(game.fen())
    const [socketId,setSocketId] = useState('')
    const socketRef = useRef(null)
    const [isRoomExist,setIsRoomExist] = useState(true)
    const [isWhite,setIsWhite] = useState(true)
    const [isPlaying,setIsPlaying] = useState(false)
    const [messageArray,setMessageArray] = useState([{message:"You joined the chat",sendedBy:""}])
    const [input,setInput] = useState('')
    
    let mySocket = socketRef.current

    let session = useSession()
    let data = session.data
    let user = data?.user

  
    const socketInitializer = async () => {
        await fetch('/api/socket');
        socketRef.current = io();
        socketRef.current.on('get-room', () => {
            console.log('recived')
            socketRef.current.emit('set-room',roomid)
        })
        socketRef.current.on('room-joined',(data)=>{
            setSocketId(data.id)
            console.log(data)
        })
        socketRef.current.on('move-played',(data)=>{
          console.log('moveedddd')
            let id = data.id
            console.log(data)
            if(id===socketId) return
            moveOnBoardWithoutRequest(data.move)
            // makeAMove(data.move)
        })
        socketRef.current.on('new-message',(data)=>{
          if(data.id===socketId) return
          let message = data.message
          let sendedBy = data.name
          //@ts-ignore
          setMessageArray(prevSearchItemArray => {
            const newSearchItemArray = [...prevSearchItemArray, {message,sendedBy}];
            return newSearchItemArray;
          });
        })
    }

    const fetchRoom = async () => {
      const response = await fetch('/api/chess/getroom', {
        method: 'POST',
        body: JSON.stringify({id:roomid}),
        headers: {
            'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if(data.success){

        let players = JSON.parse(data.room.player)

        if(data.room.status==="w"){

          setIsPlaying(true)

        }else if(data.room.status==="p"){

          setIsPlaying(false)

        }

        
        let lastfen:string = data.room.lastboard?data.room.lastboard:`start`
        let move = data.room.lastmove?JSON.parse(data.room.lastmove):false
        console.log(move)
        setTimeout(() => {
          setFen(lastfen)
          if(move&&move.from){

            console.log('aaa')

            let tmp = game
            tmp.load(lastfen)
            try {
              tmp.move(move)
            } catch (error) {
              return null;
            }
            setGame(tmp)
            setFen(game.fen())
          }else{

          }

        }, 300);
        console.log(players)

      }else{

        setIsRoomExist(false)

      }
    }



    useEffect(()=>{
        if(!router.isReady) return;

        fetchRoom()

        socketInitializer()
    },[router.isReady])

    function moveOnBoardWithoutRequest(move){

      let tmp = game
      try {
        tmp.move(move)
      } catch (error) {
        return null;
      }
      setGame(tmp)
      setFen(game.fen())
    
    }

  function makeAMove(move) {
    if(!isPlaying) return null
    let tmp = game
    try {
      tmp.move(move)
    } catch (error) {
      return null;
    }
    setGame(tmp)
    setFen(game.fen())
    socketRef.current.emit("move", {roomid:roomid,move:move,id:socketId,fen:game.fen()});
    // setGame(game)
    return tmp; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    // setTimeout(makeRandomMove, 200);
    return true;
  }

  if(isRoomExist){
    
    return (
      <div className={styles.main}>
        <div style={{width:"60vw"}}>
            <Chessboard position={fen} onPieceDrop={onDrop} boardOrientation={isWhite?"white":"black"}/>
        </div>

        <div className={styles.chat}>
          <div className={styles.message}>

            {
              messageArray.map((item,i)=>(
                <span>
                  <span>{item.sendedBy}</span> <span>{item.message}</span>
                </span>
              ))
            }

          </div>
          <div className={styles.send}>

          <input onChange={(e)=>{setInput(e.target.value)}}></input>

          <Button onClick={()=>{
              socketRef.current.emit('send-message',{message:input,name:user?user?.name:`Guest`,roomid:roomid,id:socketId})
              setMessageArray(prevSearchItemArray => {
                const newSearchItemArray = [...prevSearchItemArray, {message:input,sendedBy:`You`}];
                return newSearchItemArray;
              });
          }}>Send a message</Button>

          </div>
        </div>

      </div>
    )

  }else{

    return (
      <div>
        This room does not exist, please create a room at : <Link href={`/chess/create`}>Create a room</Link> or join an alreay existing room
      </div>
    )

  }
}