import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss'
import { UserInfo } from '@/types/data';
import Link from 'next/link';
import { Button } from '@mantine/core';

type Props = {
    
    user:UserInfo;
    friend:UserInfo;
    
}

export default function User(props:Props){

    const { user,friend } = props

    const addFriend = async () => {
        // console.log(studyid)
        const response = await fetch('/api/chess/createfriend', {
            method: 'POST',
            body: JSON.stringify({user1Id:user?.id,user2Id:friend?.id}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        console.log(data)
        
        if(data.success){

            let users = data.user

        }else{

        }
    }
    
    useEffect(()=>{

        
    },[])
    
    return(
            
        <div className={styles.main}>

            <Link href={`/chess/users/${friend.id}`}>{friend.firstname}</Link>

            <Button onClick={()=>{addFriend()}}>Ajouter</Button>
    
        </div>
    
    )

    


}