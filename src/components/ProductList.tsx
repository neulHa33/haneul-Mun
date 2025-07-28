import React from 'react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  isLoading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onEditProduct,
  onDeleteProduct,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">상품을 불러오는 중...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">상품을 찾을 수 없습니다</div>
        <div className="text-gray-400">첫 번째 상품을 생성하여 시작하세요</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Product Image */}
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            {product.imageKey ? (
              <img
                src={`https://example.com/images/${product.imageKey}`}
                alt={product.name || '상품'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className="text-gray-400 text-center hidden">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-sm">이미지 없음</div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {product.title || product.name || '이름 없는 상품'}
              </h3>
              <span className="text-lg font-bold text-blue-600">
                ₩{(product.price ?? 0).toFixed(0)}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {(product.content || product.description || '설명 없음').replace(/<[^>]*>/g, '')}
            </p>

            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {product.postingPeriodType || product.category || '분류 없음'}
              </span>

              <div className="flex space-x-2">
                <button
                  onClick={() => onEditProduct(product)}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-400">
              생성일: {product.createdAt ? new Date(product.createdAt).toLocaleDateString('ko-KR') : '날짜 없음'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList; 