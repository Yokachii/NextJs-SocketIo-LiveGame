import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss'
import { UserInfo } from '@/types/data';
import Link from 'next/link';
import { Button } from '@mantine/core';

type Props = {
    
    userId:string;
    friend:UserInfo;
    type:string;
    
}

export default function User(props:Props){

    const { userId,friend,type } = props
    const [buttonState,setButtonState] = useState(`ready`)

    const addFriend = async () => {
        setButtonState(`load`)
        const response = await fetch('/api/chess/createfriend', {
            method: 'POST',
            body: JSON.stringify({user1Id:userId,user2Id:friend?.id}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        console.log(`data ddFriend bellow`)
        console.log(data)
        console.log(userId,friend)
        
        if(data.success){

            let users = data.user
            setButtonState("disabled")

        }else{

            setButtonState(`ready`)

        }
    }

    const removeFriend = async () => {
        setButtonState(`load`)
        const response = await fetch('/api/chess/deletefriend', {
            method: 'POST',
            body: JSON.stringify({user1Id:userId,user2Id:friend?.id}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        console.log(data)
        
        if(data.success){

            let users = data.user
            setButtonState("disabled")

        }else{

        }
    }
    
    useEffect(()=>{

        
    },[])
    
    return(
            
        <div className={styles.main}>

            <Link href={`/chess/users/${friend.id}`}>{friend.firstname}</Link>

            {type==="add"?(
                <Button data-disabled={buttonState=="disabled"} loading={buttonState==="load"} loaderProps={{ type: 'dots' }} onClick={()=>{addFriend()}}>Ajouter</Button>
            ):""}

            {type==="allr"?(
                <Button data-disabled={buttonState=="disabled"} loading={buttonState==="load"} loaderProps={{ type: 'dots' }} onClick={()=>{removeFriend()}}>{`Retirée l'ami(e)`}</Button>
            ):""}
            
    
        </div>
    
    )

    


}