import { ReactionType } from "@prisma/client";
import { z } from "zod";

const PostValidationSchema = z.object({
  content: z.string().min(1),
});

const PostUpdateSchema = z.object({
  content: z.string().min(1).optional(),
});
const PostReactSchema = z.object({
  content: z.nativeEnum(ReactionType),
});

export const PostValidation = {
  PostValidationSchema,
  PostUpdateSchema,
  PostReactSchema,
};
