import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
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
import TutorSessions from '../components/Dashboard/TutorSessions';
import SavedTutors from '../components/Dashboard/SavedTutors';
import { Menu, X, Home, Bell } from 'lucide-react';
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

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Inline loading state - no spinner page
    if (loading || (user && !dbUser)) {
        return (
            <div className="flex h-screen bg-[#F5F7FA]">
                <div className="w-72 bg-white border-r border-[rgba(15,23,46,0.08)] hidden lg:flex" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
                        <span className="text-sm text-[#5B6475]">Loading dashboard...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
            
            {/* Desktop Sidebar */}
            <DashboardSidebar role={role} />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Content */}
            <div className={cn(
                "fixed inset-y-0 left-0 w-72 bg-white z-[70] lg:hidden transition-transform duration-300 border-r border-[rgba(15,23,46,0.08)] overflow-y-auto",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <DashboardSidebar role={role} />
            </div>
            
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative flex flex-col">
                {/* Dashboard Top Navbar */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[rgba(15,23,46,0.08)]">
                    <div className="flex items-center justify-between h-16 px-6">
                        {/* Left: Mobile menu toggle + breadcrumb */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-2 hover:bg-[#F5F7FA] rounded-lg transition-colors"
                            >
                                <Menu size={20} className="text-[#5B6475]" />
                            </button>
                            <nav className="flex items-center gap-2 text-sm">
                                <Link to="/" className="text-[#5B6475] hover:text-[#111827] transition-colors flex items-center gap-1.5">
                                    <Home size={14} />
                                    <span className="hidden sm:inline">Home</span>
                                </Link>
                                <span className="text-[#E2E8F0]">/</span>
                                <span className="text-[#111827] font-medium">Dashboard</span>
                            </nav>
                        </div>

                        {/* Right: User info + notifications */}
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 hover:bg-[#F5F7FA] rounded-lg transition-colors">
                                <Bell size={18} className="text-[#5B6475]" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full"></span>
                            </button>
                            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-[rgba(15,23,46,0.08)]">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-[#111827]">{user?.displayName?.split(' ')[0]}</p>
                                    <p className="text-xs text-[#5B6475] capitalize">{role}</p>
                                </div>
                                <div className="w-9 h-9 bg-[#EEF2F6] rounded-lg overflow-hidden border border-[rgba(15,23,46,0.08)]">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#5B6475] text-sm font-medium">
                                            {user?.displayName?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-grow p-6 md:p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto">
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
                                role === 'tutor' ? <TutorDashboard /> : <StudentDashboard />
                            } />

                            <Route path="sessions" element={
                                role === 'tutor' ? <TutorSessions /> : <Navigate to="/dashboard" replace />
                            } />

                            <Route path="payments" element={<StudentPayments />} />

                            <Route path="saved-tutors" element={<SavedTutors />} />

                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
