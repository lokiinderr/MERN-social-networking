import './App.css';
import { Navbar } from './components/Navbar';
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import { Home } from './components/screens/Home';
import { Login } from './components/screens/Login';
import { Signup } from './components/screens/Signup';
import { Profile } from './components/screens/Profile';
import { Createpost } from './components/screens/Createpost';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducers/userReducer';
import { UserProfile } from './components/screens/UserProfile';
import { SubscribedUserPosts } from './components/screens/SubscribedUserPosts';
import { Footer } from './components/Footer';

//creating context
export const UserContext=createContext();

//this a component but in the form of function rather than being a different component, used just to make code
//more clean by adding all the routes inside one component

const Routing=()=>{
  const history=useNavigate();
  const {state,dispatch}=useContext(UserContext);
  //using this useEffect we try to stay on profile page once logged in even after refreshing the page
  //and if we arent signed in we stay on login page even after refreshing the page
  
  useEffect(() => {
    const user=JSON.parse(localStorage.getItem("user"));
    if(user){
      //if we have the user information we call our action of context API
      dispatch({type:"USER",payload:user});
    }
    else{
      history("/login")
    }
  }, [])
  
  
  return(
    <>

      {window.location.pathname==="/login"||window.location.pathname==="/signup"?
      <Routes>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/signup" element={<Signup/>}/>
      </Routes>
      :
      <>
      
    <div id="page-container">
    <div id="content-wrap">
      <Navbar/>
      <Routes>  
        <Route exact path="/profile" element={<Profile/>}/>
        <Route exact path="/createpost" element={<Createpost/>}/>
        <Route path="/profile/:userid" element={<UserProfile/>}/>
        <Route exact path="/subpost" element={<SubscribedUserPosts/>}/>
        <Route exact path="/home" element={<Home/>}/>
      </Routes>
      </div>
      <footer id="footer"><Footer/></footer>
      </div>
      </>
      }
      
      </>
  )
}

function App() {
  //reducer for our context
  const [state,dispatch]=useReducer(reducer,initialState);
  return (
    <div>
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
        <Routing/>  
    </BrowserRouter>
    </UserContext.Provider>
    </div>
  );
}

export default App;
