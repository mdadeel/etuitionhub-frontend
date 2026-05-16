import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';
import StudentDashboard from '../components/Dashboard/StudentDashboard';
import TutorDashboard from '../components/Dashboard/TutorDashboard';
import TutorProfile from '../components/Dashboard/TutorProfile';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import Profile from '../components/Dashboard/Profile';
import DashUsers from '../components/Dashboard/DashUsers';
import StudentPayments from '../components/Dashboard/StudentPayments';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Restricts a route to the admin role only.
 * Waits for dbUser to load before deciding — prevents false redirects.
 */
const AdminRoute = ({ children, role }) => {
    const { loading } = useAuth();
    if (loading) return null; // wait silently — Dashboard already shows a spinner
    if (role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
};

/**
 * Dashboard Component — role-aware routing hub with Apple Design System.
 */
const Dashboard = () => {
    const { user, dbUser, loading } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const role = dbUser?.role?.toLowerCase() || (loading ? '' : 'student');

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    if (loading || (user && !dbUser)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Initialising Node</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden selection:bg-blue-600/20 selection:text-blue-600">
            
            {/* Desktop Sidebar */}
            <DashboardSidebar role={role} />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Content */}
            <div className={cn(
                "fixed inset-y-0 left-0 w-72 bg-background z-[70] lg:hidden transition-transform duration-500 ease-apple border-r border-border/40 overflow-y-auto",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <DashboardSidebar role={role} />
            </div>
            
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scrollbar-hide flex flex-col pt-0 lg:pt-0">
                {/* Mobile spacing adjustment for removed header */}
                <div className="lg:hidden h-4" />

                {/* Background Dynamic Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] -mr-64 -mt-64 rounded-full pointer-events-none opacity-40 dark:opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] -ml-64 -mb-64 rounded-full pointer-events-none opacity-40 dark:opacity-20"></div>

                <div className="max-w-7xl w-full mx-auto px-6 py-8 md:px-12 md:py-16 lg:px-16 relative z-10 flex-grow">
                    <Routes>
                        <Route index element={
                            role === 'admin' ? <AdminDashboard /> :
                                role === 'tutor' ? <TutorDashboard /> :
                                    <StudentDashboard />
                        } />

                        <Route path="users" element={
                            <AdminRoute role={role}>
                                <DashUsers />
                            </AdminRoute>
                        } />

                        <Route path="profile" element={<Profile />} />

                        <Route path="my-profile" element={
                            role === 'tutor' ? <TutorProfile /> : <Navigate to="/dashboard/profile" replace />
                        } />

                        <Route path="applications" element={
                            role === 'tutor' ? <TutorDashboard /> : <Navigate to="/dashboard" replace />
                        } />

                        <Route path="payments" element={<StudentPayments />} />

                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
