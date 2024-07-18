//import part
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/config.js";
import userRouter from "./Routers/userRouter.js";

dotenv.config();
const app = express();

//middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//DB connection
connectDB();

//Default Routes
app.get("/", (req, res) => {
  res.status(200).send("Hi Welcome To Our App");
});

//API Routes
app.use("/api/user", userRouter);

//listening part
app.listen(process.env.PORT, () => {
  console.log("App is started and running on the Port");
});
