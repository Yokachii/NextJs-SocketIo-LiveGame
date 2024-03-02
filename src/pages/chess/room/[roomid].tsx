"use client";
import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useRouter } from "next/router";
import io from 'Socket.IO-client'
import Link from "next/link";
import styles from './styles.module.scss'
import { useSession } from "next-auth/react";
import {MoveInfo, ChatItemType,PlayerSqlType} from '@/types/data'
import { parse } from "@mliebelt/pgn-parser";
import { Modal, Button } from '@mantine/core';
import { useDisclosure } from "@mantine/hooks";
// type Arrows = {
//   from:string;
//   to:string;
//   color:string;
// }
type Arrows = Array<string>
type CustomArrows = Record<number,Array<Arrows>>



export default function Room() {

    const parsePgn = async (pgntmp:string) => {
      try {

        return await parse(pgntmp, {startRule: "game"}).moves
        
      } catch (error) {

        return []
        
      }
    }

    const router = useRouter()
    const { roomid } = router.query

    let session = useSession()
    let data = session.data
    let user = data?.user
    
    const [game, setGame] = useState(new Chess());
    const [gameInfo,setGameInfo] = useState({termation:`cant load`,isOver:false,baseBoard:`
    [Variant "From Position"]
    [FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]`,specMoveInt:0,parsedBoard:[],gameLenght:0})
    const [fen,setFen] = useState(game.fen())
    const [socketId,setSocketId] = useState('')
    const socketRef = useRef(null)
    const [isRoomExist,setIsRoomExist] = useState(true)
    const [userColor,setUserColor] = useState('w')
    const [isPlayingVar,setIsPlayingVar] = useState(false)
    const [messageArray,setMessageArray] = useState<Array<ChatItemType>>([{message:"You joined the chat",id:"console",name:``,roomid:``}])
    const [input,setInput] = useState('')
    const [isPlayingOnBoard,setIsPlayingOnBoard] = useState(true)
    const [customArrow,setCustomArrow] = useState<CustomArrows>({})
    const [modalStr,setModalStr] = useState('loading')
    const [isGameStarted,setIsGameStarted] = useState(false)
    const [opened, { open, close }] = useDisclosure(false);

    const [oponents,setOponents] = useState({name:"?",elo:"1200?"})
    const [playerInfo,setPlayerInfo] = useState({name:user?.name,elo:"1200?"})
  
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
          console.log(game.isGameOver())
          loadPgn(data.pgn)
          // moveOnBoardWithoutRequest(data.move.san)
          // setFen(data.move.before)
          // makeAMove(data.move.san)
          // moveOnBoardWithoutRequest(data.move)
        })
        socketRef.current.on('new-message',(data:ChatItemType)=>{
          if(data.id===socketId) return
          let message = data.message
          let name = data.name
          //@ts-ignore
          setMessageArray(prevSearchItemArray => {
            const newSearchItemArray = [...prevSearchItemArray, {message,name}];
            return newSearchItemArray;
          });
        })

        socketRef.current.on('set-playing-as', async (data:{status:string,pgn:string,isFirstTime:boolean,playerType:string,color:string,isOponentsFinded:boolean,isPlaying:boolean,players:Record<string,PlayerSqlType>,chat:Array<ChatItemType>,lastmove:string})=>{

          let {status,pgn,isFirstTime,playerType,color,isOponentsFinded,isPlaying,players,chat,lastmove} = data

          // Get the chat
          chat.unshift(messageArray[0])
          setMessageArray(chat)
          
          // Set the board at the good side
          setUserColor(color)

          // Set the fen on the board
          console.log(pgn)
          loadPgn(pgn)
          
          
          // Display the board
          console.log(status)
          if(status!=="w"){
            setIsGameStarted(true)
          }
          if(isPlaying&&isOponentsFinded){
            setIsPlayingVar(true)
          }

          if(isOponentsFinded){
            // const response = await fetch('/api/chess/getuserinfo', {
            //     method: 'POST',
            //     body: JSON.stringify({id:userid}),
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // });
    
            // const data = await response.json();
    
            // console.log(data)
            
            // if(data.success){
                
    
            //     setUser(data.user)
    
    
            // }else{
    
            //     setIsUserExist(false)
    
            // }
          }

          console.log('started as :'+playerType)

          console.log(playerType,isFirstTime)
          if(playerType=="last"&&isFirstTime) socketRef.current.emit('accept-play',{roomId:roomid,userId:user?.id})
          // if(playerType=="first") socketRef.current.emit('accept-play',{roomId:roomid,userId:user?.id})
          if(playerType=="first"||playerType=="last"){

            if(players.player1.color===userColor){
              setOponents({name:players.player2.name,elo:"1200 (opo)"})
              setPlayerInfo({name:players.player1.name,elo:"1200"})
            }else{
              setOponents({name:players.player1.name,elo:"1200 (opo)"})
              setPlayerInfo({name:players.player2.name,elo:"1200"})
            }
            
          }

        })

        socketRef.current.on('game-start', (data:{pgn:string,oponentsName:string,oponentsElo:string;})=>{
          let {oponentsName,oponentsElo,pgn} = data
          

          console.log(data)
          console.log('game start'+oponentsName+oponentsElo)
          console.log(`My game start : ${pgn}`)
          
          setIsPlayingVar(true)
          setOponents({name:oponentsName,elo:oponentsElo})
        })

        socketRef.current.on('game-end', async (data:{pgn:string})=>{
          const {pgn} = data
          let parse = await parsePgn(pgn)
          console.log(parse)
          setGameInfo({termation:parse.termination,isOver:true,gameLenght:gameInfo.gameLenght,specMoveInt:gameInfo.specMoveInt,baseBoard:gameInfo.baseBoard,parsedBoard:parse})
          // setIsEndOpen(true)
          open()
        })

        socketRef.current.on(`game-starting-as-p1`, (data:{player2:Record<string,string>})=>{
          let { player2 } = data

          setOponents({name:player2.firstname,elo:"1299?"})
          setIsPlayingVar(true)
        })

        socketRef.current.on(`set-spec-ended`, async (data:{pgn:string,chat:Array<ChatItemType>,players:Record<string,PlayerSqlType>})=>{

          console.log('hey')

          let {pgn,chat,players} = data

          let parsePgn = await parse(pgn, {startRule: "game"})

          let player1 = players.player1
          let player2 = players.player2

          let name1 = player1.name
          let name2 = player2.name

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
          // Display end modal
          console.log(parsePgn.tags.Termination)
          setModalStr(parsePgn.tags.Termination)
          setTimeout(() => {
            open()
          }, 500);
          console.log('loaded '+pgn)
          

        })

        socketRef.current.on('set-player-spec', async (data:{pgn:string,chat:Array<ChatItemType>,players:Record<string,PlayerSqlType>})=>{

          let {pgn,chat,players} = data

          let player1 = players.player1
          let player2 = players.player2

          let name1 = player1.name
          let name2 = player2.name

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

          }else if(data.room.status==="end"){


            socketRef.current.emit(`join-game-end`,{roomid:roomid,userid:user?.id?user?.id:false})

            setIsPlayingVar(false)

          }else{

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
    },[router.isReady,session])

    async function loadPgn(pgn:string){ 

      let tmp = game
      try {
        tmp.loadPgn(pgn)
      } catch (error) {
        console.log(error)
        return null;
      }
      setFen(tmp.fen())
      setGame(tmp)
      const length = await gameLength()
      setGameInfo({termation:gameInfo.termation,isOver:gameInfo.isOver,gameLenght:length,specMoveInt:gameInfo.specMoveInt,baseBoard:gameInfo.baseBoard,parsedBoard:await parsePgn(tmp.pgn())})
      return;
      
    }

    function moveOnBoardWithoutRequest(move:any){

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

  async function makeAMove(move:MoveInfo) {
    if(!isPlayingVar) return null
    if(gameInfo.isOver) return null
    let oldPgn = game.pgn()

    let tmp = game
    let tmp2
    try {
      tmp2 = tmp.move(move)
      
      let color = tmp2.color;
      if(color===userColor){
        setGame(tmp)
        setFen(game.fen())
        setGameInfo({termation:gameInfo.termation,isOver:gameInfo.isOver,gameLenght:gameInfo.gameLenght,specMoveInt:gameInfo.specMoveInt,baseBoard:gameInfo.baseBoard,parsedBoard:await parsePgn(tmp.pgn())})

        // game.isCheckmate()
        // game.isStalemate()
        // game.isDraw()
        // console.log(game.isGameOver())
        if(game.isGameOver()){

          socketRef.current.emit("move", {fen:fen,pgn:game.pgn(),roomid:roomid,move:tmp2,id:socketId,isOver:true,winner:userColor});

        }else{

          socketRef.current.emit("move", {fen:fen,pgn:game.pgn(),roomid:roomid,move:tmp2,id:socketId,isOver:false});

        }
  
  
      }else{

        // If the player can't play we set the board back to the old pgn to be sure dont get bad visual
        game.loadPgn(oldPgn)
        setGameInfo({termation:gameInfo.termation,isOver:gameInfo.isOver,gameLenght:gameInfo.gameLenght,specMoveInt:gameInfo.specMoveInt,baseBoard:gameInfo.baseBoard,parsedBoard:await parsePgn(oldPgn)})

      }
    } catch (error) {
      console.log(error)
      return null;
    }


    return; // null if the move was illegal, the move object if the move was legal
  }

  function onDrop(sourceSquare:string, targetSquare:string) {
    console.log('droped')
    if(isPlayingOnBoard){

      const move = makeAMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });
  
      // illegal move
      if (move === null) return false;
      // setTimeout(makeRandomMove, 200);
      return true;

    }else{

      setFen(game.fen())
      setIsPlayingOnBoard(true)

      return false

    }
  }

  const gameOver = async() => {
    if(game.isGameOver()){

      // setGameInfo({isOver:true,gameLenght:gameInfo.gameLenght,specMoveInt:gameInfo.specMoveInt,baseBoard:gameInfo.baseBoard,parsedBoard:gameInfo.parsedBoard})

    }else{

    }
  }

  const arrowChange = async (squares:Array<string>) => {
    console.log(customArrow)
    if(squares.length===0) return;
    let arrows = []
    let item = squares[squares.length-1]
    console.log(item)
    console.log(squares)
    // for(let item of squares){
      let from = item[0]
      let to = item[1]
      // let color = item[2]
      let color = "blue"
      arrows.push([from,to,color])
    // }
    let actualGameLength = await gameLength()
    let tmp = {...customArrow}
    if(isPlayingOnBoard){
      
      let actual = tmp[actualGameLength]?tmp[actualGameLength]:[]
      tmp[actualGameLength] = actual.concat(arrows)
      

      
    }else{

      let actual = tmp[gameInfo.specMoveInt]?tmp[gameInfo.specMoveInt]:[]
      tmp[gameInfo.specMoveInt] = actual.concat(arrows)

      
    }
    setCustomArrow(tmp)
    return null
  }

  // MOVE VIEW

  const moveOnBoardOnlyVisual = async (move:string,tmpGame:any) => {

    let tmp2
    try {
      tmp2 = tmpGame.move(move)
    } catch (error) {
      console.log(error)
      return null;
    }
    setFen(tmpGame.fen())
    return tmp2
    
  }

  const loadPgnWithoutModif = async (pgn:string,tmpGame:any) => {
    try {
      tmpGame.loadPgn(pgn)
    } catch (error) {
      console.log(error)
      return null;
    }
    console.log(tmpGame.pgn())
    setFen(tmpGame.fen())
    return;
  }

  async function setByInt(int:number,tmpPgn:string){

        // @ts-ignore
        let moves = await parsePgn(tmpPgn)
        let actualGameMoves = await parsePgn(game.pgn())
        let actualGameLength = actualGameMoves.length
        
        

        console.log(actualGameLength,int)
        if(actualGameLength<=int){
          console.log('set true')
          setIsPlayingOnBoard(true)
          setFen(game.fen())
          return
        }

        const tmpChess = new Chess()
        
        if(int>moves.length||int<0){
        }else{
            // loadPgn(gameInfo.baseBoard)
            loadPgnWithoutModif(gameInfo.baseBoard,tmpChess)

            let tmpArray = []

            for (let i = 0; i < int; i++) {
                const myMove = moves[i];
                const notation = myMove.notation

                tmpArray.push(notation.notation)
                
                // moveOnBoardWithoutRequest(notation.notation)
                moveOnBoardOnlyVisual(notation.notation,tmpChess)
            }

            setGameInfo({termation:gameInfo.termation,isOver:gameInfo.isOver,gameLenght:gameInfo.gameLenght,specMoveInt:tmpArray.length,baseBoard:gameInfo.baseBoard,parsedBoard:gameInfo.parsedBoard})

            let tmp = {...customArrow}
            if(!tmp[int]) tmp[int] = []
            console.log('|||||||||||||')
            console.log(tmp)
            console.log(customArrow)
            console.log('|||||||||||||')
            setCustomArrow(tmp)

        }

    }

    function playAList(array:Array<string>){
        
        let tmp2 = array.join(` `)


        loadPgn(gameInfo.baseBoard)
        

        setTimeout(() => {
            
            for(let item of array){

                moveOnBoardWithoutRequest(item)
    
            }
        }, 100);

    }

  const previewMove = async () => {
    
  }

  const nextMove = async () => {
    
  }

  const gameLength = async () => {
    let actualGameMoves = await parsePgn(game.pgn())
    let actualGameLength = actualGameMoves.length
    return actualGameLength
  }


  if(isRoomExist){
    
    if(isGameStarted){
      return (
        <div className={styles.main}>
  
        <Modal opened={opened} onClose={close} title="Game result" centered>
          {/* Modal content */}
          <div>
            <span>{modalStr}</span>
          </div>
        </Modal>
  
          <button onClick={()=>{
            // console.log(game.pgn())
            console.log(gameInfo)
          }}>Test</button>
  
          <div>
            isPlayer : {isPlayingVar?"Oui":"Non"}
          </div>
          <div>
            isLive : {isPlayingOnBoard?"Oui":"Non"} {`SpecMoveInt : ${gameInfo.specMoveInt}`}
          </div>
          
          <div className={styles.container_board}>
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
                  //@ts-ignore
                  setMessageArray(prevSearchItemArray => {
                    const newSearchItemArray = [...prevSearchItemArray, {message:input,name:`You`}];
                    return newSearchItemArray;
                  });
              }}>Send a message</Button>
  
              </div>
            </div>
            
            <div style={{width:"40vw"}} className={styles.board_container}>
                <div className={styles.players_container}>
                  <span>{playerInfo.name}</span>
                  <span>{playerInfo.elo}</span>
                </div>
                <Chessboard customArrowColor="#FF0000" customArrows={customArrow[isPlayingOnBoard?gameInfo.gameLenght:gameInfo.specMoveInt]} onArrowsChange={arrowChange} position={fen} onPieceDrop={onDrop} boardOrientation={userColor==="w"?"white":"black"}/>
                <div className={styles.players_container}>
                  <span>{oponents.name}</span>
                  <span>{oponents.elo}</span>
                </div>
            </div>
  
            <div className={styles.moves_container}>
              <div className={styles.moves}>
  
                {gameInfo.parsedBoard.map((item,i:number)=>{
  
                  const x = gameInfo.parsedBoard.slice(0,i).map(({notation:{notation}})=>notation)
  
                  return (
  
                    <div key={i}>
                      <button onClick={()=>{
                        setIsPlayingOnBoard(false)
                        setByInt(i+1,game.pgn())
                        // setArrows(item.)
                      }}>
  
                        {item.notation.notation}
                        
                      </button>
                    </div>
  
                  )
                })}
  
              </div>
              <div className={styles.arrow}>
  
                <Button onClick={()=>{
                  setIsPlayingOnBoard(false)
                  setByInt(isPlayingOnBoard?1:gameInfo.specMoveInt-1,game.pgn())
                }}>
                  Preview Move
                </Button>
                
                <Button onClick={()=>{
                  setIsPlayingOnBoard(false)
                  setByInt(gameInfo.specMoveInt+1,game.pgn())
                }}>
                  Next Move
                </Button>
  
  
              </div>
              <div>
                {/* {JSON.stringify(customArrow)} */}
                {JSON.stringify(customArrow[isPlayingOnBoard?gameInfo.gameLenght:gameInfo.specMoveInt])}
              </div>
            </div>
  
          </div>
  
          
  
        </div>
      )
    }else{
      return (
        <div>
          <span>name : {playerInfo.name}</span>
          <span>socket : {socketId}</span>
          <span>game : {isGameStarted?`true`:`false`}</span>
          <span></span>
        </div>
      )
    }

  }else{

    return (
      <div>
        This room does not exist, please create a room at : <Link href={`/chess/create`}>Create a room</Link> or join an alreay existing room
      </div>
    )

  }
}