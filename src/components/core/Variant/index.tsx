import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss'

type Props = {
    move:string;
    parent:Array<string>;
    int:number;
    variants:Array<any>;
    setByInt:Function;
    playAList:Function;
    pgn:string;
    moveint:number;
}

export default function Variant(props:Props){

    const { move,parent,int,variants,setByInt,playAList,pgn,moveint } = props

    // const [myParent,setMyParent] = useState<Array<string>|null>()
    
    // const newParentWithoutLast = parent.slice(0,-1)
    const newParent = useMemo(()=>[...parent,move],[parent])
    // const newParent = parent
    console.log(newParent)
    
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
                    console.log('tesstttt')
                    console.log(parent)
                    playAList(newParent)
                }
            }}>
                {move}
            </button>
            <div className={styles.var_container}>
                {variants.map((moves)=>(
                    <>
                        {moves.map((variantMove)=>(
                            <div className={styles.variation}>
                                <Variant moveint={moveint+1} pgn={pgn} playAList={playAList} setByInt={setByInt} move={variantMove.notation.notation} parent={newParent} int={int+1} variants={variantMove.variations}></Variant>
                            </div>
                        ))} 
                    </>
                ))}
            </div>
        </div>

    )

}