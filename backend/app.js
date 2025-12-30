import express, { json } from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express(json));

app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});
