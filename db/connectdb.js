import mongoose from "mongoose";

const connectdb=async(DATABASE_URL)=>{
    try {
        const DATABASE_NAME={
            dbName:"ecom"
        }
       await mongoose.connect(DATABASE_URL,DATABASE_NAME);
       console.log("database connected of ecom node")

    } catch (error) {
        console.log(error.message)
    }
}

export default connectdb;