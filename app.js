const express=require('express');
const app=express();
const PORT=process.env.PORT||5000;
const mongoose=require('mongoose');
const { MONGOURI } = require('./config/valuekeys');


//connecting to mongoDB atlas, and checking if DB working properly or not
mongoose.connect(MONGOURI);
mongoose.connection.on("connected",()=>{
    console.log("DB Working");
})
mongoose.connection.on("error",()=>{
    console.log("DB Not Working");
})

//what ever is exported at last in the given file is imported here and we can directly use it here
require("./model/user");
require("./model/post")

//Middleware functions are functions that have access to
//the request object (req), the response object (res)
//and the next middleware function in the application's request-response cycle, and we use
//app.use(path, callback) to mount the middleware

//this middleware is used to retrieve json data from our post request
app.use(express.json());
//here we used routes property of express but we imported it from another files like authentication,post,user etc
app.use(require('./routes/authentication'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

//creating a middleware, makes are page to load until the next() command comes
/*
    const customMiddleWare=(req,res,next)=>{
    console.log("Middle Ware Started Working");
    next();
}

app.use(customMiddleWare);
*/
if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path=require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


app.listen(PORT,()=>{
    console.log("Server Started Successfully at",PORT);
})