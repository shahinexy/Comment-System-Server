import { z } from "zod";

const PostValidationSchema = z.object({
  description: z.string().min(1),
});

const PostUpdateSchema = z.object({
  description: z.string().min(1).optional(),
});

export const PostValidation = {
  PostValidationSchema,
  PostUpdateSchema,
};
