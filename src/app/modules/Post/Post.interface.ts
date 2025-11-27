export type TPost = {
  id: string;
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IPostFilterRequest = {
  filter?: string | undefined;
  searchTerm?: string | undefined;
};
