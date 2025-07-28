import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: '대시보드', path: '/' },
    { id: 'contents', label: '콘텐츠', path: '/contents' },
    { id: 'create', label: '콘텐츠 생성', path: '/contents/create' },
    { id: 'settings', label: '설정', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="mt-8">
        <div className="px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || 
                             (item.path === '/contents' && location.pathname.startsWith('/contents'));
              
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => onPageChange(item.id)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 