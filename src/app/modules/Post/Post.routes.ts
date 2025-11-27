import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PostValidation } from "./Post.validation";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { PostController } from "./Post.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router
  .route("/")
  .get(PostController.getPosts)
  .post(
    auth(UserRole.USER),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(PostValidation.PostValidationSchema),
    PostController.createPost
  );

  router.route("/:id").get(auth(), PostController.getSinglePost)

export const PostRoutes = router;
