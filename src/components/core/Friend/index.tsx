import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss'
import User from './User/index';
import { UserInfo } from '@/types/data'

type Props = {

    friends:Array<UserInfo>
    
}

export default function Friends(props:Props){

    const { friends } = props
    
    useEffect(()=>{

        
    },[])
    
    return(
        
        <div className={styles.main}>

            {friends.map((item,i)=>(

                <User user={item} key={i}/>

            ))}

        </div>

    )

}