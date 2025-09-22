import { config } from "dotenv";

config()

export const allEnvVariable = {
    JWT_SECRET: process.env.JWT_SECRET || "superSecter",
    PORT: process.env.PORT,
    JWT_EXPIRES_IN :process.env.JWT_EXPIRES_IN || "24h"
}