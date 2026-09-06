import "./app.css";
import { useEffect, useState, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import toast, { Toaster } from "react-hot-toast";
const Navbar = lazy(() => import("./components/shared/Navbar"));
const MobileBottomNav = lazy(() => import("./components/shared/MobileBottomNav"));
const Footer = lazy(() => import("./components/shared/Footer"));
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChatProvider } from "./contexts/ChatContext";
import useSocketEvents from "./hooks/useSocketEvents";
import useHeartbeat from "./hooks/useHeartbeat";
import useAnonBookmarkMigration from "./hooks/useAnonBookmarkMigration";
import ToastViewport from "./components/shared/ToastViewport";
import PrivateRoute from "./components/shared/PrivateRoute";
import PublicRoute from "./components/shared/PublicRoute";
import AdminRoute from "./components/shared/AdminRoute";
const FloatingChat = lazy(() => import("./components/shared/FloatingChat"));
const CommandPalette = lazy(() => import("./components/shared/CommandPalette"));
import { cn } from "@/lib/utils";
import RouteErrorBoundary from "./components/shared/RouteErrorBoundary";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import { DynamicIslandProvider } from "./contexts/DynamicIslandProvider";

/**
 * Legacy SEO URLs of the form /tutors/<city-slug> (e.g. /tutors/dhaka) must
 * keep resolving. The canonical mechanism is the ?area= query filter used by
 * the Tutors page and the Footer "Popular Areas" links, so this redirect
 * rewrites the old path shape onto it.
 */
const RedirectToTutorsCity = () => {
  const { city } = useParams();
  const cityName = (city || "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return <Navigate to={`/tutors?area=${encodeURIComponent(cityName)}`} replace />;
};
const DynamicIsland = lazy(() => import("./components/shared/DynamicIsland").then(m => ({ default: m.DynamicIsland })));

// Lazy-loaded page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Tuitions = lazy(() => import("./pages/Tuitions"));
const Tutors = lazy(() => import("./pages/Tutors"));
const TutorDetails = lazy(() => import("./pages/TutorDetails"));
const PublicBookingPage = lazy(() => import("./pages/PublicBookingPage"));
const TuitionDetails = lazy(() => import("./pages/TuitionDetails"));
const PostTuition = lazy(() => import("./pages/PostTuition"));
const BecomeTutor = lazy(() => import("./pages/BecomeTutor"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SessionRoom = lazy(() => import("./pages/SessionRoom"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AccessDenied = lazy(() => import("./pages/AccessDenied"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const AiAssistantHome = lazy(() => import("./pages/AiAssistant/AiAssistantHome"));const AiAssistantChat = lazy(() => import("./pages/AiAssistant/AiAssistantChat"));
const AiAssistantQuiz = lazy(() => import("./pages/AiAssistant/AiAssistantQuiz"));
const AiAssistantHistory = lazy(() => import("./pages/AiAssistant/AiAssistantHistory"));
const AiAssistantTutorTools = lazy(() => import("./pages/AiAssistant/AiAssistantTutorTools"));
const SavedNotes = lazy(() => import("./pages/AiAssistant/SavedNotes"));
const AiAssistantSettings = lazy(() => import("./pages/AiAssistant/AiAssistantSettings"));
const OrganizationDirectory = lazy(() => import("./pages/OrganizationDirectory"));
const OrganizationDetails = lazy(() => import("./pages/OrganizationDetails"));
const EngineeringShowcase = lazy(() => import("./pages/Docs/EngineeringShowcase"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));

const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));
const SuperAdminRoutes = lazy(() => import("./routes/SuperAdminRoutes"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const ConditionalNavbar = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/super-admin");
  const isSession = pathname.startsWith("/session");
  if (isDashboard || isSession) return null;
  return <Suspense fallback={null}><Navbar /></Suspense>;
};

const ConditionalFooter = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/super-admin");
  const isSession = pathname.startsWith("/session");
  const isAiAssistant = pathname.startsWith("/ai-assistant");
  const isAuth = pathname === "/login" || pathname === "/register";
  const isTutors = pathname.startsWith("/tutors");
  const isTuitions = pathname.startsWith("/tuitions");
  if (isDashboard || isSession || isAiAssistant || isAuth || isTutors || isTuitions) return null;
  return <Suspense fallback={null}><Footer /></Suspense>;
};

const ConditionalMobileBottomNav = () => {
  const { pathname } = useLocation();
  const isSession = pathname.startsWith("/session");
  const isCheckout = pathname.startsWith("/checkout");
  if (isSession || isCheckout) return null;
  return <Suspense fallback={null}><MobileBottomNav /></Suspense>;
};

const ConditionalFloatingChat = () => {
  const { pathname } = useLocation();
  const { dbUser } = useAuth();
  const isSession = pathname.startsWith("/session");
  const isAiAssistant = pathname.startsWith("/ai-assistant");
  if (isSession || isAiAssistant) return null;
  if (!dbUser) return null;
  return (
    <Suspense fallback={null}>
      <FloatingChat />
    </Suspense>
  );
};

const MainContent = ({ children }) => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/super-admin");
  const isSession = pathname.startsWith("/session");

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        className={cn(
          "flex-grow transition-all duration-300",
          !isDashboard && !isSession ? "pt-14 safe-bottom" : "pt-0",
        )}
      >
        {children}
      </main>
    </>
  );
};

const SessionExpiryCheck = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      toast.error("Session expired. Please login again.");
      window.history.replaceState({}, "", "/login");
    }
  }, [searchParams]);

  return null;
};

