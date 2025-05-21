import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Scan, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <FileText className="h-6 w-6 text-indigo-600" />
          <h1 className="ml-2 text-xl font-semibold text-indigo-600">VoucherVault</h1>
        </div>
        
        {user && (
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/scan')}
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Scan className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Scan</span>
            </button>
            
            <div className="flex items-center group relative">
              <div className="flex items-center cursor-pointer">
                <span className="hidden sm:block mr-2 text-gray-700">{user.username}</span>
                <UserCircle className="h-6 w-6 text-gray-600" />
              </div>
              
              <div className="absolute right-0 top-8 w-48 py-2 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2 text-red-500" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;