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
import { parse } from '@mliebelt/pgn-parser'
let socket:any;



export default function study() {
    const router = useRouter()
    const { studyid } = router.query

    let session = useSession()
    let data = session.data
    let user = data?.user
    
    const [game, setGame] = useState(new Chess());
    const [pgn,setPgn] = useState(game.pgn())
    const [fen,setFen] = useState(game.fen())
    const [isRoomExist,setIsRoomExist] = useState(true)
    const [orientation,setOrientation] = useState('white')
    const [name,setName] = useState('')
    const [moveInt,setMoveInt] = useState(0)

    function onDrop(sourceSquare, targetSquare) {
        console.log('droped')
    }

    const fetchRoom = async () => {
        console.log(studyid)
        const response = await fetch('/api/chess/getstudy', {
            method: 'POST',
            body: JSON.stringify({id:studyid}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        console.log(data)

        // loadPgn("")
        loadFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

        if(data.success){

            let study = data.study
            setName(study.name)
            let pgn = study.pgn
            setPgn(pgn)
            //@ts-ignore
            let moves = parse(pgn, {startRule: "game"}).moves;
            console.log(moves)
            setTimeout(() => {
                move(moves[0].notation.notation)
            }, 1000);
            
            // loadPgn(pgn)
            // console.log(moves)

        }else{

            setIsRoomExist(false)

        }
    }

    useEffect(()=>{
        if(!router.isReady) return;

        fetchRoom()
    },[router.isReady,session])

    function loadPgn(pgn:string){

      let tmp = game
      try {
        tmp.loadPgn(pgn)
      } catch (error) {
        console.log(error)
        return null;
      }
      setGame(tmp)
      return;
    }

    function loadFen(fen:string){
        let tmp = game
        try {
            tmp.load(fen)
        } catch (error) {
            console.log(error)
            return null;
        }
        setGame(tmp)
        setFen(fen)
        return;
    }

    function move(move:string){
        let tmp = game
        try {
            tmp.move(move)
        } catch (error) {
            console.log(error)
            return null;
        }
        setGame(tmp)
        setFen(tmp.fen())
        return;
    }

    function setByInt(int:number,pgn:string){
        console.log('a')

        // @ts-ignore
        let moves = parse(pgn, {startRule: "game"}).moves;
        console.log(int,pgn)
        console.log(moves)
        if(int>moves.length){
            loadPgn(pgn)
        }else{

            for (let i = 0; i < int; i++) {
                const myMove = moves[i];
                const notation = myMove.notation
                
                move(notation.notation)
            }

        }

    }

    const plusAMove = async ()=>{
        console.log('ici')

        setMoveInt(moveInt+1)
        console.log(moveInt)
        setByInt(moveInt,pgn)

    }
    const moinAMove = async ()=>{

    }

  if(isRoomExist){
    
    return (
      <div className={styles.main}>
        
        <div style={{width:"40vw"}}>
              <Chessboard position={fen} onPieceDrop={onDrop} boardOrientation={orientation}/>
        </div>

        <button onClick={()=>{
            plusAMove()
        }}>{`<--`}</button>
        <button onClick={()=>{
            moinAMove()
        }}>{`-->`}</button>

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