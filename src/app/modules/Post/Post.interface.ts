export type TPost = {
  id: string;
  content: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IPostFilterRequest = {
  filter?: string | undefined;
  searchTerm?: string | undefined;
};

export type TComment = {
  id: string;
  description: string;
  createdAt: string;   
  updatedAt: string; 
  userId: string;
  postId: string;
};

export type ICommentFilterRequest = {
  searchTerm?: string | undefined;
};
