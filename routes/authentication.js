const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=mongoose.model('User');
const bcrypt=require('bcryptjs');
const JWT=require('jsonwebtoken');
const { JWT_SECRET } = require('../config/valuekeys');
const requireLogin = require('../middleware/requireLogin');


router.get('/', (req,res)=>{
    //redirect us to /home in every case
    //if we are loggedin we go to home else we go to /login if we aren't logged in 
    res.redirect("/home");
})

router.post('/signup', (req,res)=>{
    const {name, email, password, pic}=req.body;
    if(!name || !email || !password){
        return res.status(422).json({error:"Please give all required information"})
    }
    //finding email inside database
    User.findOne({email:email}).then((savedUser=>{
        //if found in DB savedUser callback function is triggered
        if(savedUser){
            return res.status(422).json({error:"User already exists with given Email"});
        }
        //hashing the password, the number here is used for inside working of salting which is used by algo
        bcrypt.hash(password,12).then(hashedPassword=>{
            //if not found inside DB we create a new user for our database
            const user = new User({
                name:name,
                email:email,
                //passing the hashedPassword to our database
                password:hashedPassword,
                pic:pic
            })
            //saving the user data inside our database
            user.save().then(user=>{
                return res.json({message:"User Saved Successfully"})
            }).catch(err=>{
                console.log(err);
            })
        })
        
    })).catch(err=>{
        console.log(err);
    })
})

//verifying the token
router.get('/protected', requireLogin,(req,res)=>{
    res.send("MiddleWare Successful Worked Token Authenticated");
})

router.post('/login', (req,res)=>{
    const {email, password}=req.body;
    if(!email || !password){
        res.status(422).json({error:"Please Fill Email/Password"});
    }
    User.findOne({email:email}).then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"User Not Found"});
        }
        // unencrpting the password using inbulit compare function of bcrypt
        bcrypt.compare(password,savedUser.password).then(doMatched=>{
            if(doMatched){
                // Generating the JWT token once the user credentials matches
                const token=JWT.sign({_id:savedUser._id},JWT_SECRET);
                // const {_id,name,email}=savedUser;
                //by writing res.json({XYZ,ABC}) we send our value to frontEnd
                res.json({token,savedUser});
            }
            else{
                return res.status(422).json({error:"Incorrect Email or Password"});
            }
        }).catch(err=>{
            console.log(err);
        })
    })
})


module.exports=router;