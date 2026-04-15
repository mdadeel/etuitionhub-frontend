import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';
import StudentDashboard from '../components/Dashboard/StudentDashboard';
import TutorDashboard from '../components/Dashboard/TutorDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import Profile from '../components/Dashboard/Profile';

/**
 * Dashboard Component
 * Refactored to "Technical Emerald Minimalism"
 */
const Dashboard = () => {
    const { user, dbUser } = useAuth();
    const role = dbUser?.role || 'student';

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30 selection:text-primary">
            {/* Main Sidebar Protocol */}
            <DashboardSidebar role={role} />
            
            <main className="flex-1 h-full overflow-y-auto relative scrollbar-hide">
                {/* Background Technical Grid Element */}
                <div className="absolute inset-0 z-0 opacity-[0.01] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
                </div>

                <div className="max-w-7xl mx-auto px-8 py-12 lg:px-16 relative z-10">
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
