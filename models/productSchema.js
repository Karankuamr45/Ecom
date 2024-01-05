import mongoose, { Schema } from "mongoose";

const postSchema=mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    category_name: {
        type: String,
        ref: 'category'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
   
})

const productModel=mongoose.model('product',postSchema);
export default productModel