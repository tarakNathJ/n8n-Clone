// import { PrismaClient } from "@prisma/client";
// import {PrismaClient} from '../generated/prisma/index.js'
// declare global {
//   var prisma: PrismaClient | undefined;
// }

// export const db =
//   global.prisma ||
//   new PrismaClient({
//     log: ["query", "error", "warn"],
//   });

// if (process.env.NODE_ENV !== "production") {
//   global.prisma = db;
// }

// // Make sure TypeScript treats this file as a module
// export {};




import { PrismaClient, TypeOfWork  ,StatusType ,Type} from '../generated/prisma/index.js';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma || new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;


export const  schemaType  : any = {
   TypeOfWork ,StatusType ,Type
}





