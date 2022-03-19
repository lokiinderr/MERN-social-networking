const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post=mongoose.model("Post");

// since we are using "requireLogin" middleware, all the process of that authentication used in the "user" 
// route will be followed here also and than after the work will be executed which we have written 
// inside our /createpost block
router.post('/createpost', requireLogin, (req,res)=>{
     const {title,body,url} = req.body;
     if(!title||!body||!url){
         return res.error(422).json({error:"No Title/Body/Photo"});
     }
     //we make our password undefined here so that when we pass our user's data to database collection of
     //post we technically hide our password from the collection where we actually dont need our 
     //password to be stored
     req.user.password=undefined;
     //here we get the information of our user from the token which we get from JWT, and we add this
     //token to Authorization field of header 
     const post = new Post({
         title:title,
         body:body,
         url:url,
         // this req.user we are getting from our middleware, this user is that user which is logged in
         // at that particular time 
         postedBy:req.user
     });
     post.save().then(result=>{
         //here result is a variable which contains what we are saving to our database
         res.json({post:result});
     }).catch(err=>{
         console.log(err);
     })
});

//all posts by any user are shown here
router.get('/myposts', requireLogin, (req,res)=>{
    //here we are finding the post which has req.user._id in its postedBy field
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")//only _id and name field are visible after populating
    .then(myPosts=>{
        res.json(myPosts)
    }).catch(err=>{
        console.log(err);
    })
})

//all posts overall are shown here
router.get('/allposts', requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy", "_id name")//only _id and name field are visible after populating
    .then(allPosts=>{
        res.json(allPosts)
    }).catch(err=>{
        console.log(err);
    })
})

//seeing the posts of users we are following
router.get('/getsubposts', requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id name")//only _id and name field are visible after populating
    .then(allPosts=>{
        res.json(allPosts)
    }).catch(err=>{
        console.log(err);
    })
})

//using put as we need to update the value of array repeatedly
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,
        {
            $push:{likes:req.user._id}
        },
        {
            new:true
        }).exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                return res.json(result)
            }
        })
})

//unlike
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
            $pull:{likes:req.user._id},
        },{
            new:true
        }).exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                res.json(result)
            }
        })
})

//adding the comment to any post
router.put('/comment',requireLogin,(req,res)=>{

    const comment={
        name:req.body.name,
        text:req.body.text,
        postedBy:req.user
    }

    Post.findByIdAndUpdate(req.body.postId,
        {
            $push:{comments:comment}
        },
        {
            new:true
        })
        .populate("postedBy","_id name")
        .populate("comments.postedBy","_id name")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                return res.json(result)
            }
        })
})

//deleting the post
router.delete('/deletepost/:postId', requireLogin, (req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err||!post){
            return res.status(422).json({error:err})
        }
        //this is the else condition
        //checking if the user trying to delete te post is the owner of the post or not
        if(post.postedBy._id.toString()===req.user._id.toString() || req.user._id=="623144eeb42752a45c8d3dcd"){
            post.remove()
            .then(result=>{
                res.json(result)
            })
            .catch(err=>{
                console.log(err);
            })
        }
        //if user trys to delete someone else post we show a error
        else{
            return res.status(422).json({error:"You Can Only Delete Your Post"})
        }
    })
})

module.exports=router;