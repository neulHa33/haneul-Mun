import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { ApiService } from '../services/api';

const Contents: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.getProducts();
      if (Array.isArray(response?.data?.items)) {
        setProducts(response.data.items);
      } else {
        console.warn('getProducts returned unexpected structure:', response);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: '다른 상품',
          content: '데모용 다른 샘플 상품입니다.',
          phoneNumber: '010-9876-5432',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          postingPeriodType: 'PERMANENT',
          isActive: true,
          logoImageKey: '',
          productImageKey: '',
          companyId: '89d2e726-383e-448d-ba26-70fb7f77c6c3',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('이 상품을 삭제하시겠습니까?')) {
      try {
        await ApiService.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleRowClick = (productId: string) => {
    navigate(`/contents/${productId}`);
  };

  // Safe array checks
  const productsArray = Array.isArray(products) ? products : [];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productsArray.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productsArray.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">콘텐츠</h2>
        <Link
          to="/contents/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          상품 추가
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상품
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  카테고리
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  생성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((product) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(product.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          {product.productImageKey || product.imageKey ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={`http://www.braincoach.kr/images/${product.productImageKey || product.imageKey}`}
                              alt={product.title || product.name || '상품'}
                            />
                          ) : (
                            <span className="text-gray-500">📦</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.title || product.name || '이름 없는 상품'}</div>
                        <div
                          className="text-sm text-gray-500 truncate max-w-xs"
                          dangerouslySetInnerHTML={{ __html: product.content || '설명 없음' }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.postingPeriodType || '분류 없음'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₩{(product.price ?? 0).toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString('ko-KR') : '날짜 없음'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/contents/${product.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        수정
                      </Link>
                      <button
                        onClick={(e) => handleDeleteProduct(product.id, e)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{indexOfFirstItem + 1}</span>부터{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, productsArray.length)}
                  </span>까지{' '}
                  총 <span className="font-medium">{productsArray.length}</span>개 결과
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contents; 