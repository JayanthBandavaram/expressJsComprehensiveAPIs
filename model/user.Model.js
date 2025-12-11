import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true    
    },
    phone:{
        type:Number,
        required:true
    },
    password: { type: String, required: true }


})

export default mongoose.model('User',userSchema.index({ email: 1 }));
