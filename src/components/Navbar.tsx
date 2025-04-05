import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, onLoginClick, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md shadow-lg'
            : 'bg-gray-800/90'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Company Logo/Name */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-purple-500">FPT</span>
              </Link>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="ml-10 flex items-baseline space-x-4">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Products', path: '/products' },
                  { name: 'Showcases', path: '/showcases' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'text-purple-500 bg-purple-100/90'
                        : isScrolled
                        ? 'text-gray-700 hover:text-purple-500 hover:bg-purple-100/90'
                        : 'text-gray-200 hover:text-purple-500 hover:bg-purple-100/90'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Desktop Login/Logout Button */}
              {isAdmin ? (
                <button
                  onClick={onLogout}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                    ${
                      isScrolled
                        ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }
                    hover:from-purple-700 hover:to-blue-600
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                    ${
                      isScrolled
                        ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }
                    hover:from-purple-700 hover:to-blue-600
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700' : 'text-gray-200'
                } hover:text-purple-500 hover:bg-purple-100/90 focus:outline-none`}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[
              { name: 'Home', path: '/' },
              { name: 'Products', path: '/products' },
              { name: 'Showcases', path: '/showcases' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-purple-500 bg-purple-100/90'
                    : isScrolled
                    ? 'text-gray-700 hover:text-purple-500 hover:bg-purple-100/90'
                    : 'text-gray-200 hover:text-purple-500 hover:bg-purple-100/90'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin ? (
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full mt-2 px-4 py-2 rounded-md text-base font-medium transition-all duration-300
                  ${
                    isScrolled
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }
                  hover:from-purple-700 hover:to-blue-600
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full mt-2 px-4 py-2 rounded-md text-base font-medium transition-all duration-300
                  ${
                    isScrolled
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }
                  hover:from-purple-700 hover:to-blue-600
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      <div className="h-16"></div> {/* Spacer for fixed navbar */}
    </>
  );
};

export default Navbar;
