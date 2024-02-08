import AddLink from "@/components/core/Link/AddLink/main"
import LinksList from "@/components/core/Link/LinkList/main"
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

const Home = () => {

    let session = useSession()
    let user = session.data
    let id = user?.user?.id
    console.log(id)

    // const [link,setLink] = useState([])

    // async function LinkGen(){

    //     const response = await fetch('/api/user/getuser', {
    //         method: 'POST',
    //         body: JSON.stringify({id:`${id}`}),
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     })

    //     const responseData = await response.json();
    //     console.log(responseData)

    //     if(responseData.success){

    //         console.log(typeof JSON.parse(responseData.user.links))
    //         let dataObject = JSON.parse(responseData.user.links)

    //         setLink(JSON.parse(responseData.user.links))
    //     }


    // }

    // useEffect(()=>{

    //     LinkGen()
    // },[])
    
    // useEffect(()=>{
        
    
    //     // const responseData = await response.json();
    
    //     // if(responseData.success){
    //     //     // setData(data.user)
    //     //     if(responseData.user){
    //     //         setData(responseData.user.links)
    //     //     }
    //     // }else{
    
    //     // }
    // },[])

    return (
      <>
        {user?(
            <div>

                <div>
                    <span>Loged in as : {user?.user?.name}</span>
                    {/* {JSON.stringify(user)} */}
                </div>

                {/* <span>Stockage all your data</span> */}
                
                <AddLink id={id}></AddLink>
                <LinksList links={JSON.parse(user.user.links)}></LinksList>

            </div>
        ):(
            <div>Not loged in</div>
        )}
      </>
    );
}

export default Home;