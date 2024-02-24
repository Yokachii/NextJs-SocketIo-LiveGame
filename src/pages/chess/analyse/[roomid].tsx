"use client";
import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useRouter } from "next/router";
import io from 'Socket.IO-client'
import Link from "next/link";
import styles from './styles.module.scss'
import { useSession } from "next-auth/react";
import {MoveInfo, ChatItemType,PlayerSqlType} from '../../../types/data'
import { parse } from "@mliebelt/pgn-parser";
import { Modal, Button } from '@mantine/core';
const stockfish = require("stockfish");

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
    const [gameInfo,setGameInfo] = useState({baseBoard:`[Variant "From Position"][FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]`,specMoveInt:0,parsedBoard:[],gameLenght:0})
    const [fen,setFen] = useState(game.fen())
    const [isRoomExist,setIsRoomExist] = useState(false)
    const [userColor,setUserColor] = useState('w')

    const [blackUser,setBlackUser] = useState({name:"Black?",elo:"1200?"})
    const [whiteUser,setWhiteUser] = useState({name:"White?",elo:"1200?"})
  
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

        // setTimeout(() => {

          console.log(data)
          
          if(data.room.status==="end"){
            let players = JSON.parse(data.room.player)
            const p1 = players.player1
            const p2 = players.player2
            if(p1.color==="w"){
              setWhiteUser(p1)
              setBlackUser(p2)
            }else{
              setBlackUser(p1)
              setWhiteUser(p2)
            }
            loadPgn(data.room.pgn)
            // GAME INFO
            const parsedGame = await parsePgn(data.room.pgn)
            
            setGameInfo({baseBoard:gameInfo.baseBoard,specMoveInt:0,parsedBoard:parsedGame,gameLenght:await gameLength()})
            console.log({baseBoard:gameInfo.baseBoard,specMoveInt:0,parsedBoard:parsedGame,gameLenght:await gameLength()})
            setIsRoomExist(true)
          }else{
            setIsRoomExist(false)
          }
           
        // }, 400);

        
        

      }else{

        setIsRoomExist(false)

      }
    }



    useEffect(()=>{
        if(!router.isReady) return;

        fetchRoom()
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

    function makeAMove(move:any){

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

  function onDrop(sourceSquare:string, targetSquare:string) {
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
          setFen(game.fen())
          setGameInfo({gameLenght:gameInfo.gameLenght,specMoveInt:actualGameLength,baseBoard:gameInfo.baseBoard,parsedBoard:gameInfo.parsedBoard})
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
              
              moveOnBoardOnlyVisual(notation.notation,tmpChess)
          }

          console.log(stockfish(game.fen()))

          setGameInfo({gameLenght:gameInfo.gameLenght,specMoveInt:tmpArray.length,baseBoard:gameInfo.baseBoard,parsedBoard:gameInfo.parsedBoard})

        }

    }

  const gameLength = async () => {
    let actualGameMoves = await parsePgn(game.pgn())
    let actualGameLength = actualGameMoves.length
    return actualGameLength
  }

  const switchUserColor = async () => {
    if(userColor==="w"){
      setUserColor('b')
    }else{
      setUserColor('w')
    }
  }


  if(isRoomExist){
    
    return (
      <div className={styles.main}>

        
        
        <div className={styles.container_board}>

          
          <div style={{width:"40vw"}} className={styles.board_container}>
              <div className={styles.players_container}>
                <span>{userColor!=="w"?whiteUser.name:blackUser.name}</span>
                <span>{userColor!=="w"?whiteUser.elo:blackUser.elo}</span>
              </div>
              <Chessboard customArrowColor="#FF0000" position={fen} onPieceDrop={onDrop} boardOrientation={userColor==="w"?"white":"black"}/>
              <div className={styles.players_container}>
                <span>{userColor=="w"?whiteUser.name:blackUser.name}</span>
                <span>{userColor=="w"?whiteUser.elo:blackUser.elo}</span>
              </div>
          </div>

          <div>
            <Button onClick={()=>{
              switchUserColor()
            }}>Switch</Button>
          </div>

          <div className={styles.moves_container}>
            <div className={styles.moves}>

              {gameInfo.parsedBoard.map((item,i:number)=>{

                const x = gameInfo.parsedBoard.slice(0,i).map(({notation:{notation}})=>notation)

                return (

                  <div key={i}>
                    <button onClick={()=>{
                      setByInt(i+1,game.pgn())
                    }}>

                      {item.notation.notation}
                      
                    </button>
                  </div>

                )
              })}

            </div>
            <div className={styles.arrow}>

              <Button onClick={()=>{
                setByInt(gameInfo.specMoveInt-1,game.pgn())
              }}>
                Preview Move
              </Button>
              
              <Button onClick={()=>{
                setByInt(gameInfo.specMoveInt+1,game.pgn())
              }}>
                Next Move
              </Button>


            </div>
          </div>

        </div>

        
              <div>
                {gameInfo.specMoveInt}
              </div>
      </div>
    )

  }else{

    return (
      <div>
        This room does not exist, Or the game is playing
      </div>
    )

  }
}