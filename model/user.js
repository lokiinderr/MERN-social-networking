const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/lokindercloud/image/upload/v1647190228/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws_htlc2j.jpg"
    },
    following:[{
        type:ObjectId,
        ref:"User"
    }],
    followers:[{
        type:ObjectId,
        ref:"User"
    }]
})

module.exports=mongoose.model('User',userSchema);