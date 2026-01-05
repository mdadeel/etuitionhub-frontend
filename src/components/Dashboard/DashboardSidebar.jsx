// Dashboard Sidebar - navigation for dashboard
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCog, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext'

const DashboardSidebar = ({ role }) => {
    const location = useLocation();
    const { user } = useAuth();

    const getRoleDisplay = () => {
        if (role?.toLowerCase() === 'admin') return { label: 'Administrator', color: 'text-red-500' };
        if (role?.toLowerCase() === 'tutor') return { label: 'Professional', color: 'text-indigo-600' };
        return { label: 'Client', color: 'text-gray-500' };
    };

    const roleInfo = getRoleDisplay();

    const menuItems = [
        { path: '/dashboard', label: 'Management Overview', icon: <FaHome className="w-4 h-4" /> },
        { path: '/dashboard/profile', label: 'Identity Settings', icon: <FaCog className="w-4 h-4" /> },
    ];

    return (
        <aside className="w-72 bg-white border-r border-gray-100 min-h-screen sticky top-0 flex flex-col">
            <div className="p-8 border-b border-gray-50 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover grayscale" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">
                                {user?.displayName?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 truncate max-w-[140px]">{user?.displayName || 'User'}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${roleInfo.color}`}>{roleInfo.label}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-grow px-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-4 mb-4">Operations</div>
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all duration-200 group ${isActive
                                            ? 'bg-gray-50 text-indigo-600'
                                            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50/50'
                                        }`}
                                >
                                    <span className={isActive ? 'text-indigo-600' : 'text-gray-300 group-hover:text-gray-900'}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-8 mt-auto">
                <div className="p-6 bg-gray-50 border border-gray-100 italic text-[11px] leading-relaxed text-gray-500">
                    "Precision in management leads to excellence in results."
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;

