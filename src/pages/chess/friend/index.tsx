import Variant from "@/components/core/Variant"
import { parse } from "@mliebelt/pgn-parser"
import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import styles from './styles.module.scss'
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Friends from "@/components/core/Friend";

type Arrow = Array<string>

export default function MyTest() {

    let session = useSession()
    let data = session.data
    let user = data?.user

    const [friends,setFriends] = useState([])

    // Hooks + Socket

    const fetchFriend = async () => {
        // console.log(studyid)
        const response = await fetch('/api/chess/getuserinfo', {
            method: 'POST',
            body: JSON.stringify({id:user?.id}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data2 = await response.json();
        
        console.log(data2)
    }

    useEffect(()=>{
        fetchFriend()
    },[session])

    
        return (
    
            <div className={styles.container}>

                <Friends friends={[]}/>
    
            </div>
    
        )

    
}