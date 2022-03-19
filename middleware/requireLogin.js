const jwt=require("jsonwebtoken");
const mongoose=require('mongoose');
const User=mongoose.model("User");
const { JWT_SECRET } = require("../config/valuekeys");

module.exports=(req,res,next)=>{
    //accessing token from the header of the file
    const {authorization}=req.headers;
    if(!authorization){
        res.status(401).json({error:"You must be logged in"});
    }
    //removing the "Bearer" from the token string because by default browser sends "Bearer TOKEN" 
    const token=authorization.replace("Bearer ","");
    //authenticating token , payload here is the user for which the token is being generated
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"Authentication Failed"});
        }
        //this _id of payload is what we passed as argument when we created that login route
        const {_id}=payload;
        User.findById(_id).then(userData=>{
            req.user=userData;//here the .user variable is created by us and we can keep any name

            //moves the request response cycle to next action/middleware, we have included this inside 
            //our this block because we want our req.user to first fetch the data and than we want our
            //next to get executed 
            next();
        })
    })
}