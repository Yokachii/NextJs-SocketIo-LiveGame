import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss'

type Props = {
    move:string;
    parent:Array<string>;
    int:number;
    variants:Array<any>;
    setByInt:Function;
    playeMoveList:Function;
    pgn:string;
    moveint:number;
    comment:string;
}

export default function Variant(props:Props){

    const { move,parent,int,variants,pgn,moveint,playeMoveList,setByInt,comment } = props

    // const [myParent,setMyParent] = useState<Array<string>|null>()
    
    // const newParentWithoutLast = parent.slice(0,-1)
    // const newParent = useMemo(()=>[...parent,move],[parent])
    // // const newParent = parent
    // console.log(newParent)

    // console.log(move)
    // console.log(parent)
    
    useEffect(()=>{

        // if(!parent) return;

        // const tmp = Array.from(parent)
        // tmp.push(move)
        // setMyParent(tmp)

        
    },[move,parent])

    // if(!myParent) return (
    //     <></>
    // )
    
    return(
        
        <div className={`${styles.button_container}`} style={{marginLeft:`${int>0?`${int*2}rem`:`0rem`}`}}>
            <button onClick={(e)=>{
                // console.log(int)
                if(int===0){
                    setByInt(moveint+1,pgn)
                }else{
                    playeMoveList([...parent,move])
                    console.log(parent)
                }
            }}>
                {move}
            </button>

            {comment?(
                <div className={styles.comment}>

                    {comment?comment:``}

                </div>
            ):``}
            <div className={styles.var_container}>
                {variants.map((moves)=>(
                    <>
                        {moves.map((variantMove,i)=>{

                            const shad = [...moves]
                            const tmp2 = shad.splice(0,i).map(({notation:{notation}})=>notation)

                            return (
                                <div className={`${styles.variation} ${styles.aMoveRaw}`}>
                                    <Variant comment={variantMove?.commentAfter?variantMove?.commentAfter:''}  moveint={moveint+1} playeMoveList={playeMoveList} setByInt={setByInt} pgn={pgn} move={variantMove.notation.notation} parent={parent.concat(tmp2)} int={int+1} variants={variantMove.variations}></Variant>
                                    {/* <Variant moveint={moveint+1} pgn={pgn} playAList={playAList} setByInt={setByInt} move={variantMove.notation.notation} parent={[...parent,move]} int={int+1} variants={variantMove.variations}></Variant> */}
                                </div>
                            )
                        })}
                    </>
                ))}
            </div>
        </div>

    )

}