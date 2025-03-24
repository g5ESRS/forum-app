import {z, ZodString} from "zod";

interface AuthSchema {
    email: ZodString,
    username: ZodString,
    password: ZodString,
}

export const authSchema: AuthSchema = {
    email: z.string().email(),
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(50),
}
