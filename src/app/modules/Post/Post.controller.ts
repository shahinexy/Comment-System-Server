import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PostService } from "./Post.service";
import pick from "../../../shared/pick";
import { PostFilterableFields } from "./Post.constant";

const createPost = catchAsync(async (req, res) => {
  const result = await PostService.createPostIntoDb(
    req.body,
    req.file,
    req.user.id
  );
  sendResponse(res, {
    message: "Post created successfully.",
    data: result,
  });
});

const getPosts = catchAsync(async (req, res) => {
  const filters = pick(req.query, PostFilterableFields);
  const result = await PostService.getPostsFromDb(filters, req.user.id);
  sendResponse(res, {
    message: "Posts retrieved successfully.",
    data: result,
  });
});

const allPosts = catchAsync(async (req, res) => {
  const filters = pick(req.query, PostFilterableFields);
  const result = await PostService.allPosts(filters);
  sendResponse(res, {
    message: "Posts retrieved successfully.",
    data: result,
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const result = await PostService.getSinglePost(req.params.id, req.user.id);
  sendResponse(res, {
    message: "Post retrieved successfully.",
    data: result,
  });
});

const postComments = catchAsync(async (req, res) => {
  const filters = pick(req.query, PostFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PostService.postComments(
    filters,
    options,
    req.params.id
  );
  sendResponse(res, {
    message: "Post comments retrieved successfully.",
    data: result,
  });
});

const commentReplies = catchAsync(async (req, res) => {
  const result = await PostService.commentReplies(req.params.id);
  sendResponse(res, {
    message: "Comment replies retrieved successfully.",
    data: result,
  });
});

const reactPost = catchAsync(async (req, res) => {
  const result = await PostService.reactPost(
    req.body,
    req.params.id,
    req.user.id
  );
  sendResponse(res, {
    message: "Post reacted success.",
    data: result,
  });
});

export const PostController = {
  createPost,
  getPosts,
  getSinglePost,
  allPosts,
  postComments,
  commentReplies,
  reactPost
};
