import React, { useState, useEffect } from 'react';
import { API_URL } from '../services/api';
import ProductForm from './ProductForm';
import ProductDetailsModal from './ProductDetailsModal';
import { Product } from '../types/Product';

interface ProductsProps {
  isAdmin: boolean;
}

interface Filter {
  search: string;
  minPrice: string;
  maxPrice: string;
  sortBy: 'name' | 'price';
  sortOrder: 'asc' | 'desc';
}

// Temporary mock data - replace with actual API call later
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Product 1',
    description: 'This is a description for product 1',
    price: 99.99,
    image: 'product1.jpg',
    category: 'Category 1',
    specifications: {
      'Spec 1': 'Value 1',
      'Spec 2': 'Value 2',
    },
  },
  {
    _id: '2',
    name: 'Product 2',
    description: 'This is a description for product 2',
    price: 149.99,
    image: 'product2.jpg',
    category: 'Category 2',
    specifications: {
      'Spec 1': 'Value 1',
      'Spec 2': 'Value 2',
    },
  },
  {
    _id: '3',
    name: 'Product 3',
    description: 'This is a description for product 3',
    price: 199.99,
    image: 'product3.jpg',
    category: 'Category 1',
    specifications: {
      'Spec 1': 'Value 1',
      'Spec 2': 'Value 2',
    },
  },
];

const Products: React.FC<ProductsProps> = ({ isAdmin }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filter>({
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [isFilterActive, setIsFilterActive] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
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
      const response = await fetch(`${API_URL}/api/products/${product._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        fetch(`${API_URL}/api/products/${product._id}`, {
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
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
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

  const filteredProducts = React.useMemo(() => {
    if (!isFilterActive) {
      return products;
    }

    return products
      .filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(filters.search.toLowerCase());
        const matchesMinPrice =
          !filters.minPrice || product.price >= Number(filters.minPrice);
        const matchesMaxPrice =
          !filters.maxPrice || product.price <= Number(filters.maxPrice);
        return matchesSearch && matchesMinPrice && matchesMaxPrice;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'name') {
          return filters.sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else {
          return filters.sortOrder === 'asc'
            ? a.price - b.price
            : b.price - a.price;
        }
      });
  }, [products, filters, isFilterActive]);

  const handleFilterChange = (newFilters: Partial<Filter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setIsFilterActive(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Filters - 1/4 width */}
        <div className="w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange({ minPrice: e.target.value })
                  }
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange({ maxPrice: e.target.value })
                  }
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  handleFilterChange({
                    sortBy: e.target.value as 'name' | 'price',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange({
                    sortOrder: e.target.value as 'asc' | 'desc',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="space-y-3">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300"
                >
                  Create New Product
                </button>
                <button
                  onClick={toggleBulkDeleteMode}
                  className={`w-full py-2 px-4 rounded-md transition-colors duration-300 ${
                    isBulkDeleteMode
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isBulkDeleteMode ? 'Cancel Bulk Delete' : 'Bulk Delete'}
                </button>
                {isBulkDeleteMode && selectedProducts.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
                  >
                    Delete Selected ({selectedProducts.length})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid - 3/4 width */}
        <div className="w-3/4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isAdmin={isAdmin}
                  isSelected={selectedProducts.some(
                    (p) => p._id === product._id
                  )}
                  onSelect={() => toggleProductSelection(product)}
                  onDelete={() => handleDelete(product)}
                  onEdit={() => handleEdit(product)}
                  onViewDetails={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProduct(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={{
            id: selectedProduct._id,
            name: selectedProduct.name,
            description: selectedProduct.description,
            price: selectedProduct.price,
            image: selectedProduct.image,
            category: selectedProduct.category,
            specifications: selectedProduct.specifications,
          }}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onViewDetails: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isAdmin,
  isSelected,
  onSelect,
  onDelete,
  onEdit,
  onViewDetails,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden relative ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {/* Selection Checkbox */}
      {isAdmin && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="absolute top-4 left-4 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      )}

      {/* Edit Button */}
      {isAdmin && (
        <button
          onClick={onEdit}
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
      {isAdmin && (
        <button
          onClick={onDelete}
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
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={onViewDetails}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
