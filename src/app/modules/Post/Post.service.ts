import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma, Post } from "@prisma/client";
import { PostSearchAbleFields } from "./Post.constant";
import { fileUploader } from "../../../helpers/fileUploader";
import { IPostFilterRequest, TPost } from "./Post.interface";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createPostIntoDb = async (
  payload: TPost,
  imageFile: any,
  userId: string
) => {
  const image = imageFile
    ? (await fileUploader.uploadToCloudinary(imageFile)).Location
    : "";
  const res = await prisma.post.create({ data: { ...payload, userId, image } });
  return res;
};

const getPostsFromDb = async (
  params: IPostFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.PostWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: PostSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.PostWhereInput = { AND: andConditions };

  const posts = await prisma.post.findMany({
    where: whereConditions,
    skip,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },

    select: {
      id: true,
      description: true,
      image: true,
      createdAt: true,
      user: { select: { fullName: true, image: true } },
      _count: { select: { postComments: true } },
      postReactions: { select: { reactionType: true } },
    },
  });

  const total = await prisma.post.count({
    where: whereConditions,
  });

  const result = posts.map((p) => ({
    id: p.id,
    description: p.description,
    image: p.image,
    user: p.user,
    likeCount: p.postReactions.filter((r) => r.reactionType === "LIKE").length,
    dislikeCount: p.postReactions.filter((r) => r.reactionType === "DISLIKE")
      .length,
    commentCount: p._count.postComments,
    createdAt: p.createdAt,
  }));

  if (params.filter === "mostLiked") {
    result.sort((a, b) => b.likeCount - a.likeCount);
  }

  if (params.filter === "mostDisliked") {
    result.sort((a, b) => b.dislikeCount - a.dislikeCount);
  }

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSinglePost = async (id: string) => {
  const res = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      description: true,
      image: true,
      createdAt: true,
      user: { select: { fullName: true, image: true } },
      _count: { select: { postComments: true } },
      postReactions: { select: { reactionType: true } },
    },
  });

  if (!res) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  return {
    id: res.id,
    description: res.description,
    image: res.image,
    user: res.user,
    likeCount: res.postReactions.filter((r) => r.reactionType === "LIKE")
      .length,
    dislikeCount: res.postReactions.filter((r) => r.reactionType === "DISLIKE")
      .length,
    commentCount: res._count.postComments,
    createdAt: res.createdAt,
  };
};

export const PostService = {
  createPostIntoDb,
  getPostsFromDb,
  getSinglePost,
};
