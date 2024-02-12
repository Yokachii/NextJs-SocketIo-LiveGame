import Variant from "@/components/core/Variant"
import { parse } from "@mliebelt/pgn-parser"
import { Chess } from "chess.js";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import styles from './styles.module.scss'

export default function MyTest() {

    // USE STATE
    const [game, setGame] = useState(new Chess());
    const [boardPosition, setBoardPosition] = useState({actuel:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',base:`rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`})
    const [moveInt,setMoveInt] = useState(0)

    // CONST
    const pgn = `1. e4 c5 2. c3 d5 3. d3 e6 (3... f6) (3... g6 4. f3 (4. g4 f5 5. f3 h6) 4... f6 (4... f5) (4... e5))`
    const parseStudy = parse(pgn, {startRule: "game"}).moves




    //FUNCTION//

    function loadFen(fen:string){
        let tmpGame = game
        try {
            tmpGame.load(fen)
        } catch (error) {
            // console.log(error)
            return null;
        }
        setGame(tmpGame)
        setBoardPosition({actuel:fen,base:boardPosition.base})
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
        setBoardPosition({actuel:tmp.fen(),base:boardPosition.base})
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
            // console.log('b')
            // loadPgn(pgn)
        }else{
            setMoveInt(int)
            loadFen(boardPosition.base)

            for (let i = 0; i < int; i++) {
                const myMove = moves[i];
                const notation = myMove.notation
                
                move(notation.notation)
            }

            // setPgn(game.pgn())

        }

    }

    const playAList = (array:Array<string>)=>{

        loadFen(boardPosition.base)

        setTimeout(() => {
            for(let item of array){

                move(item)
    
            }
        }, 1000);

    }




    return (

        <div className={styles.container}>


            <div style={{width:"40vw"}}>
                <Chessboard position={boardPosition.actuel} boardOrientation={'white'}/>
            </div>

            
            <div className={styles.moves}>
                {
                    
                    parseStudy.map((item,i)=>{

                        const x = parseStudy.slice(0,i).map(({notation:{notation}})=>notation)
                        const x2 = [...x]
                        console.log(item)
                        console.log(x2)

                        return (
                            <div>
                                <Variant moveint={i} pgn={pgn} setByInt={setByInt} playAList={playAList} int={0} move={item.notation.notation} parent={x2} variants={item.variations}></Variant>
                            </div>
                        )
                    })
                }
            </div>

        </div>

    )
    
}