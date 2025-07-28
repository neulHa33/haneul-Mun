import axios from 'axios';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ImageUploadResponse,
  ApiResponse,
} from '../types';
import { AuthService } from './auth';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://www.braincoach.kr',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create separate axios instance for file uploads
const uploadApi = axios.create({
  baseURL: 'http://www.braincoach.kr',
});

// Add Bearer token to all requests (api)
api.interceptors.request.use((config: any) => {
  const bearerToken = AuthService.getBearerToken();
  if (bearerToken && config.headers) {
    config.headers.Authorization = bearerToken;
    console.log('API request with Authorization header:', config.headers.Authorization);
  }

  console.log('API request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    params: config.params,
    data: config.data,
  });

  return config;
});

// Add Bearer token to upload requests only
uploadApi.interceptors.request.use((config: any) => {
  const bearerToken = AuthService.getBearerToken();
  if (bearerToken && config.headers) {
    config.headers.Authorization = bearerToken;
    console.log('Upload request with Authorization header:', config.headers.Authorization);
  }

  console.log('Upload request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    params: config.params,
  });

  return config;
});

// API Service class
export class ApiService {
  static async testApiConnection(): Promise<void> {
    try {
      const response = await api.get('/products');
      console.log('API connection successful:', response.data);
    } catch (error: any) {
      console.error('API connection failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
  }

  // Product endpoints
  static async getProducts(): Promise<any> {
    try {
      const response = await api.get('/products');
      const responseData = response.data as any;
      console.log('🔍 Full API response:', responseData);
      console.log('🔍 Response structure:', {
        success: responseData.success,
        hasData: !!responseData.data,
        hasItems: !!responseData.data?.items,
        itemsLength: responseData.data?.items?.length,
        firstItem: responseData.data?.items?.[0]
      });
      
      // Return the full response structure
      return responseData;
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: { items: [] } }; // Return empty structure on error
    }
  }

  static async getProduct(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  }

  static async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      console.log('Product by ID response:', response.data);
      return response.data as Product;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  static async createProduct(productData: CreateProductRequest): Promise<Product> {
    console.log('Creating product with request body:', productData);
    const response = await api.post<ApiResponse<Product>>('/products', productData);
    console.log('Product creation response:', response.data);
    return response.data.data;
  }

  static async createProductWithKey(productData: any): Promise<Product> {
    console.log('Creating product with "key" field:', productData);
    const response = await api.post<ApiResponse<Product>>('/products', productData);
    console.log('Product creation response with "key" field:', response.data);
    return response.data.data;
  }

  static async updateProduct(id: string, productData: UpdateProductRequest): Promise<Product> {
    try {
      const response = await api.put(`/products/${id}`, productData);
      console.log('Product update successful:', response.data);
      return response.data as Product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  }

  // ✅ Image upload endpoint (fixed!)
  static async uploadImage(file: File): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('image', file); // Only image, no companyId

      console.log('Uploading image with Bearer token:', AuthService.getBearerToken());
      console.log('FormData contents:', {
        image: file.name,
      });

      const response = await uploadApi.post<ApiResponse<ImageUploadResponse>>(
        '/products/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            companyId: 'HaneulM', // Use correct companyId
          },
        }
      );

      console.log('Upload response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Image upload error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config,
      });
      throw error;
    }
  }
}

export default api;
