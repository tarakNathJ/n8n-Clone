import { Prisma } from '@prisma/client/extension';
import { PrismaClient } from '../../../DataBase/generated/prisma/index.js'
import type { Request, Response } from 'express'
import { config } from 'dotenv';

const prisma = new PrismaClient();


config();

export const createWorkFlow = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "full fill  all required filed"
            })
        }
        const findUserAreExitOrNot = await prisma.User.findUnique({
            where: {
                email: email
            }

        })

        if (!findUserAreExitOrNot) {
            return res.status(400).json({
                success: false,
                message: "this User are not exit "

            })

        }

        const findWorkflowAreExistOrNot = await prisma.WorkFlow.findUnique({
            where: { name: name },
        });



        if (findWorkflowAreExistOrNot) {
            return res.status(400).json({
                success: false,
                message: "this name all ready exit "

            })

        }

        const CreateWorkFlow = await prisma.WorkFlow.create({
            data: {
                name: name,
                createAt: new Date(),
                userId: findUserAreExitOrNot.id
            }
        })

        if (!CreateWorkFlow) {
            return res.status(400).json({
                success: false,
                message: "server are very  busy"
            })

        }

        return res.status(200).json({
            success: true,
            message: "success fully create wark flow",
            data: {
                name: CreateWorkFlow.name,
                id: CreateWorkFlow.id,

            }
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            meassage: "samthing error on create workflow controller"
        })
    }
}



export const getAllWorkFlow = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "full fill  all required filed"
            })
        }
        const findUserAreExitOrNot = await prisma.User.findUnique({
            where: {
                email: email
            }

        })

        if (!findUserAreExitOrNot) {
            return res.status(400).json({
                success: false,
                message: "this User are not exit "

            })

        }

        const findWorkflowAreExistOrNot = await prisma.WorkFlow.findMany({
            where: {
                userId: findUserAreExitOrNot.id
            }
        })

        return res.status(200).json({
            success: true,
            meassage: "success fully fetch all data",
            data: findWorkflowAreExistOrNot
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            meassage: "samthing error on get workflow controller"
        })
    }
}



export const createStaps = async (req: Request, res: Response) => {
    try {
        const { email, workflowId, batchOfdata } = req.body;
        if (!email || !workflowId) {
            return res.status(400).json({
                success: false,
                message: "full fill  all required filed"
            })

        }

        if (batchOfdata.length == 0) {
            return res.status(400).json({
                success: false,
                message: "invalid data"

            })
        }





        const findUserAreExitOrNot = await prisma.User.findUnique({
            where: {
                email: email
            }

        })


        if (!findUserAreExitOrNot) {
            return res.status(400).json({
                success: false,
                message: "this User are not exit "

            })

        }


        const findWorkFlowAreExitOrNot = await prisma.WorkFlow.findUnique({
            where: {
                id: workflowId
            }
        })


        if (!findWorkFlowAreExitOrNot) {
            return res.status(400).json({
                success: false,
                message: "this work flow are not exit "

            })

        }





        batchOfdata.map((_stapes: any) => {
            if (_stapes.app == "WebHook") {
                _stapes.metadata.URL = `${process.env.WEB_HOOK_URL}/${findUserAreExitOrNot.id}/${findWorkFlowAreExitOrNot.id}`
            }
            
            _stapes.userId =findUserAreExitOrNot.id;
            _stapes.createdAt = new Date();
            _stapes.workflowId = findWorkFlowAreExitOrNot.id

        })

        
        console.log(batchOfdata);
        const StoreData = await prisma.Staps.createMany({
            data: batchOfdata
        })
       

        /**
         *            name: name,
                   userId: findUserAreExitOrNot.id,
                   index: parseInt(index),
                   type: type,
                   app: app,
                    metadata: metadata,
                  createdAt: new Date(),
                  workflowId: findWorkFlowAreExitOrNot.id,
         */
        return res.status(200).json({
            success: true,
            message: "your staps are create",
            // data: StoreData.name

        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            meassage: "getAllWorkFlow"
        })

    }
}




export const HookCall = async (req: Request, res: Response) => {
    try {
        const { userId, workFlowID } = req.params;

        console.log(userId, workFlowID);
        const body = req.body;



        const findWorkFlow = await prisma.WorkFlow.findUnique({
            where: {
                id: Number(workFlowID)
            }
        })


        if (!findWorkFlow) {
            return res.status(400).json({
                success: false,
                message: "work flow are messing"
            })
        }

        if (!userId || !workFlowID) {
            return res.status(400).json({
                success: false,
                message: "messing Data"
            })

        }





        // console.log(ts)
        const storeData = await prisma.StapsRun.create({
            data: {
                WorkFlowId: findWorkFlow.id,
                metaData: body,
                createdAt: new Date()
            }

        })


        const addRecord = await prisma.OutBoxStapsRun.create({
            data: {
                StapsRunId: storeData.id,
                createdAt: new Date()
            }
        })





        return res.status(200).json({
            success: true,
            message: "webHook  Data reseve",
            storeData,
            addRecord
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            meassage: " server side error on   HookCall  controller"
        })
    }
}


