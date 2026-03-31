import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HiOutlineSquares2X2,
  HiOutlineDocumentText,
  HiOutlineCurrencyRupee,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineArrowRightOnRectangle,
  HiOutlineHome,
  HiOutlineChevronLeft,
  HiOutlineChevronRight
} from 'react-icons/hi2';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HiOutlineSquares2X2, requiresSubmit: false },
  { id: 'summary', label: 'Project Summary', icon: HiOutlineDocumentText, requiresSubmit: true },
  { id: 'cost', label: 'Cost Estimation', icon: HiOutlineCurrencyRupee, requiresSubmit: true },
  { id: 'interior', label: 'Interior Design', icon: HiOutlineSparkles, requiresSubmit: true },
  { id: 'vastu', label: 'Vastu Layout', icon: HiOutlineShieldCheck, requiresSubmit: true },
  { id: 'timeline', label: 'Timeline', icon: HiOutlineClock, requiresSubmit: true },
];

export default function Sidebar({ activeTab, onTabChange, hasSubmitted, isOpen, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-dark-800 border-r border-white/5 flex flex-col z-30 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
          <HiOutlineHome className="text-white text-xl" />
        </div>
        {isOpen && (
          <span className="text-lg font-bold tracking-tight">
            Smart<span className="text-primary">Build</span>
          </span>
        )}
      </div>

      {/* User info */}
      {isOpen && (
        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.displayName || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon;
          const disabled = item.requiresSubmit && !hasSubmitted;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => !disabled && onTabChange(item.id)}
              disabled={disabled}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${active 
                  ? 'bg-primary/15 text-primary' 
                  : disabled 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
              title={!isOpen ? item.label : undefined}
            >
              <Icon className={`text-lg shrink-0 ${active ? 'text-primary' : ''}`} />
              {isOpen && <span>{item.label}</span>}
              {disabled && isOpen && (
                <span className="ml-auto text-xs bg-white/5 px-2 py-0.5 rounded-full text-gray-600">locked</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-2 border-t border-white/5">
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all"
        >
          {isOpen ? <HiOutlineChevronLeft className="text-lg" /> : <HiOutlineChevronRight className="text-lg" />}
          {isOpen && <span>Collapse</span>}
        </button>
      </div>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
          title={!isOpen ? 'Logout' : undefined}
        >
          <HiOutlineArrowRightOnRectangle className="text-lg shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
