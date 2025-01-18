import mongoose from "mongoose";
import "dotenv/config"

const connectToDatabase = async(): Promise<any> => {
    try{
        await mongoose.connect(process.env.MONGO_URI!, {});
        console.log("✅ Connected to MONGODB")
    }catch(error){
        console.error("❌ Failed to connect to MONGODB");
        process.exit(1);
    }
}

export default connectToDatabase;