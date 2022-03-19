import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'

export const Navbar = () => {
  const {state,dispatch}=useContext(UserContext);
  const history=useNavigate();
  const renderList=()=>{
    if(state){
      return [
        <>
        <li className='list-item'><Link to="/home">Home</Link></li>
        <li className='list-item'><Link to="/subpost">Following Activity</Link></li>
        <li className='list-item'><Link to="/profile">My Profile</Link></li>
        <li className='list-item'><Link to="/createpost">Create Post</Link></li>
        <li className='list-item'><button
        className="waves-effect waves-light btn red" style={{
          borderRadius:"100px",
        }}
        onClick={()=>{
            localStorage.clear();
            dispatch({type:"CLEAR"});
            history('/login')
        }}
        ><i className='material-icons' style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "10px",
          height: "1px" 
        }}>power_settings_new</i>
        </button></li>
        </>
      ]
    }
    else{
      return [
        <>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        </>
      ]
    }
  }

  const renderListNew=()=>{
    if(state){
      return [
        <>
        <li className='list-item'><Link to="/home">Home</Link></li>
        <li className='list-item'><Link to="/subpost">Following Activity</Link></li>
        <li className='list-item'><Link to="/profile">My Profile</Link></li>
        <li className='list-item'><Link to="/createpost">Create Post</Link></li>
        <li className='list-item'><button
        className="waves-effect waves-light btn red" style={{
          borderRadius:"100px",
          marginLeft:"24px"
        }}
        onClick={()=>{
            localStorage.clear();
            dispatch({type:"CLEAR"});
            history('/login')
        }}
        >Log Out</button></li>
        </>
      ]
    }
    else{
      return [
        <>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        </>
      ]
    }
  }

  return (
    <>
    <nav className="nav-wrapper" style={{
      padding:"0px 10px",
      backgroundImage:"linear-gradient(to bottom right, dodgerblue, #333333)"
    }}>
    <div >
      {/* if state is empty we are always redirected to login page else we go to home page */}
      
      <Link to={state?"/home":"/login"} className="brand-logo left b"><span style={{
        fontWeight:"100"
      }}>Vibe</span><span style={{
        fontWeight:"650"
      }}>Ezzy</span></Link>
      
      <ul id="nav-mobile" className="right hide-on-med-and-down ">
        {renderList()}
      </ul>
      <Link to='#' className='sidenav-trigger' data-target="mobile-nav" style={{
        float:"right"
      }}>
        <i className='material-icons'>menu</i>
      </Link>
    </div>
  </nav>
    <ul className='sidenav' id="mobile-nav" style={{
      maxWidth:"200px",
      maxHeight:"260px"
    }}>
      {renderListNew()}
    </ul>
    </>
  )
}