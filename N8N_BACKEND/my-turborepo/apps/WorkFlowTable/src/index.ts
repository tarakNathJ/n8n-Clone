
import express, { type Request, type Response, type NextFunction } from "express";
import bodyParser from "body-parser";
import zlib from "zlib";
import cors from 'cors'
import { config } from "dotenv";
import WorkFlowRouter from './Router/WorkFlow.Router.js'

const app = express();


config();

app.use(cors())

app.use(bodyParser.json());



// declare module "express-serve-static-core" {
//   interface Request {
//     //@ts-ignore
//     body: any;
//   }
// }


// app.use((req: Request, res: Response, next: NextFunction) => {
//   const encoding = req.headers["content-encoding"];
//   console.log("data  encoding  :" ,encoding);

//   if (encoding === "gzip") {
//     const gunzip = zlib.createGunzip();
//     const buffer: Buffer[] = [];

//     req.pipe(gunzip);

//     gunzip.on("data", (chunk: Buffer) => buffer.push(chunk));


    
//     gunzip.on("end", () => {
//       try {
//         console.log("buffer is :" , buffer);
//         req.body = JSON.parse(Buffer.concat(buffer).toString());
//         console.log( "normal data : ", req.body)
//         next();
//       } catch (err) {
//         next(err);
//       }
//     });
//     gunzip.on("error", (err: Error) => next(err));
//   } else {
   
//     bodyParser.json()(req, res, next);
//   }
// });




// app.post("/data", (req: Request, res: Response) => {
//   console.log("Received JSON:", req.body);
//   res.json({ message: "Data received successfully!", received: req.body });
// });

app.use("/api",WorkFlowRouter)


app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on http://localhost:${process.env.PORT} `)
);
