import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import ProductForm from './ProductForm';

// Temporary mock data - replace with actual API call later
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Enterprise Software Solution',
    description:
      'Comprehensive software solution for large enterprises with advanced features and scalable architecture',
    price: 9999,
    image: 'https://picsum.photos/200/300',
  },
  {
    _id: '2',
    name: 'Cloud Migration Service',
    description: 'Seamless cloud migration and management',
    price: 5999,
    image: 'https://picsum.photos/200/300',
  },
  {
    _id: '3',
    name: 'Cybersecurity Package',
    description:
      'Advanced security solutions for your business with real-time threat detection and prevention',
    price: 7999,
    image: 'https://picsum.photos/200/300',
  },
  {
    _id: '4',
    name: 'AI Development Kit',
    description: 'Tools and frameworks for AI development',
    price: 4999,
    image: 'https://picsum.photos/200/300',
  },
  {
    _id: '5',
    name: 'Digital Transformation Package',
    description:
      'Complete digital transformation solution with comprehensive implementation and support',
    price: 12999,
    image: 'https://picsum.photos/200/300',
  },
  {
    _id: '6',
    name: 'IoT Platform',
    description: 'Comprehensive IoT development and management platform',
    price: 6999,
    image: 'https://picsum.photos/200/300',
  },
];

const ProductCard: React.FC<{
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  isSelected?: boolean;
  onSelect?: (product: Product) => void;
}> = ({ product, onEdit, onDelete, isSelected, onSelect }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 h-[350px] flex flex-col relative ${
        isSelected ? 'ring-2 ring-purple-500' : ''
      }`}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product)}
          className="absolute top-4 left-4 h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
        />
      )}

      {/* Edit Button */}
      {onEdit && (
        <button
          onClick={() => onEdit(product)}
          className="absolute top-4 right-16 p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      )}

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={() => onDelete(product)}
          className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}

      <div className="h-32 w-full">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-2 text-sm line-clamp-3">
          {product.description}
        </p>
        <div className="mb-2">
          <span className="text-xl font-bold text-purple-600">
            ${product.price.toLocaleString()}
          </span>
        </div>
        <div className="flex space-x-2 mt-auto">
          <button
            onClick={() => {
              /* Add view details logic */
            }}
            className="flex-1 bg-purple-600 text-white py-1.5 px-3 rounded-md hover:bg-purple-700 transition-colors duration-300 text-sm"
          >
            View Details
          </button>
          <button
            onClick={() => {
              /* Add contact logic */
            }}
            className="flex-1 bg-gradient-to-r from-cyan-400 to-purple-500 text-white py-1.5 px-3 rounded-md hover:from-cyan-500 hover:to-purple-600 transition-colors duration-300 text-sm"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProductsProps {
  isAdmin: boolean;
}

const Products: React.FC<ProductsProps> = ({ isAdmin }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/products`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/products/${product._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Refresh the products list
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedProducts.length} products?`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const deletePromises = selectedProducts.map((product) =>
        fetch(`${process.env.REACT_APP_API_URL}/api/products/${product._id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      await Promise.all(deletePromises);

      // Refresh the products list
      fetchProducts();
      setSelectedProducts([]);
      setIsBulkDeleteMode(false);
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Failed to delete products');
    }
  };

  const handleSubmit = async (formData: Omit<Product, '_id'>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const url = selectedProduct
        ? `${process.env.REACT_APP_API_URL}/api/products/${selectedProduct._id}`
        : `${process.env.REACT_APP_API_URL}/api/products`;

      const response = await fetch(url, {
        method: selectedProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save product');
      }

      // Refresh the products list
      fetchProducts();
      setSelectedProduct(undefined);
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  const toggleProductSelection = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.find((p) => p._id === product._id)
        ? prev.filter((p) => p._id !== product._id)
        : [...prev, product]
    );
  };

  const toggleBulkDeleteMode = () => {
    setIsBulkDeleteMode(!isBulkDeleteMode);
    // Clear selected products when exiting bulk delete mode
    if (isBulkDeleteMode) {
      setSelectedProducts([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Products
            </h1>
            <p className="text-lg text-gray-600">
              Discover our range of innovative solutions and services
            </p>
          </div>
          {isAdmin && (
            <div className="flex space-x-4">
              <button
                onClick={toggleBulkDeleteMode}
                className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isBulkDeleteMode
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                    : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'
                }`}
              >
                {isBulkDeleteMode ? 'Cancel Selection' : 'Bulk Delete'}
              </button>
              {selectedProducts.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete Selected ({selectedProducts.length})
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedProduct(undefined);
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Add New Product
              </button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={isAdmin ? handleEdit : undefined}
              onDelete={isAdmin ? handleDelete : undefined}
              isSelected={selectedProducts.some((p) => p._id === product._id)}
              onSelect={
                isAdmin && isBulkDeleteMode ? toggleProductSelection : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProduct(undefined);
        }}
        onSubmit={handleSubmit}
        initialData={selectedProduct}
      />
    </div>
  );
};

export default Products;
