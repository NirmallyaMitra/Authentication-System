import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import dotenv from 'dotenv';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log("Sever Started Successfully on Port 3000.");
});