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
                    <button onClick={(e)=>{
                        if(varInt===0){
                            setByInt(item.int+1,studyPgn)
                        }else{
                            // let before
                            console.log(myNewChem)
                            playAList(myNewChem)
                            console.log(e.button.toString())
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

return (
    <div>
        {createBoucle(studyPgn?parse(studyPgn, {startRule: "game"}).moves:``,0,"",[])}
    </div>
)