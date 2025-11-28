import { z } from "zod";

const PostValidationSchema = z.object({
  content: z.string().min(1),
});

const PostUpdateSchema = z.object({
  content: z.string().min(1).optional(),
});


export const PostValidation = {
  PostValidationSchema,
  PostUpdateSchema,
};
