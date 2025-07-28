import React, { useState } from 'react';
import { Product, FormData, FormErrors } from '../types';
import { ApiService } from '../services/api';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const isEditing = !!product;
  
  const [formData, setFormData] = useState<FormData>({
    title: product?.name || '',
    content: product?.description || '',
    phoneNumber: '',
    startDate: '',
    endDate: '',
    postingPeriodType: 'DAILY',
    isActive: true,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.imageKey ? `https://example.com/images/${product.imageKey}` : null
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageKey, setImageKey] = useState<string>(product?.imageKey || '');

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
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const uploadResponse = await ApiService.uploadImage(file);
      console.log('Upload response:', uploadResponse);
      
      // Extract imageUrl from the response structure
      const imageUrl = uploadResponse.imageUrl || uploadResponse.url || '';
      setImageKey(uploadResponse.key || '');
      setImagePreview(imageUrl);
      
      console.log('Image URL set:', imageUrl);
      console.log('Image Key set:', uploadResponse.key);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      setImageKey('');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check if image upload was successful
    if (!imageKey) {
      alert('Please upload an image');
      return;
    }

    try {
      // Create product data matching Swagger schema
      const productDataWithKey = {
        title: formData.title,
        content: `<p>${formData.content}</p>`, // Wrap content in <p> tags
        phoneNumber: formData.phoneNumber,
        startDate: formData.startDate,
        endDate: formData.endDate,
        postingPeriodType: formData.postingPeriodType,
        isActive: formData.isActive,
        productImageKey: imageKey, // Use productImageKey instead of key
        companyId: 'HaneulM', // Use correct companyId
      };

      // Also prepare with 'key' field as fallback
      const productDataWithKeyFallback = {
        title: formData.title,
        content: `<p>${formData.content}</p>`,
        phoneNumber: formData.phoneNumber,
        startDate: formData.startDate,
        endDate: formData.endDate,
        postingPeriodType: formData.postingPeriodType,
        isActive: formData.isActive,
        key: imageKey, // Fallback to 'key' field
        companyId: 'HaneulM', // Use correct companyId
      };

      // Log both request structures for debugging
      console.log('Creating product with "productImageKey" field:', productDataWithKey);
      console.log('Creating product with "key" field (fallback):', productDataWithKeyFallback);

      let result;
      // Try with 'productImageKey' field first (matches Swagger schema)
      try {
        result = await ApiService.createProductWithKey(productDataWithKey);
        console.log('Product creation successful with "productImageKey" field:', result);
      } catch (error: any) {
        console.log('Failed with "productImageKey" field, trying "key" field...');
        console.error('Error with "productImageKey" field:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        
        // If it fails with 'productImageKey', try with 'key'
        result = await ApiService.createProductWithKey(productDataWithKeyFallback);
        console.log('Product creation successful with "key" field:', result);
      }

      onSubmit(result);
    } catch (error: any) {
      console.error('Error creating product:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      alert('Error saving product. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {isEditing ? 'Edit Content' : 'Create New Content'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Content Field */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter content"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Phone Number Field */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter phone number"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Start Date Field */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.startDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        {/* End Date Field */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.endDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
          )}
        </div>

        {/* Posting Period Type Field */}
        <div>
          <label htmlFor="postingPeriodType" className="block text-sm font-medium text-gray-700 mb-2">
            Posting Period Type *
          </label>
          <select
            id="postingPeriodType"
            name="postingPeriodType"
            value={formData.postingPeriodType}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.postingPeriodType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
          {errors.postingPeriodType && (
            <p className="mt-1 text-sm text-red-600">{errors.postingPeriodType}</p>
          )}
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
              Active
            </label>
          </div>
          {errors.isActive && (
            <p className="mt-1 text-sm text-red-600">{errors.isActive}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Product Image *
          </label>
          <div className="space-y-4">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {uploadingImage && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Uploading image...</span>
              </div>
            )}
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || uploadingImage}
            className="px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || uploadingImage ? 'Saving...' : (isEditing ? 'Update Content' : 'Create Content')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 