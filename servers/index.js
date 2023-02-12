import express from "express";
import cors from "cors";
import env from "dotenv";
import connectToMongoDB from "./database.js";

import userRouter from "./Routes/User.js";
import todoRouter from "./Routes/Todo.js";

const app = express();
env.config();

// Some Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.disable('x-powered-by');

// Routers
app.use('/api/v1/users', userRouter);
app.use('/api/v1/todos', todoRouter);

// PORT
const PORT = process.env.PORT || 5000;

// DATABASE Connection & App Listening PORT
connectToMongoDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server Listening on http://localhost:${PORT}`);
    })
}).catch(()=>{
    console.log('Error Connecting to MongoDB...');
})