import { useEffect, useState } from "react";
import styles from './styles.module.scss'
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import Friends from "@/components/core/Friend";
import AddFriends from "@/components/core/Friend/AddList";
import { GetServerSidePropsContext } from "next";

export default function MyTest() {

    let session = useSession()
    let data = session.data
    let user = data?.user
    let userId = user?.id

    const [finded,setFinded] = useState([])
    const [suggest,setSuggest] = useState([])

    // Hooks + Socket

    const searchFriend = async (name:string) => {
        // console.log(studyid)
        console.log('name bellow')
        console.log(name)
        const response = await fetch('/api/chess/searchfriend', {
            method: 'POST',
            body: JSON.stringify({userId:userId,name}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        // console.log(data)
        
        if(data.success){

            let users = data.user.user1Friends
            setFinded(users)

        }else{

            // setFinded([])

        }
    }

    const searchFriendAdd = async (name:string) => {
        // console.log(studyid)
        const response = await fetch('/api/chess/searchusernofriend', {
            method: 'POST',
            body: JSON.stringify({userId:userId,name}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        console.log(data)
        
        if(data.success){

            let users = data.user
            setSuggest(users)

        }else{

            // setFinded([])

        }
    }

    useEffect(()=>{
        searchFriend('');
        searchFriendAdd('')
        // searchFriend()
    },[session])

    if(user?.id){
        
        return (
    
            <div className={styles.container}>
    
                <input onChange={async (e)=>{
                    searchFriend(e.target.value); 
                    searchFriendAdd(e.target.value);
                    }}></input>
    
                <div>
                    <div>
                        Friends :
                        <Friends friends={finded} userId={userId}/>
                    </div>
                    <div>
                        Suggestion :
                        <AddFriends friends={suggest} userId={userId}/>
                    </div>
                </div>

                {/* {JSON.stringify(finded)} */}
    
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