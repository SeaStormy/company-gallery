import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../services/api';
import ProductForm from './ProductForm';
import ProductDetailsModal from './ProductDetailsModal';
import ConfirmationModal from './ConfirmationModal';
import { Product } from '../types/Product';

interface ProductsProps {
  isAdmin: boolean;
}

const Products: React.FC<ProductsProps> = ({ isAdmin }) => {
  console.log('component rendered');
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Separate states for each filter
  const [searchFilter, setSearchFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    isBulk: boolean;
  }>({
    isOpen: false,
    product: null,
    isBulk: false,
  });
  const [viewMode, setViewMode] = useState<'view' | 'edit' | null>(null);

  // Simple filter function
  const filteredProducts = products
    .filter((product) => {
      // Search filter
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchFilter.toLowerCase());

      // Price filters
      const minPrice = minPriceFilter ? parseFloat(minPriceFilter) : null;
      const maxPrice = maxPriceFilter ? parseFloat(maxPriceFilter) : null;

      const matchesMinPrice = minPrice === null || product.price >= minPrice;
      const matchesMaxPrice = maxPrice === null || product.price <= maxPrice;

      return matchesSearch && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      }
    });

  // Separate handlers for each filter
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(e.target.value);
    setIsFilterActive(true);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPriceFilter(e.target.value);
    setIsFilterActive(true);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPriceFilter(e.target.value);
    setIsFilterActive(true);
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'name' | 'price');
    setIsFilterActive(true);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
    setIsFilterActive(true);
  };

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
    setViewMode('edit');
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setViewMode('view');
  };

  const handleDelete = async (product: Product) => {
    setDeleteModal({
      isOpen: true,
      product,
      isBulk: false,
    });
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    setDeleteModal({
      isOpen: true,
      product: null,
      isBulk: true,
    });
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');

      if (deleteModal.isBulk) {
        const deletePromises = selectedProducts.map((product) =>
          fetch(`${API_URL}/api/products/${product._id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );

        await Promise.all(deletePromises);
        setSelectedProducts([]);
        setIsBulkDeleteMode(false);
      } else if (deleteModal.product) {
        const response = await fetch(
          `${API_URL}/api/products/${deleteModal.product._id}`,
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
      }

      // Refresh the products list
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product(s):', error);
    } finally {
      setDeleteModal({ isOpen: false, product: null, isBulk: false });
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

  const handleCreate = () => {
    setSelectedProduct(null);
    setViewMode('edit');
    setIsFormOpen(true);
  };

  const FilterDrawer = () => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{t('products.filter.title')}</h2>
        <button
          onClick={() => setIsFilterDrawerOpen(false)}
          className="sm:hidden text-gray-500 hover:text-gray-700"
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

      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('products.filter.search')}
        </label>
        <input
          type="text"
          value={searchFilter}
          onChange={handleSearchChange}
          placeholder={t('products.filter.search')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('products.filter.price')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minPriceFilter}
            onChange={handleMinPriceChange}
            placeholder={t('products.filter.min')}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            value={maxPriceFilter}
            onChange={handleMaxPriceChange}
            placeholder={t('products.filter.max')}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('products.filter.sort')}
        </label>
        <select
          value={sortBy}
          onChange={handleSortByChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="name">{t('products.filter.name')}</option>
          <option value="price">{t('products.filter.price')}</option>
        </select>
      </div>

      {/* Sort Order */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('products.filter.order')}
        </label>
        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="asc">{t('products.filter.ascending')}</option>
          <option value="desc">{t('products.filter.descending')}</option>
        </select>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="space-y-3">
          <button
            onClick={handleCreate}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300"
          >
            {t('products.actions.create')}
          </button>
          <button
            onClick={toggleBulkDeleteMode}
            className={`w-full py-2 px-4 rounded-md transition-colors duration-300 ${
              isBulkDeleteMode
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isBulkDeleteMode
              ? t('products.actions.cancelBulkDelete')
              : t('products.actions.bulkDelete')}
          </button>
          {isBulkDeleteMode && selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
            >
              {t('products.actions.deleteSelected', {
                count: selectedProducts.length,
              })}
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Mobile Filter Toggle Button */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setIsFilterDrawerOpen(true)}
          className="w-full bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
        >
          <span className="text-gray-700 font-medium">Filters</span>
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-8">
        {/* Filters - Hidden on mobile, shown in drawer */}
        <div className="hidden sm:block w-1/4">
          <FilterDrawer />
        </div>

        {/* Products Grid - Full width on mobile */}
        <div className="w-full sm:w-3/4">
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
                  onViewDetails={() => handleViewDetails(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl">
            <div className="h-full overflow-y-auto">
              <FilterDrawer />
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => {
            setIsFormOpen(false);
            setViewMode(null);
            setSelectedProduct(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* Product Details Modal */}
      {viewMode === 'view' && selectedProduct && (
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
          onClose={() => {
            setViewMode(null);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title={
          deleteModal.isBulk ? 'Delete Selected Products' : 'Delete Product'
        }
        message={
          deleteModal.isBulk
            ? `Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`
            : `Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`
        }
        onConfirm={confirmDelete}
        onCancel={() =>
          setDeleteModal({ isOpen: false, product: null, isBulk: false })
        }
        confirmText="Delete"
        cancelText="Cancel"
      />
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
  const { t } = useTranslation();

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
            {t('products.actions.viewDetails')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
