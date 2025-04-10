import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  isScrolled: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isScrolled }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div
      className="relative inline-block text-left mr-4"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className={`${
          isScrolled
            ? 'text-gray-500 hover:text-gray-700'
            : 'text-gray-300 hover:text-white'
        } inline-flex items-center px-3 py-2 rounded-md text-sm font-medium focus:outline-none`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {t('common.language')}
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => changeLanguage('en')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {t('common.english')}
            </button>
            <button
              onClick={() => changeLanguage('vi')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              {t('common.vietnamese')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
