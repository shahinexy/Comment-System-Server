export interface IAdmin {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

export enum Role {
  ADMIN,
  USER,
}
