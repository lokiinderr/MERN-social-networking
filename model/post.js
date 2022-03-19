const mongoose = require('mongoose');
//we are destructuring the ObjectId from our mongoDB
const {ObjectId} = mongoose.Schema.Types;
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    likes:[{
        type:ObjectId,
        ref:"User"
    }],
    comments:[{
        text:String,
        name:String,
        postedBy:{
            type:ObjectId,
            ref:"User"
        }
    }],
    postedBy:{
        //here we get our ObjectId from .Types(), and we relate it with our ref "User" model, i.e.
        //we receive this objectid and we check for it in "User"
        type:ObjectId,
        ref:"User"
    }
})

module.exports=mongoose.model('Post',postSchema);