import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss'
import User from './User/index';
import { UserInfo } from '@/types/data'

type Props = {

    friends:Array<UserInfo>;
    user:UserInfo
    
}

export default function AddFriends(props:Props){

    const { friends,user } = props
    
    useEffect(()=>{

        
    },[])
    
    return(
        
        <div className={styles.main}>

            {friends.map((item,i)=>(

                <User user={user} friend={item} key={i}/>

            ))}

        </div>

    )

}