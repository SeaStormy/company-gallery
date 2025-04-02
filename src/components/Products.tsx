import React from 'react';
import { Product } from '../types/Product';

// Temporary mock data - replace with actual API call later
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Enterprise Software Solution',
    description:
      'Comprehensive software solution for large enterprises with advanced features and scalable architecture',
    price: 9999,
    image: 'https://picsum.photos/200/300',
  },
  {
    id: 2,
    name: 'Cloud Migration Service',
    description: 'Seamless cloud migration and management',
    price: 5999,
    image: 'https://picsum.photos/200/300',
  },
  {
    id: 3,
    name: 'Cybersecurity Package',
    description:
      'Advanced security solutions for your business with real-time threat detection and prevention',
    price: 7999,
    image: 'https://picsum.photos/200/300',
  },
  {
    id: 4,
    name: 'AI Development Kit',
    description: 'Tools and frameworks for AI development',
    price: 4999,
    image: 'https://picsum.photos/200/300',
  },
  {
    id: 5,
    name: 'Digital Transformation Package',
    description:
      'Complete digital transformation solution with comprehensive implementation and support',
    price: 12999,
    image: 'https://picsum.photos/200/300',
  },
  {
    id: 6,
    name: 'IoT Platform',
    description: 'Comprehensive IoT development and management platform',
    price: 6999,
    image: 'https://picsum.photos/200/300',
  },
];

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 h-[500px] flex flex-col">
      <div className="h-48 w-full">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 h-14 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-4 h-20 line-clamp-4">
          {product.description}
        </p>
        <div className="h-10 mb-4">
          <span className="text-2xl font-bold text-purple-600">
            ${product.price.toLocaleString()}
          </span>
        </div>
        <div className="flex space-x-4 mt-auto">
          <button
            onClick={() => {
              /* Add view details logic */
            }}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300"
          >
            View Details
          </button>
          <button
            onClick={() => {
              /* Add contact logic */
            }}
            className="flex-1 bg-gradient-to-r from-cyan-400 to-purple-500 text-white py-2 px-4 rounded-md hover:from-cyan-500 hover:to-purple-600 transition-colors duration-300"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

const Products: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-lg text-gray-600">
            Discover our range of innovative solutions and services
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
