import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import JWT from 'jsonwebtoken'
import type { SignOptions } from "jsonwebtoken";
import { allEnvVariable } from "../constance.js"
import { prisma } from "@myorg/database";


export const signUpController = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "full fill all data",
            })
        }

        console.log("data ")

        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "email id are exist ,try anather email "
            })
        }


        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = await prisma.user.create({
            data: {

                name: name,
                email: email,
                password: hash,
                createdAt: new Date()
            },
        });


        const Payload = {
            name: user.name,
            email: user.email
        }

        const token = await JWT.sign(Payload as Object, allEnvVariable.JWT_SECRET as string, { expiresIn: allEnvVariable.JWT_EXPIRES_IN || "1h" } as SignOptions)


        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            Data: {
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            },
            token: token
        });
    } catch (error: any) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};


export const LoginController = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "full fill all requirment"
            })
        }


        const userAreExitOrNot = await prisma.user.findUnique({
            where: { email: email },
        })

        if (!userAreExitOrNot) {
            return res.status(400).json({
                success: false,
                message: "user are not exit"
            })
        }

        const chackPasswordRightOrWrong = await bcrypt.compare(password, userAreExitOrNot.password);
        if (chackPasswordRightOrWrong == false) {
            return res.status(400).json({
                success: false,
                message: "wrong password , try again"
            })
        }
        const Payload = {
            name: userAreExitOrNot.name,
            email: userAreExitOrNot.email
        }

        const token = await JWT.sign(Payload as Object, allEnvVariable.JWT_SECRET as string, { expiresIn: allEnvVariable.JWT_EXPIRES_IN || "1h" } as SignOptions)

        return res.status(200).json({
            success: true,
            message: "succeaa fully login",
            token: token,
            payload: Payload
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server side error"
        })

    }

}

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        if (!email || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "full fill all requirment"
            })
        }


        const userAreExitOrNot = await prisma.user.findUnique({
            where: { email: email },
        })

        if (!userAreExitOrNot) {
            return res.status(400).json({
                success: false,
                message: "user are not exit"
            })
        }

        const chackPasswordRightOrWrong = await bcrypt.compare(currentPassword, userAreExitOrNot.password);
        if (chackPasswordRightOrWrong == false) {
            return res.status(400).json({
                success: false,
                message: "wrong password , try again"
            })
        }


        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        const updatedUser = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password:hash,
            },
        });

        const Payload = {
            name: updatedUser.name,
            email: updatedUser.email
        }

        const token = await JWT.sign(Payload as Object, allEnvVariable.JWT_SECRET as string, { expiresIn: allEnvVariable.JWT_EXPIRES_IN || "1h" } as SignOptions)

        return res.status(200).json({
            success: true,
            message: "succeaa fully update password",
            token: token,
            payload: Payload
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server update Password error"
        })

    }
}