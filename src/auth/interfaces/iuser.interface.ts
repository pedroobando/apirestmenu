export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  active: boolean;
  role: string;
  createdAt: Date; // Creation date
  updatedAt: Date; // Last updated date
}
