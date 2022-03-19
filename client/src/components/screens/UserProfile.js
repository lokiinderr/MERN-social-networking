import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { UserContext } from '../../App';


export const UserProfile = () => {
  const {state,dispatch}=useContext(UserContext);
  const [userName, setuserName]=useState("");
  const [userEmail, setuserEmail]=useState("");
  const [posts, setposts]=useState([]);
  const [Prof, setProf] = useState({});
  const {userid} = useParams();
  const [showfollow, setShowfollow] = useState();
  const [pic, setPic] = useState("");

  useEffect(()=>{
    //setting our showfollow here because we need to initialise it when state is initialized
    setShowfollow(state?!state.following.includes(userid):true)
    fetch(`/user/${userid}`,{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      console.log(result);
      setuserName(result.user.name);
      setuserEmail(result.user.email);
      setposts(result.posts);
      setProf(result);
      setPic(result.user.pic);
    })
      
  },[])
   
  const followUser=()=>{
    fetch('/follow',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        //user id here is the id which we got from the params
        followId:userid
      })
    }).then(res=>res.json())
    .then(data=>{
      //updating the followers and following list in our context API
      dispatch({type:"UPDATE",payload:{followers:data.followers, following:data.following}})
      //updating with new value in localStorage
      localStorage.setItem("user",JSON.stringify(data));
      
      //we are just trying to update our result which we recieved earlier, which consisted user info, 
      //all the posts which that user had
      setProf((prevstate)=>{
        return{
          user:{
            ...prevstate,
            followers:[...prevstate.user.followers,data._id]
          }
        }
      })
      setShowfollow(false)
      window.location.reload();
    })
  }

  const unfollowUser=()=>{
    fetch('/unfollow',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        //user id here is the id which we got from the params
        followId:userid
      })
    }).then(res=>res.json())
    .then(data=>{
      //updating the followers and following list in our context API
      dispatch({type:"UPDATE",payload:{followers:data.followers, following:data.following}})
      //updating with new value in localStorage
      localStorage.setItem("user",JSON.stringify(data));
      
      //we are just trying to update our result which we recieved earlier, which consisted user info, 
      //all the posts which that user had
      
      setProf((prevstate)=>{
        const newFollower=prevstate.user.followers.filter(item=>item!=data._id)
        return{
          user:{
            ...prevstate,
            users:{
              ...prevstate.user,
              followers:newFollower
            }
          }
        }
      })
      //auto reloading the page once this unfollow function is executed
      setShowfollow(true)
      window.location.reload();
    })
  }


  return (
    <>
        {
            posts?
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
                  <img alt="User Profile Photo" style={{width:"120px", height:"120px",
                    borderRadius:"90px",
                    }}
                    src={pic}
                    />
                    
                    <p style={{
                      fontWeight:"700"
                    }}>{userName}</p>
                    <p style={{
                      fontWeight:"200"
                    }}>{userEmail}</p>
                
                </div>     
                 <div style={{
                   borderRight:"2px solid grey"
                 }}></div>
                <div style={{
                  marginTop:"15px",
                  
                }}>

                    <div style={{
                      marginLeft:"20px",
                      fontWeight:"600"
                    }}>
                    <p>{posts.length} Posts </p> 
                    
                    {/* we first check if our user is loaded or not */}
                    <p>{Prof.user===undefined?"N/A":(Prof.user.followers===undefined?"N/A":Prof.user.followers.length)} Followers</p>
                    <p>{Prof.user===undefined?"N/A":(Prof.user.following===undefined?"N/A":Prof.user.following.length)} Following</p>
                    
                    </div>
                  <div style={{
                    marginTop:"30px"
                  }}>
                    {/* checking if the state is loaded before we are accessing it */}
                    {!JSON.parse(localStorage.getItem("user")).following.includes(userid) && showfollow
                    ?
                    <button className="btn waves-effect waves-light #0d47a1 blue darken-3" style={{
                      borderRadius:"10px",
                      
                    }} type="submit" name="action"
                        onClick={()=>{
                          followUser();
                        }}>Follow
                          <i className="material-icons right">group_add</i>
                      </button>
                    :
                    <button className="btn waves-effect waves-light #ff57373 red" style={{
                      borderRadius:"10px",
                      
                    }} type="submit" name="action"
                        onClick={()=>{
                          unfollowUser();
                        }}>Unfollow
                          <i className="material-icons right">group</i>
                    </button>
                    }
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
                        posts.map(item=>{
                            return(
                            <img alt="User Uploaded Photo" className='item' src={item.url} 
                                key={item._id} style={{width:"200px", height:"200px", objectFit:"cover"}}
                            />
                            )
                        }).reverse()
                        }
                    </div>
                </div>


            :

            <h1>Loading Posts...</h1>

        }
    </>
  )
}
