import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss'
import User from './User/index';
import { UserInfo } from '@/types/data'

type Props = {

    friends:Array<UserInfo>
    userId:string;
    
}

export default function Friends(props:Props){

    const { friends,userId } = props
    
    useEffect(()=>{

        
    },[])
    
    return(
        
        <div className={styles.main}>

            {friends.map((item,i)=>(

                <User type={"allr"} friend={item} userId={userId} key={i}/>

            ))}

        </div>

    )

}