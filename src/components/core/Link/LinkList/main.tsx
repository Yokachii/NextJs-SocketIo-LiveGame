"use client";
// import User from "@/module/model/user";

import { useEffect, useState } from "react";
import { CopyButton, Button } from "@mantine/core";

const LinksList = (links:any) => {

    // const [data,setData] = useState([])
    
    // async function test(){

        
    //     const response = await fetch('/api/user/getuser', {
    //         method: 'POST',
    //         body: JSON.stringify({id}),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });

    //     const responseData = await response.json();

    //     if(responseData.success){
    //         // setData(data.user)
    //         if(responseData.user){
    //             setData(responseData.user.links)
    //         }
    //     }else{

    //     }
    // }

    // test()

    // console.log(links)
    // console.log(links.links)

    let arrayLink = JSON.stringify(links.links)
    console.log(JSON.parse(arrayLink))
    console.log(typeof JSON.parse(arrayLink))
    console.log(links.links)
    
    // let arrayLink = JSON.parse(links)

    return (
      <>
        {/* TEST */}
        <div>
            
            {/* {da} */}
            {JSON.parse(arrayLink).map((item,i) => (
                <div key={i}>
                    
                    {/* <CopyButton value={item.link}>
                        {({ copied, copy }) => (
                            <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                            {copied ? 'Url copier' : 'Copier'}
                            </Button>
                        )}
                    </CopyButton> */}
                    
                    <a href={item.link}> <span>{item.desc}</span> </a>
                
                </div>
            ))}
            {/* <span>{JSON.stringify(data)}</span>
            <span>AA</span> */}
        </div>
        {/* {user?(
            <div>

                <div>
                    <span>Loged in as : {user?.user?.name}</span>
                </div>

                <span>Stockage all your data</span>
            </div>

        ):(
            <div>Not loged in</div>
        )} */}
      </>
    );
}

export default LinksList;