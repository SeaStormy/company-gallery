import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_URL } from '../services/api';
import Notification from './Notification';

interface NavbarProps {
  isAdmin: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
  onNotificationHeightChange: (height: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  onLogout,
  onLoginClick,
  onNotificationHeightChange,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationHeight, setNotificationHeight] = useState(0);
  const [logo, setLogo] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(`${API_URL}/api/settings`);
        if (response.ok) {
          const data = await response.json();
          if (data.logo) {
            setLogo(data.logo);
          }
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogo();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Notification component */}
      <Notification onHeightChange={onNotificationHeightChange} />

      {/* Navbar */}
      <nav
        className={`${
          isScrolled
            ? 'bg-white text-gray-800 shadow-md'
            : 'bg-gray-900 text-white'
        } transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Company Logo"
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-xl font-bold">Company Portal</span>
                  )}
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`${
                    location.pathname === '/'
                      ? isScrolled
                        ? 'border-blue-500 text-gray-900'
                        : 'border-white text-white'
                      : isScrolled
                      ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className={`${
                    location.pathname === '/products'
                      ? isScrolled
                        ? 'border-blue-500 text-gray-900'
                        : 'border-white text-white'
                      : isScrolled
                      ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Products
                </Link>
                <Link
                  to="/showcases"
                  className={`${
                    location.pathname === '/showcases'
                      ? isScrolled
                        ? 'border-blue-500 text-gray-900'
                        : 'border-white text-white'
                      : isScrolled
                      ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Showcases
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {isAdmin && (
                <>
                  <Link
                    to="/settings"
                    className={`${
                      location.pathname === '/settings'
                        ? isScrolled
                          ? 'text-gray-900'
                          : 'text-white'
                        : isScrolled
                        ? 'text-gray-500 hover:text-gray-700'
                        : 'text-gray-300 hover:text-white'
                    } inline-flex items-center px-3 py-2 rounded-md text-sm font-medium mr-4`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Settings
                  </Link>
                  <button
                    onClick={onLogout}
                    className={`${
                      isScrolled
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300`}
                  >
                    Logout
                  </button>
                </>
              )}
              {!isAdmin && (
                <button
                  onClick={onLoginClick}
                  className={`${
                    isScrolled
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300`}
                >
                  Login
                </button>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className={`${
                  isScrolled
                    ? 'text-gray-500 hover:text-gray-700'
                    : 'text-gray-300 hover:text-white'
                } inline-flex items-center justify-center p-2 rounded-md focus:outline-none`}
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div
          className={`sm:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          id="mobile-menu"
        >
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`${
                location.pathname === '/'
                  ? isScrolled
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-gray-800 border-white text-white'
                  : isScrolled
                  ? 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  : 'border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`${
                location.pathname === '/products'
                  ? isScrolled
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-gray-800 border-white text-white'
                  : isScrolled
                  ? 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  : 'border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Products
            </Link>
            <Link
              to="/showcases"
              className={`${
                location.pathname === '/showcases'
                  ? isScrolled
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-gray-800 border-white text-white'
                  : isScrolled
                  ? 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  : 'border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Showcases
            </Link>
            {isAdmin && (
              <Link
                to="/settings"
                className={`${
                  location.pathname === '/settings'
                    ? isScrolled
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-gray-800 text-white'
                    : isScrolled
                    ? 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } block pl-3 pr-4 py-2 text-base font-medium`}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Settings
                </div>
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              {isAdmin ? (
                <button
                  onClick={onLogout}
                  className={`${
                    isScrolled
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  } block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-300`}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  className={`${
                    isScrolled
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-300`}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
