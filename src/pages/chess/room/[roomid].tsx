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

    let session = useSession()
    let data = session.data
    let user = data?.user
    
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

    const [oponents,setOponents] = useState({name:"?",elo:"1200?"})
    const [playerInfo,setPlayerInfo] = useState({name:user?.name,elo:"1200?"})
    
    let mySocket = socketRef.current


  
    const socketInitializer = async () => {
        await fetch('/api/socket');
        socketRef.current = io();
        socketRef.current.on('get-room', () => {
            socketRef.current.emit('set-room',roomid)
        })
        socketRef.current.on('room-joined',(data:{id:string})=>{
            setSocketId(data.id)
        })
        socketRef.current.on('move-played', async (data:{pgn:string;id:string;move:Record<string,string>})=>{
          let id = data.id
          console.log(data)
          console.log(socketId)
          if(id==socketId) return
          console.log('i recive a move')
          console.log(data.move.san)
          loadPgn(data.pgn)
          // moveOnBoardWithoutRequest(data.move.san)
          // setFen(data.move.before)
          // makeAMove(data.move.san)
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

    function loadPgn(pgn:string){

      let tmp = game
      try {
        tmp.loadPgn(pgn)
      } catch (error) {
        console.log(error)
        return null;
      }
      setGame(tmp)
      setFen(game.fen())
      return;
    }

    function moveOnBoardWithoutRequest(move){

      let tmp = game
      let tmp2
      try {
        tmp2 = tmp.move(move)
      } catch (error) {
        console.log(error)
        return null;
      }
      setGame(tmp)
      setFen(game.fen())
      return tmp2
    
    }

  function makeAMove(move) {
    if(!isPlayingVar) return null

    let tmp = game
    let tmp2
    try {
      tmp2 = tmp.move(move)
    } catch (error) {
      console.log(error)
      return null;
    }

    let color = tmp2.color;
    if(color===userColor){
      setGame(tmp)
      setFen(game.fen())

      socketRef.current.emit("move", {pgn:game.pgn(),roomid:roomid,move:tmp2,id:socketId,fen:game.fen()});

    }

    return; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function onDrop(sourceSquare, targetSquare) {
    console.log('droped')
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

        <div>
          isPlayer : {isPlayingVar?"Oui":"Non"}
        </div>

        <div className={styles.players_container}>

          <span>{oponents.name}</span>
          <span>{oponents.elo}</span>

        </div>
        
        <div className={styles.container_board}>
          <div style={{width:"40vw"}}>
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

        <div className={styles.players_container}>

          <span>{playerInfo.name}</span>
          <span>{playerInfo.elo}</span>

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