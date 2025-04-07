import React from 'react';
import { API_URL } from '../services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  specifications: Record<string, string>;
}

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto rounded-lg object-cover"
              />
              <div className="text-2xl font-bold text-blue-600">
                ${product.price.toLocaleString()}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Category
                </h3>
                <p className="text-gray-600">{product.category}</p>
              </div>

              {product.specifications &&
                Object.entries(product.specifications).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Specifications
                    </h3>
                    <dl className="grid grid-cols-1 gap-2">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <dt className="text-gray-600">{key}:</dt>
                            <dd className="text-gray-900 font-medium">
                              {value}
                            </dd>
                          </div>
                        )
                      )}
                    </dl>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
