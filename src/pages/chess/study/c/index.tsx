import Variant from "@/components/core/Variant"
import { parse } from "@mliebelt/pgn-parser"
import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import styles from './styles.module.scss'

export default function MyTest() {

    // USE STATE
    const [game, setGame] = useState(new Chess());
    const [boardPosition, setBoardPosition] = useState({actuel:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',base:`rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`})
    const [moveInt,setMoveInt] = useState(0)
    const [lastArray,setLastArray] = useState<Array<string>>([])
    const [study,setStudy] = useState({parsed:[],pgn:``})
    
    
    
    // CONST
    const pgn = `1. e4 c5 2. c3 Nf6 { Nf6 est la ligne la plus jouer a tout les niveau } (2... d5 3. exd5 Qxd5 4. d4 Nc6 (4... Nf6 5. Nf3 e6 (5... Bg4 { [%cal Gb1d2,Gb8c6] }) 6. Na3 { Dans cette ligne on develope le cavalier en a3 pour jouer contre la dame noir qui a été déveloper trop tôt dans la partie } { [%csl Bf1][%cal Ba3c4,Bf1c4,Rc4e6,Ga3b5,Gb5c7,Rc7a8,Rc7e8] } 6... cxd4 7. Nb5 { [%csl Rc7][%cal Gb5c7,Rc7d5,Rc7e8] } 7... Bd6 (7... Na6 8. Nbxd4 Bc5 9. Be2) 8. Bc4 { On profite que la dame ai été déveloper trop tôt pour l'attaquer } { [%cal Rc4d5] } 8... Qxc4 (8... Qc5 9. b4 Qb6 10. Nxd6+ Qxd6) (8... Qe4+ 9. Be3 { [%cal Re3d4,Rd6e4,Rd6e8,Gb5d6] } 9... dxe3 (9... Bc5 10. Nc7+ Ke7 11. Nxd4 Nc6 12. O-O Nxd4 13. cxd4 Bd6 14. Nxa8) 10. Nxd6+ Ke7 11. Nxe4) 9. Nxd6+ Ke7 10. Nxc4) 5. Nf3 Bg4 6. Be2 cxd4 (6... e6 7. h3 Bh5 (7... Bxf3 8. Bxf3 Qd7 9. d5 exd5 10. Qxd5 Qxd5 11. Bxd5 Nf6 12. Bxc6+ bxc6 13. O-O) 8. g4 Bg6) 7. cxd4 e6) (2... e5 3. Nf3 Nc6 4. Bc4 Nf6 5. Ng5 d5 6. exd5 Nxd5 7. Qh5 g6 (7... Be7 8. Qxf7+ Kd7 9. Qxd5+ Kc7 10. Qxd8+ Bxd8 11. Ne6+ Kd7 12. Nxd8 Kxd8) 8. Qf3 Qxg5 9. Bxd5 Nd8) (2... Nc6 3. d4 (3. Nf3 e5 4. Bc4 Nf6 (4... h6 5. d4 cxd4 6. cxd4 exd4 (6... Bb4+ 7. Bd2 Bxd2+ (7... a5 8. d5 Nce7 (8... Bxd2+ 9. Qxd2 Nb4 (9... Nce7) 10. a3 Na6)) 8. Qxd2) 7. Nxd4 Nxd4 (7... Nf6 8. O-O) (7... Ne5 8. Bb3) 8. Qxd4 d6 9. Nc3) 5. Ng5) 3... cxd4 4. cxd4 e6 5. d5 exd5 6. exd5 Nb8 (6... Ne5) (6... Bb4+ 7. Nc3 Ne5) 7. d6) 3. e5 Nd5 4. Nf3! { Cf3, la ligne que je joue a l'heure actuelle et la meilleur je trouve } { [%cal Gd7d6,Ge7e6,Gb8c6] } (4. d4 cxd4 5. cxd4 (5. Nf3 dxc3 (5... e6 6. cxd4) (5... d6 6. Bc4 Nb6 (6... dxe5 7. Nxe5) 7. Bb3) (5... Nc6 6. Bc4 Nb6 7. Bb3 dxc3 (7... d6 8. Qe2 dxe5 (8... g6 9. O-O) 9. Nxe5) 8. Nxc3) 6. Qxd5) 5... d6 6. Nf3 (6. Bb5+ Bd7 7. Bc4 Nb6) 6... dxe5 7. dxe5 Nc6 8. Bc4 Ndb4 9. Qb3 e6 10. O-O Na5 11. Qa4+ Bd7 12. Bb5 Bxb5 13. Qxb5+ Nac6 14. Nc3 a6 15. Qc4 Qd3 16. Qg4 Qg6 17. Qxg6 hxg6) 4... Nc6 { Cc6 qui est la ligne la plus jouer par les noir } (4... d6 5. Bb5+ { On joue cette échec pour forcée le fou noir a allez en d7 } 5... Bd7 6. Bc4 { Puis on revien en c4 pour attaquer le cavalier et mettre notre fou en contact avec le piont f7 qui peux devenir une faiblaisse dans certain variante } 6... Nb6 7. Bxf7+ { sacrifice de fou assez piègeux pour les noir car il y a plusieur matt possible si il ne connaisse pas et on ne paire pas de matériel } 7... Kxf7 8. e6+ { fourchette fou/roi (raison pour la quelle on a pousser le fou noir a allez en d7) } 8... Kxe6 { si le roi prend on va } (8... Bxe6 9. Ng5+ { On fait une fourchette roi/fou avec le cavalier } 9... Kf6 10. Qf3+ { A noté que si les noir prennent encore une foi ce serais matt donc il peuvent soit bloquer du fou soit ce déplacer et allez en g6 } 10... Kxg5 (10... Kg6 11. Nxe6 Qc8 12. Nf4+ Kf7 13. O-O) (10... Bf5 11. g4 e6 12. Ne4+ Ke7 13. gxf5 exf5 14. Qxf5) 11. h4+ Kg6 12. h5+ Kh6 13. Qe3+ g5 14. Qxe6+ Kg7 15. h6#) 9. Ng5+ Kf6 10. Qf3+ { Les noir ne peuvent pas prendre le cavalier car il se ferais matter, Ff5 est donc forcée } 10... Kxg5 (10... Bf5 11. g4 { On pousse G4 pour jouer sur le clouage } 11... Kxg5 (11... e6 12. Ne4+ Ke7 13. gxf5 exf5 14. Qxf5 { Et cette position est a peux près égale mais avec des pièce blanche plus "active" et un roi noir faible })) 11. Qf7 g6 12. d3+ Kh5 13. h3 Bf5 14. g4+ Kh4 15. Nd2 Be4 16. dxe4 c4 17. Nf3#) (4... e6 5. d4 Nc6 (5... cxd4 6. cxd4 d6 7. Bc4 Nc6 (7... Be7) (7... Nb6 8. Bb3 dxe5 9. Nxe5 Nc6 10. Nxc6 bxc6) 8. O-O Nb6 9. Bb5 dxe5 10. Nxe5 Bd7 11. Nxd7 Qxd7 12. Nc3)) 5. Bc4 { On joue Fc4 pour chasser le cavalier } (5. d4 cxd4 6. cxd4 d6) 5... Nb6 6. Bb3 d5 (6... d6 7. exd6 Qxd6 { Cette variante transpose dans celle avec D5 }) (6... c4 7. Bc2 d6 (7... Qc7 8. O-O Nxe5 9. Nxe5 Qxe5 10. a4 d5 11. a5 Nd7 12. Re1 Qc7 13. Na3 Qxa5 14. d3 cxd3 15. Qxd3 e6 (15... a6 16. Nb5 Qb6 17. Bf4 Nc5) 16. Nb5 Qxa1 17. Nc7+ Kd8 18. Nxe6+ fxe6 19. Bg5+ Ke8 20. Rxa1)) 7. exd6 Qxd6 8. O-O { On joue petit roque pour mettre le roi en sécuritée et sortir de tout echec par la dame noi } 8... Be6 { Fe6 est la main line et la plus jouer a haut niveau car une des seul case viable pour le fou } (8... Bg4?? { Le coup Fg4 n'est pas possible } 9. Bxf7+ { On joue petit roque pour mettre le roi en sécuritée et sortir de tout echec par la dame noir } 9... Kxf7 10. Ng5+ Ke8 11. Qxg4) (8... e6 9. d4 Bd7 10. Re1 Be7 11. Nbd2 cxd4 12. Ne4 Qc7 13. Nxd4 Nxd4 14. Qxd4) (8... Bf5 9. d4 e6 10. Na3 Qd8 (10... Be7 11. Nb5 Qd8 12. dxc5 Bxc5)) (8... c4 { C4 est un coup assez logique, comme les blanc n'on pas vraiment de bonne case pour le fou blanc il chasse notre fou pour pouvoir jouer Fg4 sans problème tactique } 9. Bc2 Bg4 10. h3 Bh5 11. Re1 e6 (11... O-O-O 12. Be4)) 9. Bxe6 Qxe6 10. a4! { On joue a4 avec l'idée d'aller pousser a5,a6 sur tempo et crée une faiblesse a long terme pour les noir } { [%cal Ga4a5,Gb6d5,Ga5a6,Gb7b6] } 10... Qd7 { [%cal Ga4a5,Ga5a6,Ra5b6] } (10... Qd6 11. a5 Nc4 12. d4 { On peux jouer d4 et sacrifier le piont A5 } (12. a6 { Il est possible de pousser A6 pour crée encore une fois une faiblesse a long terme au noir }) 12... N4xa5 { Si les noir prennent le piont on vas obtenir une très bonne position } { [%cal Gd4d5,Rd5c6,Bc6a5,Ra8d8,Bd8d1,Gb1a3,Ga3b5,Ga3c4] } (12... cxd4 13. Qa4 Qd5 (13... Nxa5 14. Na3 a6 (14... dxc3 15. Nb5 Qd8 16. Bf4 Rc8 17. Nxa7 cxb2 18. Rad1 Qb6 19. Nxc8) 15. b4 b5 16. Nxb5 axb5 17. Qxb5 Nc4 (17... dxc3 18. bxa5) 18. Rxa8+) 14. cxd4 b5 15. axb6 Nxb6 16. Nc3 Nxa4 (16... Qd7 17. Qb3) 17. Nxd5 O-O-O) 13. d5 O-O-O (13... Nb8 14. Rxa5) 14. dxc6?? (14. c4 { On défend le piont d5 et si les noir prennent on vas avoir une position assez stable avec une bonne attaque } 14... b6 (14... Nxc4 15. Nc3 { [%cal Rd5c6] } 15... Qf6 { Les noir sont forcée de clouer le iont D pour défendre leur cavalier car il n'a pas vraiment de bonne case } (15... Nb4 16. Ng5 Qf6 17. Qg4+ e6 18. Qxc4)) 15. Nc3) 14... Qxd1 15. Rxd1 Rxd1+) 11. a5 Nd5 12. a6 { On a réussie a crée une faiblesse a long terme sur l'aile dame noir, si il pousse leur case blanche seront faible et si il prennent il créais deux piont isoler et active notre tour } 12... b6 (12... bxa6 13. Rxa6) 13. d4 { On prend le centre et avec d4 } (13. Na3 { Na3 est un coup qui arrive dans beaucoup de variante de l'alapine pour venir en B5 qui est actuellement une case plutot faible }) *`
    const parseStudy = parse(pgn, {startRule: "game"}).moves


    // Hooks + Socket

    useEffect(()=>{

    },[])

    //FUNCTION//

    function loadFen(fen:string){
        let tmpGame = game
        try {
            tmpGame.load(fen)
        } catch (error) {
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

        // @ts-ignore
        let moves = parse(tmpPgn, {startRule: "game"}).moves;
        
        if(int>moves.length||int<0){
        }else{
            setMoveInt(int)
            loadFen(boardPosition.base)

            let tmpArray = []

            for (let i = 0; i < int; i++) {
                const myMove = moves[i];
                const notation = myMove.notation

                tmpArray.push(notation.notation)
                
                move(notation.notation)
            }

            setLastArray(tmpArray)

        }

    }

    function playAList(array:Array<string>){
        
        let tmp1 = lastArray.join(` `)
        let tmp2 = array.join(` `)

        console.log('||||||')
        console.log(tmp1)
        console.log(tmp2)
        console.log(tmp2.startsWith(tmp1))
        console.log(array)
        console.log('||||||')

        if(tmp1===tmp2){
            console.log('not change')
            return
            loadFen(boardPosition.base)
        }

        if(tmp2.startsWith(tmp1)&&lastArray.length>0){

            let tmpArray = [...lastArray]
            tmpArray.splice(0,array.length)

            playAList(lastArray)

            
        }else if (tmp1.startsWith(tmp2)&&lastArray.length>0){

            // PEUX ÊTRE PLUS TARD (reculer dans les coup)

            loadFen(boardPosition.base)

        }else{
            loadFen(boardPosition.base)
        }
        

        setTimeout(() => {
            setLastArray(array)
            
            for(let item of array){

                move(item)
    
            }
        }, 100);

    }

    function onDrop(sourceSquare:any, targetSquare:any) {
        console.log('droped')
    }

    useEffect(()=>{
        console.log(parseStudy)
    },[])

    


    return (

        <div className={styles.container}>


            <div style={{width:"40vw"}}>
                <Chessboard position={boardPosition.actuel} boardOrientation={'white'} onPieceDrop={onDrop}/>
            </div>

            
            <div className={styles.moves}>
                {
                    
                    parseStudy.map((item,i)=>{

                        const x = parseStudy.slice(0,i).map(({notation:{notation}})=>notation)
                        const x2 = [...x]
                        return (
                            <div>
                                <Variant comment={item?.commentAfter?item.commentAfter:""} setByInt={setByInt} playeMoveList={playAList} moveint={i} pgn={pgn} int={0} move={item.notation.notation} parent={x2} variants={item.variations}></Variant>
                            </div>
                        )
                    })
                }
            </div>

        </div>

    )
    
}