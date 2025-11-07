// src/components/Menu.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, UserCircle, Menu as MenuIcon, X, MoreHorizontal, Code, Eye, Database } from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children?: MenuItem[];
}

interface MenuProps {
  items: MenuItem[];
  userItems: MenuItem[];
  mode: 'code' | 'preview' | 'database';
  onModeChange: (m: 'code' | 'preview' | 'database') => void;
}

const Menu: React.FC<MenuProps> = ({ items, userItems, mode, onModeChange }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(event.target as Node) && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-white font-bold text-xl">
              AiCoderV2
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => onModeChange('code')}
                className={`p-2 rounded-md ${mode === 'code' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                aria-label="Code Mode"
              >
                <Code size={18} />
              </button>
              <button
                onClick={() => onModeChange('preview')}
                className={`p-2 rounded-md ${mode === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                aria-label="Preview Mode"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => onModeChange('database')}
                className={`p-2 rounded-md ${mode === 'database' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                aria-label="Database Mode"
              >
                <Database size={18} />
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-700 text-gray-300 placeholder-gray-500 border-0 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
            </div>
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="text-gray-300 hover:text-white p-1"
                aria-haspopup="true"
              >
                <MoreHorizontal size={24} />
              </button>
              {isMoreOpen && (
                <div className="absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
                  <div role="menu" aria-orientation="vertical">
                    {items.map((item) => (
                      <div key={item.label}>
                        <a
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                          role="menuitem"
                        >
                          {item.label}
                        </a>
                        {item.children?.map((sub) => (
                          <a
                            key={sub.label}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white pl-6"
                            role="menuitem"
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div ref={userRef} className="relative">
              <button
                onClick={() => setIsUserOpen(!isUserOpen)}
                className="text-gray-300 hover:text-white"
                aria-haspopup="true"
              >
                <UserCircle size={24} />
              </button>
              {isUserOpen && (
                <div className="absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
                  <div role="menu" aria-orientation="vertical">
                    {userItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                        role="menuitem"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              {isMobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMobileOpen && (
        <div ref={mobileRef} className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => onModeChange('code')}
                className={`p-2 rounded-md ${mode === 'code' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                aria-label="Code Mode"
              >
                <Code size={18} />
              </button>
              <button
                onClick={() => onModeChange('preview')}
                className={`p-2 rounded-md ${mode === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                aria-label="Preview Mode"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => onModeChange('database')}
                className={`p-2 rounded-md ${mode === 'database' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                aria-label="Database Mode"
              >
                <Database size={18} />
              </button>
            </div>
            {items.map((item) => (
              <div key={item.label}>
                <a
                  href={item.href}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  {item.icon && <item.icon size={18} className="mr-2" />}
                  {item.label}
                </a>
                {item.children && item.children.map((sub) => (
                  <a
                    key={sub.label}
                    href={sub.href}
                    className="text-gray-400 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium pl-8"
                  >
                    {sub.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-2">
              <div className="mt-3 space-y-1">
                <div className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-700 text-gray-300 placeholder-gray-500 border-0 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {userItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Menu;