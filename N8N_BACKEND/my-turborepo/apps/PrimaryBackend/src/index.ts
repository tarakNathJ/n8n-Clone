import express from "express"
import {config} from 'dotenv';
import cors from 'cors';
import bodyParser from "body-parser";
import authRouter from './Router/Auth.Router.js'
import typesRoute from './Router/CreateTypes.Route.js'



config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth",authRouter)
app.use("/api/auth",typesRoute)



app.listen(process.env.PORT,()=>{
    console.log(`server run at ${process.env.PORT}`)
})


