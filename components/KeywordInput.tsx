import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface KeywordInputProps {
  value: string[];
  onChange: (keywords: string[]) => void;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newKeyword = inputValue.trim();
      if (!value.includes(newKeyword)) {
        onChange([...value, newKeyword]);
      }
      setInputValue('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    onChange(value.filter(keyword => keyword !== keywordToRemove));
  };

  return (
    <div className="w-full flex flex-wrap items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
      {value.map(keyword => (
        <div key={keyword} className="flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full pl-3 pr-1.5 py-1 text-sm font-medium">
          <span>{keyword}</span>
          <button
            type="button"
            onClick={() => removeKeyword(keyword)}
            className="rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-700 focus:outline-none"
            aria-label={`移除 ${keyword}`}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="添加关键词后按 Enter..."
        className="flex-grow bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 p-1 min-w-[150px]"
      />
    </div>
  );
};

export default KeywordInput;