import React from 'react';
import { QuestionMarkIcon } from './icons/QuestionMarkIcon';

interface HeaderProps {
  onHelpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHelpClick }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path>
            </svg>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Telemon
          </h1>
        </div>
        <button 
          onClick={onHelpClick}
          className="p-2 rounded-full text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="打开用户手册"
        >
          <QuestionMarkIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;