import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//imported for creating toast pop-up
import M, { updateTextFields } from 'materialize-css';

export const Signup = () => {
  const history=useNavigate();
  const [name, setname]=useState("");
  const [email, setemail]=useState("");
  const [password,setpassword]=useState("");
  const [url, seturl] = useState(undefined);
  const [image, setimage] = useState("");

  useEffect(()=>{
    if(url){
      uploadFields()
    }
  },[url])

  const uploadPic=()=>{
    //this section is used for uploading the photo to cloudinary and generating url
    const data=new FormData();
    data.append("file",image);
    data.append("upload_preset","socialnetworking");
    data.append("cloud_name","lokindercloud")
    fetch('https://api.cloudinary.com/<YOUR CLOUDINARY API>',{
        method:"post",
        body:data
    }).then(res=>res.json())
    .then(data=>{
        seturl(data.url);
    }).catch(err=>{
        console.log(err)
    })
  }

  const uploadFields=()=>{
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
      fetch("/signup",{
        method:"post",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(
          {
            name:name,
            email:email,
            password:password,
            pic:url
          }
        )  
      }).then(res=>res.json()).then(data=>{
          if(data.error){
            M.toast({html:data.error,classes:"#c62828 red darken-3"})
          }
          else{
            M.toast({html:data.message,classes:"#5c6bc0 indigo"})
            //redirecting to login page after we successfully sign up 
            history('/login')
          }
        }).catch(err=>{
          console.log(err)
        })
  }

  const PostData=()=>{
    if(image){
      uploadPic()
    }else{
      uploadFields()
    }
  }
  return (
    <div>
    <div className='bg-signup'></div>
    <div className='form'>
      <form>
        <h2>Sign Up</h2>
        <div className='input-box'>
          <i className='fa fa-user-circle-o'></i>
          <input
          type="text"
          placeholder='Name'
          value={name}
          onChange={(event)=>{
            setname(event.target.value);
          }}
          />
          </div>
          <div className='input-box'>
          <i className='fa fa-envelope'></i>
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
          <i className='fa fa-key'></i>
          <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(event)=>{
            setpassword(event.target.value);
          }}
          />
        </div>
        
        <div className='file-field input-field'>
            <div style={{
              borderRadius:"13px"
            }} className="btn #5c6bc0 indigo ">
            <span>Upload DP</span>
                <input type="file"
                onChange={(e)=>{
                    setimage(e.target.files[0]);
                }}
                />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
        </div>
        
        <div className='input-box'>
        
        <input type="submit" name="action" value="Sign Up"
        onClick={(e)=>{
          e.preventDefault();
          PostData();
        }}/>
        
        </div>
        Existing User? <Link to="/login">Click Here</Link>
      </form>
    </div>
    </div>
  )
}
