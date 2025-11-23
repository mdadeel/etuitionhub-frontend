// Dashboard Sidebar - navigation for dashboard
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBookOpen, FaUsers, FaMoneyBill, FaCog, FaPlus } from 'react-icons/fa';

const DashboardSidebar = ({ role }) => {
    const location = useLocation();

    // Different nav items based on role
    const getNavItems = () => {
        if (role === 'admin') {
            return [
                { path: '/dashboard', label: 'Overview', icon: <FaHome /> },
                { path: '/dashboard/manage-users', label: 'Manage Users', icon: <FaUsers /> },
                { path: '/dashboard/manage-tuitions', label: 'Manage Tuitions', icon: <FaBookOpen /> },
                { path: '/dashboard/reports', label: 'Reports', icon: <FaMoneyBill /> },
            ];
        }
        if (role === 'tutor') {
            return [
                { path: '/dashboard', label: 'Overview', icon: <FaHome /> },
                { path: '/dashboard/my-applications', label: 'My Applications', icon: <FaBookOpen /> },
                { path: '/dashboard/my-students', label: 'My Students', icon: <FaUsers /> },
                { path: '/dashboard/earnings', label: 'Earnings', icon: <FaMoneyBill /> },
            ];
        }
        // Student
        return [
            { path: '/dashboard', label: 'Overview', icon: <FaHome /> },
            { path: '/dashboard/my-tuitions', label: 'My Tuitions', icon: <FaBookOpen /> },
            { path: '/dashboard/post-tuition', label: 'Post Tuition', icon: <FaPlus /> },
            { path: '/dashboard/applications', label: 'Applied Tutors', icon: <FaUsers /> },
            { path: '/dashboard/payments', label: 'Payments', icon: <FaMoneyBill /> },
        ];
    };

    return (
        <div className="w-64 bg-base-100 shadow-lg min-h-screen p-4">
            <h2 className="text-xl font-bold mb-6 text-primary">Dashboard</h2>
            <ul className="menu">
                {getNavItems().map(item => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            className={location.pathname === item.path ? 'active' : ''}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    </li>
                ))}
                <li>
                    <Link to="/dashboard/profile">
                        <FaCog />
                        Profile Settings
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default DashboardSidebar;
