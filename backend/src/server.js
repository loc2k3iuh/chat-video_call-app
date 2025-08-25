import express from "express";
import dotenv from "dotenv";
import { ENV } from "./config/env.js";
dotenv.config();
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World !");
})
console.log("Mongo Uri: ", ENV.MONGO_URI);
app.listen(ENV.PORT, () => console.log("Server started on port:", ENV.PORT));
