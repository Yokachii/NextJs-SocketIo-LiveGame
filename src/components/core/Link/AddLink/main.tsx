// import User from "@/module/model/user";

import { useEffect, useState } from "react";

const AddLink = (id:string) => {

    const [link,setLink] = useState("")
    const [desc,setDesc] = useState("")

    async function submit(){

        
        const response = await fetch('/api/user/addLink', {
            method: 'POST',
            body: JSON.stringify({link,desc,id:id.id}),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if(data.success){

        }else{

        }

        console.log(data)
    }

    return (
      <>
        {/* TEST */}
        {/* {data.map((item,i) => (
            <div key={i}>{item}</div>
        ))} */}
        <div>
            <input type="text" onChange={(e)=>{setLink(e.target.value)}}/>
            <input type="text" onChange={(e)=>{setDesc(e.target.value)}}/>
            <button onClick={()=>{submit()}}>Submit</button>
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

export default AddLink;