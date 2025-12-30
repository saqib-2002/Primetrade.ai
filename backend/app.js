import express, { json } from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();
connectDB();
app.use(express(json));

app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});
