import { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss'
import { UserInfo } from '@/types/data';

type Props = {
    
    user:UserInfo;
    
}

export default function User(props:Props){

    const { user } = props
    
    useEffect(()=>{

        
    },[])
    
    return(
        
        <div className={styles.main}>

            {user.firstname}

        </div>

    )

}