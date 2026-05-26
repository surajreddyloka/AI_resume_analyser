import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react';

const UserMenu = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch {
      toast.error('Sign out failed. Try again.');
    }
    setOpen(false);
  };

  if (!currentUser) return null;

  const displayName = userProfile?.full_name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const photoURL = userProfile?.photo_url || currentUser?.photoURL;
  const email = currentUser?.email;

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Trigger */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2.5 w-full p-2 rounded-xl hover:bg-white/5 transition-colors group"
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/50 flex-shrink-0"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-white truncate">{displayName}</p>
          <p className="text-xs text-gray-500 truncate">{email}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-white/10 bg-white/5">
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
            {userProfile?.provider === 'google' && (
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-medium">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google Account
              </span>
            )}
          </div>

          {/* Menu Items */}
          <div className="p-1">
            <button
              onClick={() => { navigate('/'); setOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <LayoutDashboard size={16} className="text-emerald-400" />
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
