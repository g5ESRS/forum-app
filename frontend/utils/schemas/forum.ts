import {z, ZodNumber, ZodString} from "zod";

interface TopicCreateSchema {
    title: ZodString,
    content: ZodString,
    category_ref: ZodString,
}

export const topicCreateSchema: TopicCreateSchema = {
    title: z.string().min(3).max(255),
    content: z.string().min(10).max(65535),
    category_ref: z.string().min(1),
}