// Dashboard Sidebar - navigation for dashboard
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCog, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext'

const DashboardSidebar = ({ role }) => {
    const location = useLocation();
    const { user } = useAuth();

    const getRoleDisplay = () => {
        if (role?.toLowerCase() === 'admin') return { label: 'Administrator', color: 'text-red-500' };
        if (role?.toLowerCase() === 'tutor') return { label: 'Professional', color: 'text-teal-600' };
        return { label: 'Client', color: 'text-gray-500' };
    };

    const roleInfo = getRoleDisplay();

    const menuItems = [
        { path: '/dashboard', label: 'Management Overview', icon: <FaHome /> },
        { path: '/dashboard/profile', label: 'Identity Settings', icon: <FaUser /> },
    ];

    if (role?.toLowerCase() === 'admin') {
        menuItems.push({ path: '/dashboard/users', label: 'User Matrix', icon: <FaUser className="opacity-70" /> });
    } else if (role?.toLowerCase() === 'tutor') {
        menuItems.push({ path: '/dashboard/my-applications', label: 'My Applications', icon: <FaCog className="opacity-70" /> });
    }

    return (
        <aside className="w-72 bg-[var(--color-surface)] border-r border-[var(--color-border)] h-full flex flex-col flex-shrink-0 transition-colors duration-300 overflow-y-auto scrollbar-hide">
            {/* User Profile Section */}
            <div className="p-8 mb-4">
                <div className="flex flex-col items-center text-center p-6 bg-[var(--color-surface-muted)] rounded-2xl border border-[var(--color-border)]">
                    <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface)] p-1.5 shadow-sm border border-[var(--color-border)]">
                            <div className="w-full h-full rounded-xl overflow-hidden bg-[var(--color-surface-muted)] flex items-center justify-center">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-black text-teal-600">
                                        {user?.displayName?.charAt(0) || 'U'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 border-4 border-[var(--color-surface)] rounded-full"></div>
                    </div>

                    <h3 className="text-sm font-black text-[var(--color-text-primary)] mb-1 truncate w-full">{user?.displayName || 'Authorized User'}</h3>
                    <p className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] ${roleInfo.color === 'text-red-500' ? 'text-red-500' : 'text-teal-600'}`}>
                        {roleInfo.label}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-grow px-6">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-text-muted)] px-4 mb-6">Operations</div>
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 relative group overflow-hidden ${isActive
                                        ? 'bg-teal-50/10 text-teal-600 shadow-[0_4px_12px_rgba(13,148,136,0.08)] border border-teal-600/20'
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]'
                                        }`}
                                >
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-r-full"></div>}
                                    <span className={`text-lg transition-colors ${isActive ? 'text-teal-600' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="tracking-tight">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer Quote */}
            <div className="p-8">
                <div className="p-5 bg-teal-900/[0.02] rounded-2xl border border-teal-900/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-teal-500/5 rounded-bl-3xl transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform"></div>
                    <p className="relative z-10 italic text-[10px] leading-relaxed text-[var(--color-text-muted)] font-medium tracking-wide">
                        "Precision in management leads to excellence in results."
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;

