"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useRouter } from "next/router";
import io from 'Socket.IO-client'
import Link from "next/link";
import styles from './styles.module.scss'
import { useSession } from "next-auth/react";
import { Button } from "@mantine/core";
import { parse } from '@mliebelt/pgn-parser'
import Variant from "@/components/core/Variant";
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


    const tmp = useMemo(()=>studyPgn?parse(studyPgn, {startRule: "game"}).moves:[],[studyPgn])
    
    useEffect(()=>{
        // if(!tmp[0]) return;

        console.log(tmp.slice(0,5).map(({notation:{notation}})=>notation))

    },[tmp])
    

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
        
        if(data.success){
            
            let study = data.study

            let pgn = study.pgn
            setBaseFen(study.basefen)
            setStudyPgn(pgn)

            loadFen(study.basefen)
            
            // setName(study.name)
            // setPgn(pgn)
            //@ts-ignore
            if(pgn){
                let moves = parse(pgn, {startRule: "game"}).moves;
                setBaseMoveNumber(moves.length)
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
        // console.log('a',int)

        // console.log(tmpPgn)

        console.log('tesstttt')
        console.log(int)

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

        console.log(array)

        loadFen(baseFen)

        setTimeout(() => {
            for(let item of array){

                // console.log(item)
                move(item)
    
            }
        }, 1000);

    }

    const setAMove = async (int:number)=>{
        setByInt(int,studyPgn)
    }

    // const getLink = (parsed,pgn)=>{

    //     let tab = []
        
    //     if(pgn){
    //         for (let i = 0; i < parsed.length; i++) {
    //             const move = parsed[i];

                
    //             tab.push({str:move.notation.notation,int:i,variation:move.variations[0]?move.variations:false})
    //         }
    //     }

    //     return tab
        
    // }

    // const createBoucle = (parse:Array<Record<string,any>>,varInt:number,beforeVar:any,chemain:Array<string>,)=>{

    //     // console.log(parse)
    //     // return;

    //     // console.log(chemain)
    //     let myNewChem = new Array()
    //     for(let itemTmp of chemain){
    //         myNewChem.push(itemTmp)
    //     }

    //     if(varInt==0){
            
    //         // setBaseMoveNumber(parse.length)
    //         // console.log()
    //     }else{
    //         myNewChem.pop()
    //     }
        

    //     return (
    //         <>
    //         {getLink(parse,studyPgn).map((item,i:number)=>{
    //             myNewChem.push(item.str)
    //             return (
    //                 <div key={i} style={{marginTop:`${varInt*2}rem`}} className={`${styles.button_container} ${varInt===0?`${styles.first_btn}`:`${styles.no_first}`}`}>
    //                     <button onClick={(e)=>{
    //                         if(varInt===0){
    //                             setByInt(item.int+1,studyPgn)
    //                         }else{
    //                             // let before
    //                             // let myT
    //                             console.log(myNewChem)
    //                             playAList(myNewChem)
    //                         }
    //                     }}>
    //                         {item.str} | {item.int} | {varInt} | {beforeVar.str}
    //                     </button>
    //                     {item.variation?(
    //                         <div className={styles.var_container} style={{height:`${item.variation.length*5}rem`}}>
    //                             {item.variation.map((item2,i2)=>(
    //                                 <div key={i2} className={styles.variation}>
    //                                     {createBoucle(item2,varInt+1,item,myNewChem)}
    //                                     {/* {getLink(item2,studyPgn).map((item3,i3)=>(
    //                                         <div key={i3}>
    //                                             <span>{item3.str}</span>
    //                                         </div>
    //                                     ))} */}
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     ):``}
    //                 </div>
    //             )
    //         })}
    //         </>
    //     )

    // }

    // const mytest = (mymove:Record<string,any>)=>{

    //     if(!mymove.variations.length){

    //         return [mymove]

    //     }else{
            
    //         mymove.variations.map((item:any)=>{

    //             // return {...item,parent:}

    //         })
            
    //     }

    // }

  if(isRoomExist){

    
    
    return (
      <div className={styles.main}>
        
        <div className={styles.container}>

            <div style={{width:"40vw"}}>
                <Chessboard position={fen} onPieceDrop={onDrop} boardOrientation={orientation}/>
            </div>

            <div className={styles.moves} style={{height:`${(baseMoveNumber/2)*4}rem`}}>
                
                {
                    
                    tmp.map((item,i)=>{

                        const x = tmp.slice(0,i).map(({notation:{notation}})=>notation)
                        console.log('|||||||||||||||')
                        console.log(item.notation.notation)
                        console.log(x)
                        console.log('|||||||||||||||')

                        return (
                            <div>
                                <Variant moveint={i} pgn={studyPgn} setByInt={setByInt} playAList={playAList} int={0} move={item.notation.notation} parent={x} variants={item.variations}></Variant>
                            </div>
                        )
                    })
                }

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