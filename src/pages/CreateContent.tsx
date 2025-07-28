import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateProductRequest, FormData, FormErrors } from '../types';
import { ApiService } from '../services/api';

const CreateContent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    phoneNumber: '',
    startDate: '',
    endDate: '',
    postingPeriodType: 'DAILY',
    isActive: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageKey, setImageKey] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목은 필수입니다';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용은 필수입니다';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = '전화번호는 필수입니다';
    }

    if (!formData.startDate) {
      newErrors.startDate = '시작일은 필수입니다';
    }

    if (!formData.endDate) {
      newErrors.endDate = '종료일은 필수입니다';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = '종료일은 시작일보다 늦어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: any = value;
    
    // Handle different input types
    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('유효한 이미지 파일을 선택해주세요');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB 이하여야 합니다');
      return;
    }

    setImageUploading(true);
    try {
      const uploadResponse = await ApiService.uploadImage(file);
      console.log('Upload response:', uploadResponse);
      
      // Extract imageUrl from the response structure
      const imageUrl = uploadResponse.imageUrl || uploadResponse.url || '';
      setImageKey(uploadResponse.key || ''); // Use 'key' instead of 'imageKey'
      setImageUrl(imageUrl);
      
      console.log('Image URL set:', imageUrl);
      console.log('Image Key set:', uploadResponse.key);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      // Clear any previous image data on error
      setImageKey('');
      setImageUrl('');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check if image upload was successful
    if (!imageKey || !imageUrl) {
      alert('상품 이미지를 업로드해주세요');
      return;
    }

    setIsLoading(true);
    try {
      // Create product data matching Swagger schema
      const productData = {
        title: formData.title,
        content: `<p>${formData.content}</p>`, // Wrap content in <p> tags
        phoneNumber: formData.phoneNumber,
        startDate: formData.startDate,
        endDate: formData.endDate,
        postingPeriodType: 'PERMANENT', // Set to PERMANENT as requested
        isActive: formData.isActive,
        logoImageKey: imageKey, // Add logoImageKey
        productImageKey: imageKey, // Use productImageKey
        companyId: '89d2e726-383e-448d-ba26-70fb7f77c6c3', // Use specific companyId
      };

      // Log the request structure for debugging
      console.log('Creating product with request data:', productData);

      const response = await ApiService.createProduct(productData);
      console.log('Product creation successful:', response);
      navigate('/contents');
    } catch (error: any) {
      console.error('Error creating product:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      console.error('❗️Full response error data:', error.response?.data);
      alert('상품 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/contents');
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">새 콘텐츠 생성</h2>
          <p className="text-gray-600 mt-1">새 콘텐츠 포스트를 추가하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="제목을 입력하세요"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Content Field */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              내용 *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="내용을 입력하세요"
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              전화번호 *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="전화번호를 입력하세요"
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>

          {/* Start Date Field */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              시작일 *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.startDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
          </div>

          {/* End Date Field */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              종료일 *
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.endDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          </div>

          {/* Posting Period Type Field */}
          <div>
            <label htmlFor="postingPeriodType" className="block text-sm font-medium text-gray-700 mb-2">
              게시 기간 유형 *
            </label>
            <select
              id="postingPeriodType"
              name="postingPeriodType"
              value={formData.postingPeriodType}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.postingPeriodType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="DAILY">일간</option>
              <option value="WEEKLY">주간</option>
              <option value="MONTHLY">월간</option>
            </select>
            {errors.postingPeriodType && <p className="mt-1 text-sm text-red-600">{errors.postingPeriodType}</p>}
          </div>

          {/* Is Active Field */}
          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                활성화
              </label>
            </div>
            {errors.isActive && <p className="mt-1 text-sm text-red-600">{errors.isActive}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              상품 이미지 *
            </label>
            <div className="space-y-4">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {imageUploading && (
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>이미지 업로드 중...</span>
                </div>
              )}
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="미리보기"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || imageUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '생성 중...' : '상품 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContent; 