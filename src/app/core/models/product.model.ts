// Subcategory interface
interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

// Category interface
interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

// Brand interface
interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

// Product interface
export interface Product {
  sold: number;
  images: string[];
  subcategory: Subcategory[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number; 
  imageCover: string;
  category: Category;
  brand: Brand;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

