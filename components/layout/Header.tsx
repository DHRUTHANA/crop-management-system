import * as React from 'react';
import { Bell, Menu, Sun, Moon, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { t } = useTranslation(); // Initialize translation hook
  const [darkMode, setDarkMode] = React.useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    navigate('/login');
  };

  const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };

    return (
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        aria-label="Select language"
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
         <option value="kn">ಕನ್ನಡ</option>

      </select>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')} // Use translation for placeholder
              className="py-2 pl-10 pr-4 w-48 md:w-64 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-error-500 rounded-full"></span>
          </button>
          <div className="hidden md:flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
              {localStorage.getItem('currentUser')?.charAt(0).toUpperCase() || 'JD'}
            </div>
            <span className="text-sm font-medium">{localStorage.getItem('currentUser') || t('header.userName')}</span>
            <button
              onClick={handleLogout}
              className="ml-4 text-red-600 hover:text-red-800 focus:outline-none flex items-center"
              aria-label="Logout"
              title={t('logoutButton')}
            >
              <LogOut size={20} />
            </button>
          </div>
          <LanguageSelector /> {/* Add LanguageSelector here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
