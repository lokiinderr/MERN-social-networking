import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';
import M from 'materialize-css';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [data,setData]=useState([]);
  const {state}=useContext(UserContext);
  useEffect(()=>{
    fetch('/allposts',{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      setData(result);
    })
    
  },[])

  const likePost=(id)=>{
    fetch('/like',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    .then(result=>{
      // we are using map function to create a new array modified acc to our need,
      //here if the d of item is equal to result id we change that item with updated stats which 
      //present in the result and if id mismatch that means for that item no values have been changed
      //hence we return them as it is, is other words, data have 3 value = [1,2,3] and from our backend 
      //we receive the updated likes in variable result which has some id, and in data that id object 
      //exsits buts its value are not updated, so we replace that id object with result variable which
      //has updated values so after the map fucntion is executed the the new array has the updated values
      //for the object which had same the id as of object stored in result, this have the likes array's
      //length gets updated and we can see the updated like value
      const newData=data.map(item=>{
          if(item._id==result._id){
            return result;
          }
          else{
            return item;
          }
      })
      //setting the value of data with this newly updated array of post where the number of objectID in 
      //likes array is updated
      setData(newData);
    }).catch(err=>{
      console.log(err);
    })
  }

  const unlikePost=(id)=>{
    fetch('/unlike',{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    .then(result=>{
      // we are using map function to create a new array modified acc to our need,
      //here if the d of item is equal to result id we change that item with updated stats which 
      //present in the result and if id mismatch that means for that item no values have been changed
      //hence we return them as it is, is other words, data have 3 value = [1,2,3] and from our backend 
      //we receive the updated likes in variable result which has some id, and in data that id object 
      //exsits buts its value are not updated, so we replace that id object with result variable which
      //has updated values so after the map fucntion is executed the the new array has the updated values
      //for the object which had same the id as of object stored in result, this have the likes array's
      //length gets updated and we can see the updated like value
          const newData=data.map(item=>{
            if(item._id==result._id){
              return result;
            }
            else{
              return item;
            }
        })
    setData(newData);
    }).catch(err=>{
      console.log(err);
    })
  }

  const makeComment=(text,id)=>{
    
    fetch("/comment",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id,
        text:text,
        name:localStorage.getItem('user').name
      })
    }).then(res=>res.json())
    .then(result=>{
      
      const newData=data.map(item=>{
        if(item._id==result._id){
          return result;
        }
        else{
          return item;
        }
    })
    //setting the value of data with this newly updated array of post where the number of objectID in 
    //likes array is updated
    setData(newData);
    }).catch(err=>{
      console.log(err);
    })
  }

  const deletePost=(postId)=>{
    
    fetch(`/deletepost/${postId}`,{
      method:'delete',
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      if(result.error){
        return M.toast({html:"You Can Only Delete Your Post",classes:"#c62828 red darken-3"})
      }
      const newData=data.filter(item=>{
        return item._id!==result._id
      })
      setData(newData);
    })
  }


  return (
    <div className='home'>
    {/* mapping the post which we are recieving from our DB */}
    {data.map(item=>{
      return(
        <div className='card home-card' key={item._id}>
        <div style={{
          margin:"5px"
        }}>
        <h5><Link to={(item.postedBy._id!==state._id)?(`/profile/${item.postedBy._id}`):('/profile')}>{item.postedBy.name}</Link><Link to=""><i className='material-icons'
        onClick={()=>{
          deletePost(item._id);
        }} style={{float:"right"}}>delete</i></Link>
         </h5></div>
        <div className='card-image'>
          <img src={item.url} alt="User Uploaded Photo"/>
        </div>
        <div className='card-content'>
        <div className='like-section'>
        {/* if the state._id is present in likes we only show unlike button, state contains
        our currently logged in user informations */}
          {item.likes.includes(state._id)
          ?<Link to=""><i onClick={()=>{
            unlikePost(item._id);
            
          }} className='material-icons'>favorite</i></Link>
          :
          <Link to=""><i onClick={()=>{
            likePost(item._id);
            
          }}className='material-icons'>favorite_border</i></Link>
          
          }
          
          </div>
          
          <h6>{item.likes.length} Likes</h6>
          <h6 style={{
              fontWeight:"700"
            }}>{item.title}</h6>
          <p style={{
              
            }}>{"Description: "+item.body}</p>
            <h6 style={{
              fontWeight:"500"
            }}>Comment Section:</h6>
          {/* mapping our comments */}
          {
            item.comments.map(record=>{
              return(
                <h6 key={record._id}><span style={{
                  fontWeight:"600"
                }}>{record.postedBy.name}</span>
                 {" "+record.text}
                </h6>
              )
            })
          }
          {/* creating the comment section */}
          <form onSubmit={(e)=>{
            e.preventDefault()
            makeComment(e.target[0].value,item._id)
            //again setting the value to empty string
            e.target[0].value="";
          }}>
              <input type="text" placeholder='Add a Comment'/>
          </form>
        </div>
      </div>
      )
      ///this .reverse() at end helps our new post to render on top rather than at bottom(because it is 
      //added at the end of the array)
    }).reverse()}
    </div>
  )
}
