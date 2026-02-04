export interface IMenuDigital {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  badges: string[];
  isSuggestion: boolean;
  isCustomMenu: boolean;
  isAvailable: boolean;
  userId: string;
  createdAt: Date; // Creation date
  updatedAt: Date; // Last updated date
}
