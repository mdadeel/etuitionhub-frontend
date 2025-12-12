// Dashboard Sidebar - navigation for dashboard
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCog, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const DashboardSidebar = ({ role }) => {
    const location = useLocation();
    const { user } = useAuth();

    // Role display name
    const getRoleDisplay = () => {
        if (role === 'admin') return { label: 'Administrator', color: 'text-error' };
        if (role === 'tutor') return { label: 'Tutor', color: 'text-primary' };
        return { label: 'Student', color: 'text-secondary' };
    };

    const roleInfo = getRoleDisplay();

    return (
        <div className="w-64 bg-base-100 shadow-lg min-h-screen p-4">
            {/* User info */}
            <div className="mb-6 text-center pb-4 border-b border-base-300">
                <div className="avatar placeholder mb-2">
                    <div className="bg-primary text-primary-content rounded-full w-16">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} />
                        ) : (
                            <span className="text-xl">{user?.displayName?.charAt(0) || 'U'}</span>
                        )}
                    </div>
                </div>
                <h3 className="font-bold text-sm">{user?.displayName || 'User'}</h3>
                <p className={`text-xs font-semibold ${roleInfo.color}`}>{roleInfo.label}</p>
            </div>

            <h2 className="text-lg font-bold mb-4 text-primary">Dashboard</h2>

            <ul className="menu gap-1">
                <li>
                    <Link
                        to="/dashboard"
                        className={location.pathname === '/dashboard' ? 'active' : ''}
                    >
                        <FaHome />
                        Overview
                    </Link>
                </li>
                <li>
                    <Link
                        to="/dashboard/profile"
                        className={location.pathname === '/dashboard/profile' ? 'active' : ''}
                    >
                        <FaCog />
                        Profile Settings
                    </Link>
                </li>
            </ul>

            {/* Role-specific info */}
            <div className="mt-6 p-3 bg-base-200 rounded-lg text-xs">
                <p className="font-semibold mb-1">Quick Tips:</p>
                {role === 'admin' && (
                    <p className="text-gray-600">Use the tabs above to manage users and tuitions.</p>
                )}
                {role === 'tutor' && (
                    <p className="text-gray-600">Use tabs to view your applications and ongoing tuitions.</p>
                )}
                {role === 'student' && (
                    <p className="text-gray-600">Use tabs to post tuitions and manage applications.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardSidebar;

