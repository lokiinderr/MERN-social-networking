import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';

export const Profile = () => {
  const {state,dispatch}=useContext(UserContext);
  const [mypost, setmypost]=useState([]);
  useEffect(()=>{
    fetch('/myposts',{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      
      setmypost(result)
    })
  },[])
  return (
    <div style={{
              maxWidth:"750px",
              margin:"50px auto",
              background:"#FAF9F6",
              borderRadius:"25px",
              padding:"10px 10px 10px 10px",
    }}>
        <div style={{
            display:"flex",
            justifyContent:"space-evenly"
          }}>
          <div style={{
                 display:"block",
                 textAlign:"center",
                 marginTop:"10px",
               }}>
            <img alt="User Profile Photo" style={{width:"120px", height:"120px", borderRadius:"90px"}}
              src={state?state.pic:"Loading..."}
            />
            <p style={{
                      fontWeight:"700"
                    }}>{state?state.name:"Loading..."}</p>
                    <p style={{
                      fontWeight:"200"
                    }}>{state?state.email:"Loading..."}</p>
          </div>
          <div style={{
                   borderRight:"2px solid grey"
                 }}>

                 </div>
            <div style={{
                  marginTop:"15px",
                  
                }}>
                <div style={{
                      marginLeft:"20px",
                      marginTop:"52px",
                      fontWeight:"600",
                    }}>

                    <p>{mypost.length} Posts </p> 
                    
                    {/* we first check if our user is loaded or not */}
                   
              <p>{state==null?"N/A":(state.followers==null?"N/A":state.followers.length)} Followers</p>
              <p>{state==null?"N/A":(state.following==null?"N/A":state.following.length)} Following</p>
                    </div>
              
            </div>
          </div>
          <hr style={{
                      position: "relative",
                      top: "20px",
                      border: "none",
                      height: "3px",
                      background: "#585858",
                      marginBottom: "50px",
                    }}/>

        
        
        <div className='gallery'>
            {
              mypost.map(item=>{
                return(
                  <img alt="User Uploaded Photo" className='item' src={item.url} 
                    key={item._id} style={{
                      width:"200px", height:"200px", objectFit:"cover"
                    }}
                  />
                )
              }).reverse()
            }
          </div>
    </div>
  )
}
