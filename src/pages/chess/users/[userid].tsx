import Variant from "@/components/core/Variant"
import { parse } from "@mliebelt/pgn-parser"
import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import styles from './styles.module.scss'
import { useRouter } from "next/router";
import { UserTypeWithRoom } from "@/types/data";

export default function MyTest() {

    const router = useRouter()
    const { userid } = router.query

    // USE STATE
    const [isUserExist,setIsUserExist] = useState(true)
    const [user,setUser] = useState<UserTypeWithRoom>({id:""})


    // Hooks + Socket

    const fetchUser = async () => {
        // console.log(studyid)
        const response = await fetch('/api/chess/getuserinfo', {
            method: 'POST',
            body: JSON.stringify({id:userid}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        console.log(data)
        
        if(data.success){
            

            setUser(data.user)


        }else{

            setIsUserExist(false)

        }
    }

    useEffect(()=>{
        if(!router.isReady) return;

        fetchUser()
    },[router.isReady])

    
    if(isUserExist){

        return (
    
            <div className={styles.container}>
                
                <div className={styles.info}>

                    <span>Name : {user.firstname}</span>

                </div>

                <div className={styles.game}>

                    <span>{JSON.stringify(user.rooms)}</span>

                </div>
    
            </div>
    
        )

    }else{

        return (
            <div>
                non
            </div>
        )

    }

    
}