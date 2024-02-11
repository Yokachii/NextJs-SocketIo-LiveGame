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
    const [studyPgn,setStudyPgn] = useState('')
    const [fen,setFen] = useState(game.fen())
    const [isRoomExist,setIsRoomExist] = useState(true)
    const [orientation,setOrientation] = useState('white')
    const [name,setName] = useState('')
    const [moveInt,setMoveInt] = useState(0)
    const [baseFen,setBaseFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    const [baseMoveNumber,setBaseMoveNumber] = useState(0)

    function onDrop(sourceSquare:any, targetSquare:any) {
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
        
        if(data.success){
            
            let study = data.study

            setBaseFen(study.basefen)
            loadFen(study.basefen)

            setName(study.name)
            let pgn = study.pgn
            setStudyPgn(pgn)
            // setPgn(pgn)
            console.log(pgn)
            //@ts-ignore
            if(pgn){
                let moves = parse(pgn, {startRule: "game"}).moves;
                setBaseMoveNumber(moves.length)
                console.log(moves)
                // setTimeout(() => {
                //     move(moves[0].notation.notation)
                // }, 1000);
            }
            
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
        // console.log(error)
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
            // console.log(error)
            return null;
        }
        setGame(tmp)
        setFen(fen)
        return;
    }

    const move = (move:string)=>{
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

    function setByInt(int:number,tmpPgn:string){
        console.log('a',int)

        console.log(tmpPgn)

        // @ts-ignore
        let moves = parse(tmpPgn, {startRule: "game"}).moves;
        console.log(int,tmpPgn)
        console.log(moves)

        if(int>moves.length||int<0){
            console.log('b')
            loadPgn(pgn)
        }else{
            setMoveInt(int)
            loadFen(baseFen)

            for (let i = 0; i < int; i++) {
                const myMove = moves[i];
                const notation = myMove.notation
                
                move(notation.notation)
            }

            // setPgn(game.pgn())

        }

    }

    const playAList = (array:Array<string>)=>{

        loadFen(baseFen)

        for(let item of array){

            // console.log(item)
            move(item)

        }

    }

    const setAMove = async (int:number)=>{
        setByInt(int,studyPgn)
    }

    const getLink = (parsed,pgn)=>{

        let tab = []
        
        if(pgn){
            for (let i = 0; i < parsed.length; i++) {
                const move = parsed[i];

                
                tab.push({str:move.notation.notation,int:i,variation:move.variations[0]?move.variations:false})
            }
        }

        return tab
        
    }

    const createBoucle = (parse:Array<Record<string,any>>,varInt:number,beforeVar:any,chemain:Array<string>,)=>{

        // console.log(chemain)
        let myNewChem = new Array()
        for(let itemTmp of chemain){
            myNewChem.push(itemTmp)
        }

        if(varInt==0){
            
            // setBaseMoveNumber(parse.length)
            // console.log()
        }else{
            myNewChem.pop()
        }

        return (
            <>
            {getLink(parse,studyPgn).map((item,i:number)=>{
                myNewChem.push(item.str)
                // console.log(item)
                return (
                    <div key={i} style={{marginTop:`${varInt*2}rem`}} className={`${styles.button_container} ${varInt===0?`${styles.first_btn}`:`${styles.no_first}`}`}>
                        <button type="aa" onClick={(e)=>{
                            if(varInt===0){
                                setByInt(item.int+1,studyPgn)
                            }else{
                                // let before
                                console.log(myNewChem)
                                playAList(myNewChem)
                                console.log(e.type)
                            }
                        }}>
                            {item.str} | {item.int} | {varInt} | {beforeVar.str}
                        </button>
                        {item.variation?(
                            <div className={styles.var_container} style={{height:`${item.variation.length*5}rem`}}>
                                {item.variation.map((item2,i2)=>(
                                    <div key={i2} className={styles.variation}>
                                        {createBoucle(item2,varInt+1,item,myNewChem)}
                                        {/* {getLink(item2,studyPgn).map((item3,i3)=>(
                                            <div key={i3}>
                                                <span>{item3.str}</span>
                                            </div>
                                        ))} */}
                                    </div>
                                ))}
                            </div>
                        ):``}
                    </div>
                )
            })}
            </>
        )

    }

  if(isRoomExist){
    
    return (
      <div className={styles.main}>
        
        <div className={styles.container}>

            <div style={{width:"40vw"}}>
                <Chessboard position={fen} onPieceDrop={onDrop} boardOrientation={orientation}/>
            </div>

            <div className={styles.moves} style={{height:`${(baseMoveNumber/2)*4}rem`}}>

                {createBoucle(studyPgn?parse(studyPgn, {startRule: "game"}).moves:``,0,"",[])}

            </div>

        </div>

        <Button onClick={()=>{
            console.log('moved')
            setAMove(moveInt-1)
        }}>Moin</Button>
        <Button onClick={()=>{
            console.log('moved')
            setAMove(moveInt+1)
        }}>Plus</Button>

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