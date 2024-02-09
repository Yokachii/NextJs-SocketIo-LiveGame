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
    const [userColor,setUserColor] = useState('w')
    const [isPlayingVar,setIsPlayingVar] = useState(false)
    const [messageArray,setMessageArray] = useState([{message:"You joined the chat",name:""}])
    const [input,setInput] = useState('')
    const [displayBoard,setDisplayBoard] = useState(false)
    
    let mySocket = socketRef.current

    let session = useSession()
    let data = session.data
    let user = data?.user

  
    const socketInitializer = async () => {
        await fetch('/api/socket');
        socketRef.current = io();
        socketRef.current.on('get-room', () => {
            socketRef.current.emit('set-room',roomid)
        })
        socketRef.current.on('room-joined',(data)=>{
            setSocketId(data.id)
        })
        socketRef.current.on('move-played',(data)=>{
          console.log('a move receved')
          console.log(data,socketId)
          let id = data.id
          if(id===socketId) return
          setFen(data.move.after)
          // moveOnBoardWithoutRequest(data.move)
        })
        socketRef.current.on('new-message',(data)=>{
          if(data.id===socketId) return
          let message = data.message
          let name = data.name
          //@ts-ignore
          setMessageArray(prevSearchItemArray => {
            const newSearchItemArray = [...prevSearchItemArray, {message,name}];
            return newSearchItemArray;
          });
        })

        socketRef.current.on('set-playing-as', (data)=>{

          let {color,isOponentsFinded,isPlaying,players,chat,lastmove} = data
          
          lastmove = JSON.parse(lastmove)
          let lastboard = lastmove.before
          let board = lastmove.after

          // Get the chat
          chat.unshift(messageArray[0])
          setMessageArray(chat)
          
          // Set the board at the good side
          setUserColor(color)

          // Set the fen on the board
          let lastfen:string = lastboard?lastboard:`rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`
          setTimeout(() => {
            setFen(lastfen)
            if(lastmove&&lastmove.from){

              let tmp = game
              tmp.load(lastfen)
              try {
                tmp.move(lastmove)
              } catch (error) {
                return null;
              }
              setGame(tmp)
              setFen(game.fen())
            }else{

            }

          }, 300);
          
          // Display the board
          setDisplayBoard(true)
          
          if(isPlaying){
            setIsPlayingVar(true)
          }

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

        setTimeout(() => {

          let players = JSON.parse(data.room.player)

          if(data.room.status==="w"){

            socketRef.current.emit(`join-game-try`,{roomid:roomid,userid:user?.id?user?.id:false})

            // setIsPlayingVar(true)

          }else if(data.room.status==="p"){

            setIsPlayingVar(false)

          }
          
        }, 400);

        
        

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
        console.log(error)
        return null;
      }
      // console.log('')
      setGame(tmp)
      setFen(game.fen())
    
    }

  function makeAMove(move) {
    if(!isPlayingVar) return null
    let tmp = game
    let tmp2
    try {
      tmp2 = tmp.move(move)
    } catch (error) {
      return null;
    }
    if(tmp2.color!==userColor) return null;
    setGame(tmp)
    setFen(game.fen())
    socketRef.current.emit("move", {roomid:roomid,move:tmp2,id:socketId,fen:game.fen()});
    console.log('a move sended'+{roomid:roomid,move:tmp2,id:socketId,fen:game.fen()})
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
            <Chessboard position={fen} onPieceDrop={onDrop} boardOrientation={userColor==="w"?"white":"black"}/>
        </div>

        <div className={styles.chat}>
          <div className={styles.message}>

            {
              messageArray.map((item,i)=>(
                <span>
                  <span>{item.name}</span> <span>{item.message}</span>
                </span>
              ))
            }

          </div>
          <div className={styles.send}>

          <input onChange={(e)=>{setInput(e.target.value)}}></input>

          <Button onClick={()=>{
              socketRef.current.emit('send-message',{message:input,name:user?user?.name:`Guest`,roomid:roomid,id:socketId})
              setMessageArray(prevSearchItemArray => {
                const newSearchItemArray = [...prevSearchItemArray, {message:input,name:`You`}];
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