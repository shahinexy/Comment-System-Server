import { UserRole } from "@prisma/client";

export type TUser = {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  expirationOtp?: Date;
  otp?: number;
  verifiedEmail: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IUserFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};