const RealtimeBridge = () => {
  useSocketEvents();
  return null;
};

const AnonBookmarkMigrationBridge = () => {
  useAnonBookmarkMigration();
  return null;
};

const HeartbeatBridge = () => {
  useHeartbeat();
  return null;
};

const CommandPaletteBridge = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Suspense fallback={null}>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </Suspense>
  );
};

const AuthenticatedProviders = ({ children }) => {
  const { user } = useAuth();
  if (!user) return children;
  return (
    <ChatProvider>
      <DynamicIslandProvider>
        <RealtimeBridge />
        <HeartbeatBridge />
        {children}
      </DynamicIslandProvider>
    </ChatProvider>
  );
};

let App = () => {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <AnonBookmarkMigrationBridge />
        <AuthenticatedProviders>
            <BrowserRouter>
              <CommandPaletteBridge />
              <SessionExpiryCheck />
            <ScrollToTop />
            <Toaster
                position="top-center"
                gutter={12}
                containerStyle={{ inset: 0 }}
                toastOptions={{
                    duration: 3500,
                    style: {
                        background: 'hsl(var(--card))',
                        color: 'hsl(var(--foreground))',
                        borderRadius: '10px',
                        boxShadow: '0 8px 30px rgb(0 0 0 / 0.12)',
                        fontSize: '14px',
                        padding: '10px 14px',
                    },
                    success: {
                        iconTheme: { primary: 'hsl(var(--success))', secondary: 'hsl(var(--card))' },
                        style: { color: 'hsl(var(--success))' },
                    },
                    error: {
                        iconTheme: { primary: 'hsl(var(--destructive))', secondary: 'hsl(var(--card))' },
                        style: { color: 'hsl(var(--destructive))' },
                    },
                    loading: {
                        iconTheme: { primary: 'hsl(var(--primary))', secondary: 'hsl(var(--card))' },
                        style: { color: 'hsl(var(--primary))' },
                    },
                    blank: {
                        style: { color: 'hsl(var(--muted-foreground))' },
                    },
                }}
            />
            <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
              <ConditionalNavbar />
              <MainContent>
                <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
                <Routes>
                  <Route path="/" element={<RouteErrorBoundary><Home /></RouteErrorBoundary>} />
                  <Route path="/tuitions" element={<RouteErrorBoundary><Tuitions /></RouteErrorBoundary>} />
                  <Route path="/tutors" element={<RouteErrorBoundary><Tutors /></RouteErrorBoundary>} />
                  <Route path="/tutors/:city" element={<RouteErrorBoundary><RedirectToTutorsCity /></RouteErrorBoundary>} />
                  <Route path="/tutor/:id" element={<RouteErrorBoundary><TutorDetails /></RouteErrorBoundary>} />
                  <Route path="/book/:tutorId" element={<RouteErrorBoundary><PublicBookingPage /></RouteErrorBoundary>} />
                  <Route path="/tuition/:id" element={<RouteErrorBoundary><TuitionDetails /></RouteErrorBoundary>} />
                  <Route path="/about" element={<RouteErrorBoundary><About /></RouteErrorBoundary>} />
                  <Route path="/contact" element={<RouteErrorBoundary><Contact /></RouteErrorBoundary>} />
                  <Route path="/testimonials" element={<RouteErrorBoundary><TestimonialsPage /></RouteErrorBoundary>} />
                  <Route path="/terms" element={<RouteErrorBoundary><Terms /></RouteErrorBoundary>} />
                  <Route path="/privacy" element={<RouteErrorBoundary><Privacy /></RouteErrorBoundary>} />
                  <Route
                    path="/post-tuition"
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <PostTuition />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route path="/become-tutor" element={<RouteErrorBoundary><BecomeTutor /></RouteErrorBoundary>} />
                  <Route path="/organizations" element={<RouteErrorBoundary><OrganizationDirectory /></RouteErrorBoundary>} />
                  <Route path="/organizations/:slug" element={<RouteErrorBoundary><OrganizationDetails /></RouteErrorBoundary>} />
                  <Route
                    path="/login"
                    element={
                      <RouteErrorBoundary>
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/password-reset"
                    element={
                      <RouteErrorBoundary>
                        <PublicRoute>
                          <PasswordReset />
                        </PublicRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <RouteErrorBoundary>
                        <PublicRoute>
                          <ResetPassword />
                        </PublicRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/admin-login"
                    element={
                      <RouteErrorBoundary>
                        <PublicRoute>
                          <AdminLogin />
                        </PublicRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <RouteErrorBoundary>
                        <PublicRoute>
                          <Register />
                        </PublicRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/dashboard/*"
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/admin/*"
                    element={
                      <RouteErrorBoundary>
                        <AdminRoute>
                          <AdminRoutes />
                        </AdminRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/super-admin/*"
                    element={
                      <RouteErrorBoundary>
                        <AdminRoute>
                          <SuperAdminRoutes />
                        </AdminRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/checkout/:id"
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <Checkout />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/session/:id"
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <SessionRoom />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/payment-success"
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <PaymentSuccess />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/payment-history"
                    element={<Navigate to="/dashboard/billing" replace />}
                  />
                  <Route path="/search" element={<RouteErrorBoundary><SearchPage /></RouteErrorBoundary>} />
                  <Route path="/docs/engineering" element={<RouteErrorBoundary><EngineeringShowcase /></RouteErrorBoundary>} />
                  <Route
                    path="/ai-assistant"
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <AiAssistantHome />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/ai-assistant/chat/:sessionId"
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <AiAssistantChat />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/ai-assistant/quiz/:quizId"
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <AiAssistantQuiz />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/ai-assistant/history"
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <AiAssistantHistory />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/ai-assistant/lesson-planner"
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <AiAssistantTutorTools />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/ai-assistant/saved-notes"
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <SavedNotes />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="/ai-assistant/settings"
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <AiAssistantSettings />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route path="/403" element={<RouteErrorBoundary><AccessDenied /></RouteErrorBoundary>} />
                  <Route path="*" element={<RouteErrorBoundary><NotFound /></RouteErrorBoundary>} />
                </Routes>
                </Suspense>
              </MainContent>
                <ConditionalFooter />
                <ConditionalMobileBottomNav />
                <ConditionalFloatingChat />
              </div>
            </BrowserRouter>
        </AuthenticatedProviders>
      </AuthProvider>
    </ThemeProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
