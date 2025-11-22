// Dashboard main page - routes to role-specific dashboards
// This logic is messy but works - dont want to refactor now
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';
import StudentDashboard from '../components/Dashboard/StudentDashboard';
import TutorDashboard from '../components/Dashboard/TutorDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import Profile from '../components/Dashboard/Profile';

// Main dashboard wrapper with sidebar
function Dashboard() {
    const { user, dbUser } = useAuth();
    const role = dbUser?.role || 'student';

    // Default fallback - should never happen but just in case
    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex min-h-screen bg-base-200">
            <DashboardSidebar role={role} />
            <div className="flex-1 p-6">
                <Routes>
                    <Route index element={
                        role === 'admin' ? <AdminDashboard /> :
                            role === 'tutor' ? <TutorDashboard /> :
                                <StudentDashboard />
                    } />
                    <Route path="profile" element={<Profile />} />
                    {/* Add more dashboard routes as needed - TODO */}
                </Routes>
            </div>
        </div>
    );
}

export default Dashboard;
