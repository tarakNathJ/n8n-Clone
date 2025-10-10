
import type { Request, Response } from "express";
import { prisma } from "@myorg/database";


export const createTrigger = async (req: Request, res: Response) => {

    try {
        const { name, key, imageUrl, metadata } = req.body;
        console.log(name, key, imageUrl, metadata)

        if (!name || !key || !imageUrl || !metadata) {
            return res.status(400).json({
                success: false,
                message: "full fill all  requirement"
            })
        }

        const ChacTriggerAllRadyExist = await prisma.avaliableTriger.findUnique({
            where: { name: name },
        })

        if (ChacTriggerAllRadyExist) {
            return res.status(400).json({
                success: false,
                message: "trigger  are all rady exist"
            })
        }

        const addTrigger = await prisma.avaliableTriger.create({
            data: {
                name: name,
                key: key,
                imageUrl: imageUrl,
                metadata: metadata,
                createdAt: new Date()
            }
        })



        return res.status(200).json({
            success: true,
            message: "successfully save data",
            addTrigger
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "error  in create triger controller "
        })
    }
}


export const createAction = async (req: Request, res: Response) => {

    try {
        const { name, key, imageUrl, metadata } = req.body;
        console.log(name, key, imageUrl, metadata)

        if (!name || !key || !imageUrl || !metadata) {
            return res.status(400).json({
                success: false,
                message: "full fill all  requirement"
            })
        }



        const ChacTriggerAllRadyExist = await prisma.avliableAction.findUnique({
            where: { name: name },
        })

        if (ChacTriggerAllRadyExist) {
            return res.status(400).json({
                success: false,
                message: "Action  are all rady exist"
            })
        }

        const addTrigger = await prisma.avliableAction.create({
            data: {
                name: name,
                key: key,
                imageUrl: imageUrl,
                metadata: metadata,
                createdAt: new Date()
            }
        })

        if (!addTrigger) {
            return res.status(400).json({
                success: false,
                message: "DataBase are vary bussy"
            })
        }


        return res.status(200).json({
            success: true,
            message: "successfully save data",
            addTrigger
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "error  in create Action controller "
        })
    }
}


export const getAllTrigger = async (req: Request, res: Response) => {
    try {
        const getAllTrigger = await prisma.avaliableTriger.findMany();
        if (!getAllTrigger) {
            return res.status(400).json({
                success: false,
                message: "Trigger are  not avaliable"
            })
        }
        return res.status(200).json({
            success: true,
            message: "all triggers",
            data: getAllTrigger
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "error  in get triger controller "
        })

    }
}

export const getAllAction = async (req: Request, res: Response) => {
    try {
        const getAllTrigger = await prisma.avliableAction.findMany();
        if (!getAllTrigger) {
            return res.status(400).json({
                success: false,
                message: "Action are  not avaliable"
            })
        }
        return res.status(200).json({
            success: true,
            message: "all Action",
            data: getAllTrigger
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "error  in get Action controller "
        })

    }
}