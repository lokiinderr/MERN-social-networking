const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post=mongoose.model("Post");
const User=mongoose.model("User");

router.get('/user/:id', requireLogin, (req,res)=>{
    User.findOne({_id:req.params.id})
    //password gets removed from the data which we are sending
    .select('-password')
    .then(user=>{
        //finding all the posts posted by that particular user
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                res.json({user,posts})
            }
        })
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        //we are receiving the id of account we want to follow, and than in his followers we are adding our id
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            //now adding the user to our following list
            User.findByIdAndUpdate(req.user._id,{
                $push:{following:req.body.followId}
            },{
                new:true
            }).select("-password").then(result=>{
                res.json(result)
            }).catch(err=>{
                return res.status(422).json({error:err})
            })
        }
    })
})

//everything in the code remains same as of follow, its just at the place of push we are
//writting pull in unfollow route
router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        //we are receiving the id of account we want to follow, and than in his followers we are adding our id
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            //now adding the user to our following list
            User.findByIdAndUpdate(req.user._id,{
                $pull:{following:req.body.followId}
            },{
                new:true
            }).select("-password").then(result=>{
                res.json(result)
            }).catch(err=>{
                return res.status(422).json({error:err})
            })
        }
    })
})

module.exports=router;