import { useEffect, useState } from "react";
import styles from './styles.module.scss'
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Friends from "@/components/core/Friend";
import AddFriends from "@/components/core/Friend/AddList";
import { UserInfo } from "@/types/data";

export default function MyTest() {

    let session = useSession()
    let data = session.data
    let user = data?.user

    const [finded,setFinded] = useState([])

    // Hooks + Socket

    const searchFriend = async (name:string) => {
        // console.log(studyid)
        const response = await fetch('/api/chess/searchuser', {
            method: 'POST',
            body: JSON.stringify({name}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        console.log(data)
        
        if(data.success){

            let users = data.user
            setFinded(users)

        }else{

            // setFinded([])

        }
    }

    useEffect(()=>{
        console.log(user?.name)
        searchFriend('')
    },[session])

    if(user?.id){
        
        return (
    
            <div className={styles.container}>
    
                <input onChange={(e)=>{searchFriend(e.target.value)}}></input>
    
                <AddFriends friends={finded} user={user}/>
    
            </div>
    
        )

    }else{

        return(
            <div>
                Need login
            </div>
        )

    }
    

    
}