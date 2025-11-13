import { Product } from "./product.interface";

export interface Wishlist {
  status: string;
  count: number;
  data: Product[];
}

