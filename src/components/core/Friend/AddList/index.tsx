import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss'
import User from '../User/index';
import { UserInfo } from '@/types/data'

type Props = {

    friends:Array<UserInfo>;
    userId:string|undefined;
    
}

export default function AddFriends(props:Props){

    const { friends,userId } = props
    
    useEffect(()=>{

        
    },[])
    
    if(!userId){
        return (
            <div>
                cant load
            </div>
        )
    }else{
        return(
        
            <div className={styles.main}>
    
                {friends.map((item,i)=>(
    
                    <User type={`add`} userId={userId} friend={item} key={i}/>
    
                ))}
    
            </div>
    
        )
    }

}