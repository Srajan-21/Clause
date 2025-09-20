import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`\n MongoDB connected !!`);
        console.log(` DB Host : ${connectionInstance.connection.host}`);
        console.log(` DB Name : ${connectionInstance.connection.name}`);
        console.log(` DB Ready State : ${connectionInstance.connection.readyState}`); // 1 = connected

    }catch(error){
        console.log("MONGO CONNECTION FAILED !!" ,error);
        process.exit(1);
    }
}

export default connectDB;