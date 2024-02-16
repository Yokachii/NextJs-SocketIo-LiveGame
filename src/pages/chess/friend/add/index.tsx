import { useEffect, useState } from "react";
import styles from './styles.module.scss'
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import Friends from "@/components/core/Friend";
import AddFriends from "@/components/core/Friend/AddList";
import { UserInfo } from "@/types/data";
import { GetServerSidePropsContext } from "next";

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

            let users = data.user[0]
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
    
                <AddFriends friends={finded} userId={user?.id}/>
    
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

export async function getServerSideProps(context:GetServerSidePropsContext) {
    const session = await getSession(context)
  
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }
    }else{
        
    }
  
    return {
      props: { session }
    }
}