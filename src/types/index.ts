export interface Product {
  id: string;
  title: string; // Changed from 'name' to 'title'
  content: string; // Changed from 'description' to 'content'
  phoneNumber: string;
  startDate: string;
  endDate: string;
  postingPeriodType: string; // Changed from 'category' to 'postingPeriodType'
  isActive: boolean;
  logoImageKey: string;
  productImageKey: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  // Keep legacy fields for backward compatibility
  name?: string;
  description?: string;
  price?: number;
  imageKey?: string;
  category?: string;
}

export interface CreateProductRequest {
  title: string;
  content: string;
  phoneNumber: string;
  startDate: string;
  endDate: string;
  postingPeriodType: string;
  isActive: boolean;
  logoImageKey: string;
  productImageKey: string;
  companyId: string;
}

export interface UpdateProductRequest {
  title?: string;
  content?: string;
  phoneNumber?: string;
  startDate?: string;
  endDate?: string;
  postingPeriodType?: string;
  isActive?: boolean;
  productImageKey?: string;
  key?: string;
  companyId?: string;
}

export interface ImageUploadResponse {
  imageKey: string;
  url: string;
  imageUrl?: string; // Add imageUrl field for API response
  key?: string; // Add key field for API response
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface FormData {
  title: string;
  content: string;
  phoneNumber: string;
  startDate: string;
  endDate: string;
  postingPeriodType: string;
  isActive: boolean;
}

export interface FormErrors {
  title?: string;
  content?: string;
  phoneNumber?: string;
  startDate?: string;
  endDate?: string;
  postingPeriodType?: string;
  isActive?: string;
} 