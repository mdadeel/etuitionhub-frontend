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
const Dashboard = () => {
    const { user, dbUser } = useAuth();
    const role = dbUser?.role || 'student';

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            <DashboardSidebar role={role} />
            <main className="flex-1 h-full overflow-y-auto px-8 py-12 lg:px-12 scrollbar-hide">
                <div className="max-w-6xl mx-auto">
                    <Routes>
                        <Route index element={
                            role === 'admin' ? <AdminDashboard /> :
                                role === 'tutor' ? <TutorDashboard /> :
                                    <StudentDashboard />
                        } />
                        <Route path="profile" element={<Profile />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
