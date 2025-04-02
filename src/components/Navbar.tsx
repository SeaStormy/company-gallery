import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Login from './Login';

const Navbar: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

            {/* Navigation Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
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
              </div>

              {/* Login Button */}
              <button
                onClick={() => setIsLoginOpen(true)}
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
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16"></div> {/* Spacer for fixed navbar */}
      {/* Login Modal */}
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navbar;
