import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//imported for creating toast pop-up
import M from 'materialize-css';
import { UserContext } from '../../App';


export const Login = () => {
  //importing our context API so that we can use it
  const {state,dispatch}=useContext(UserContext);
  const history=useNavigate();
  const [email, setemail]=useState("");
  const [password,setpassword]=useState("");

  const PostData=()=>{
    //checking if email field contains a valid email address or not using regex
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html:"Please Enter A Valid Email", classes:"#c62828 red darken-3"})
        //clearing the email field if invalid email is written
        setemail("");
        //we return from this place only so that rest of the code is not executed and
        //invalid email user is not saved inside the database
        return;
    }
    //sending the data to server
    //fetch "/signup" the additional path which will be appended to the link which we pasted to the proxy
    fetch("/login",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(
        {
          email:email,
          password:password
        }
      )  
    }).then(res=>res.json()).then(data=>{
        if(data.error){
          M.toast({html:data.error,classes:"#c62828 red darken-3"})
        }
        else{
          //this case runs when we successfully log in
          //getting info about our jwt token and information about our user
          localStorage.setItem("jwt",data.token);
          localStorage.setItem("user",JSON.stringify(data.savedUser));
          //once we successfully sign in we pass our user data to our state
          dispatch({type:"USER",payload:data.savedUser});
          M.toast({html:"Signed In Successfully",classes:"#5c6bc0 indigo"})
          //redirecting to login page after we successfully sign up 
          history('/home')
          window.location.reload();
        }
      }).catch(err=>{
        console.log(err)
      })
  }
  return (
    <div>
    <div className='bg'></div>
    <div className='form'>
      <form>
        <h2>Log In</h2>
        <div className='input-box'>
          <i className='fa fa-user'></i>
          <input
          type="email"
          placeholder='Email'
          value={email}
          onChange={(event)=>{
            setemail(event.target.value);
          }}
          />
        </div>
        <div className='input-box'>
          <i className='fa fa-unlock-alt'></i>
          <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(event)=>{
            setpassword(event.target.value);
          }}
          />
        </div>
        <div className='input-box'>
        
        <input type="submit" name="action" value="Login"
        onClick={(e)=>{
          e.preventDefault();
          PostData();
        }}/>
        
        </div>
        No Account? <Link to="/signup">Click Here</Link>
      </form>
    </div>
    </div>
  )
}
