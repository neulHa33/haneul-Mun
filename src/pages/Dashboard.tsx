import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ApiService } from '../services/api';
import ProductList from '../components/ProductList';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    // Test API connection
    ApiService.testApiConnection();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.getProducts();
      if (Array.isArray(response?.data?.items)) {
        setProducts(response.data.items);
      } else {
        console.warn('getProducts returned unexpected structure:', response);
        // fallback to mock data
        setProducts([
          {
            id: '1',
            title: '샘플 상품',
            content: '데모용 샘플 상품입니다.',
            phoneNumber: '010-1234-5678',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            postingPeriodType: 'PERMANENT',
            isActive: true,
            logoImageKey: '',
            productImageKey: '',
            companyId: '89d2e726-383e-448d-ba26-70fb7f77c6c3',
            price: 29.99,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Do not set mock data; just clear products on error to avoid type mismatch
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    // Navigation will be handled by React Router
    console.log('Edit product:', product);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('이 상품을 삭제하시겠습니까?')) {
      try {
        await ApiService.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Safe array checks
  const productsArray = Array.isArray(products) ? products : [];
  const totalProducts = productsArray.length;
  const uniqueCategories = new Set(productsArray.map(p => p.postingPeriodType || p.category || '분류 없음')).size;
  const totalValue = productsArray.reduce((sum, p) => sum + (p.price ?? 0), 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">대시보드</h2>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">총 상품 수</h3>
          <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">카테고리</h3>
          <p className="text-3xl font-bold text-green-600">{uniqueCategories}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">총 가치</h3>
          <p className="text-3xl font-bold text-purple-600">
            ₩{totalValue.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">최근 상품</h3>
        </div>
        <div className="p-6">
          <ProductList
            products={productsArray.slice(0, 6)}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 