import mongoose from "mongoose";

const categorySchema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        unique:true,
        required:true

    },
})

const categoryModel=mongoose.model("category",categorySchema);
export default categoryModel;