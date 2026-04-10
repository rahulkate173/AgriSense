import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";
async function ConnectToDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Connected to DB')
    })
}
export default ConnectToDB