export interface IMenuCategory {
  id: string;
  name: string;
  description: string;
  orderInMenu: number;
  isActive: boolean;
  userId: string;
  createdAt: Date; // Creation date
  updatedAt: Date; // Last updated date
}
