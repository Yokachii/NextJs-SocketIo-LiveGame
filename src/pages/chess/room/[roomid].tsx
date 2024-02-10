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

    type playerSqlType = {
      color:string;
      id:string;
    }

    type chatItemType = {
      message:string;
      name:string;
      roomid:string;
      id:string;
    }
  
    const socketInitializer = async () => {
        await fetch('/api/socket');
        socketRef.current = io();
        socketRef.current.on('get-room', () => {
            socketRef.current.emit('set-room',roomid)
        })
        socketRef.current.on('room-joined',(data:{id:string,message:string})=>{
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
        socketRef.current.on('new-message',(data:chatItemType)=>{
          if(data.id===socketId) return
          let message = data.message
          let name = data.name
          //@ts-ignore
          setMessageArray(prevSearchItemArray => {
            const newSearchItemArray = [...prevSearchItemArray, {message,name}];
            return newSearchItemArray;
          });
        })

        socketRef.current.on('set-playing-as', async (data:{isFirstTime:boolean,playerType:string,color:string,isOponentsFinded:boolean,isPlaying:boolean,players:Record<string,playerSqlType>,chat:Array<chatItemType>,lastmove:string})=>{

          let {isFirstTime,playerType,color,isOponentsFinded,isPlaying,players,chat,lastmove} = data
          // console.log('||||||||||||')
          // console.log(data)
          // console.log(playerType)
          // console.log('||||||||||||')
          
          lastmove = JSON.parse(lastmove)
          let lastboard = lastmove.before

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
          
          if(isPlaying&&isOponentsFinded){
            setIsPlayingVar(true)
          }

          console.log('started as :'+playerType)

          console.log(playerType,isFirstTime)
          if(playerType=="last"&&isFirstTime) socketRef.current.emit('accept-play',{roomId:roomid,userId:user?.id})
          // if(playerType=="first") socketRef.current.emit('accept-play',{roomId:roomid,userId:user?.id})
          if(playerType=="first"){
            console.log(players)

            const response = await fetch('/api/chess/getuser', {method: 'POST',body: JSON.stringify({id:players.player2.id}),headers: {'Content-Type': 'application/json',},});
            const data = await response.json();

            console.log(data)

            if(data.success){
              
              setOponents({name:data.user.firstname,elo:"1230 (loaded opo)"})

            }
            
          }

        })

        socketRef.current.on('game-start', (data)=>{
          let {oponentsName,oponentsElo} = data
          console.log(data)
          console.log('game start'+oponentsName+oponentsElo)
          
          setIsPlayingVar(true)
          setOponents({name:oponentsName,elo:oponentsElo})
        })

        socketRef.current.on(`game-starting-as-p1`, (data)=>{
          let { player2 } = data

          setOponents({name:player2.firstname,elo:"1299?"})
          setIsPlayingVar(true)
        })

        socketRef.current.on('set-player-spec', async (data)=>{

          let {pgn,chat,players} = data

          let player1 = players.player1
          let player2 = players.player2

          let name1
          let name2

          if(player2.id){
            const response2 = await fetch('/api/chess/getuser', {method: 'POST',body: JSON.stringify({id:player2.id}),headers: {'Content-Type': 'application/json',},});
            const data2 = await response2.json();
            
            if(data2.success){
  
              name2=data2.user.firstname
  
            }
          }
          
          const response1 = await fetch('/api/chess/getuser', {method: 'POST',body: JSON.stringify({id:player1.id}),headers: {'Content-Type': 'application/json',},});
    
          const data1 = await response1.json();
    
          if(data1.success){

            name1=data1.user.firstname

          }
          

          console.log(name1,name2)

          // Set chat
          chat.unshift(messageArray[0])
          setMessageArray(chat)

          // Set color
          setUserColor('w')

          if(player1.color==="w"){
            setPlayerInfo({name:name1?name1:"Can't load name",elo:"1299?. (spec)"})
            setOponents({name:name2?name2:"Can't load name",elo:"1299?. (spec)"})
          }else{
            setPlayerInfo({name:name2?name2:"Can't load name",elo:"1299?. (spec)"})
            setOponents({name:name1?name1:"Can't load name",elo:"1299?. (spec)"})
          }

          // Load pgn
          loadPgn(pgn)
          console.log('loaded '+pgn)
          
          // Display the board
          setDisplayBoard(true)

        })
    }

    const fetchRoom = async () => {
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

          let players = JSON.parse(data.room.player)

          if(data.room.status==="w"){

            setTimeout(() => {
              socketRef.current.emit(`join-game-try`,{roomid:roomid,userid:user?.id?user?.id:false})
            }, 300);

            // setIsPlayingVar(true)

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
    let oldPgn = game.pgn()

    let tmp = game
    let tmp2
    try {
      tmp2 = tmp.move(move)
      
      let color = tmp2.color;
      if(color===userColor){
        setGame(tmp)
        setFen(game.fen())
  
        socketRef.current.emit("move", {pgn:game.pgn(),roomid:roomid,move:tmp2,id:socketId,fen:game.fen()});
  
      }else{

        // If the player can't play we set the board back to the old pgn to be sure dont get bad visual
        game.loadPgn(oldPgn)

      }
    } catch (error) {
      console.log(error)
      return null;
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

        <button onClick={()=>{
          console.log(game.pgn())
        }}>Test</button>

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
                  <span key={i}>
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