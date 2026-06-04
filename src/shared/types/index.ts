// src/shared/types/index.ts

export type UserRole = 'customer' | 'admin';

export interface SizingMeasurements {
  chest: number;
  waist: number;
  blouse_length: number;
  shoulder: number;
  front_neck: number;
  back_neck: number;
  sleeve_length: number;
  sleeve_round: number;
  arm_hole: number;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  joined_date: string;
  notes?: string;
  measurements?: SizingMeasurements;
}

export type ProductCategory =
  | 'designer-blouses'
  | 'ready-made-dresses'
  | 'bridal-collections'
  | 'party-wear-dresses'
  | 'kids-dresses'
  | 'ethnic-wear'
  | 'aari-work-blouses'
  | 'maggam-work-collections'
  | 'sarees'
  | 'boutique-accessories';

export interface ProductReview {
  user: string;
  rating: number;
  text: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  discount: number;
  rating: number;
  description: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  fabric: string;
  delivery_days: number;
  stock: number;
  reviews: ProductReview[];
  created_at: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Measuring'
  | 'Cutting'
  | 'Embroidery'
  | 'Stitching'
  | 'Trial'
  | 'Completed';

export interface Order {
  id: string;
  customer_id?: string | null;
  customer_name: string;
  phone: string;
  stitching_item: string;
  neck_style?: string | null;
  sleeve_style?: string | null;
  embroidery_style?: string | null;
  fabric_notes?: string | null;
  cost: number;
  advance_paid: number;
  status: OrderStatus;
  order_date: string;
  due_date?: string | null;
  staff_assigned?: string | null;
  inspiration_image?: string | null;
  created_at: string;
}

export type AppointmentType =
  | 'Bridal Consultation'
  | 'Boutique Visit'
  | 'Home Measurement'
  | 'Trial Appointment';

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  user_id?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  date: string;
  time: string;
  type: AppointmentType;
  notes?: string | null;
  status: AppointmentStatus;
  created_at: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  orders_count: number;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  likes: number;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  address: string;
  created_at: string;
}
