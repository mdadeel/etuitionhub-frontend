import "./app.css";
import { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Navbar from "./components/shared/Navbar";
import MobileBottomNav from "./components/shared/MobileBottomNav";
import toast, { Toaster } from "react-hot-toast";
import Footer from "./components/shared/Footer";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChatProvider } from "./contexts/ChatContext";
import useSocketEvents from "./hooks/useSocketEvents";
import useHeartbeat from "./hooks/useHeartbeat";
import ToastViewport from "./components/shared/ToastViewport";
import PrivateRoute from "./components/shared/PrivateRoute";
import PublicRoute from "./components/shared/PublicRoute";
import FloatingChat from "./components/shared/FloatingChat";
import { cn } from "@/lib/utils";
import RouteErrorBoundary from "./components/shared/RouteErrorBoundary";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import { DynamicIslandProvider } from "./contexts/DynamicIslandProvider";
import { DynamicIsland } from "./components/shared/DynamicIsland";

// Lazy-loaded page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Tuitions = lazy(() => import("./pages/Tuitions"));
const Tutors = lazy(() => import("./pages/Tutors"));
const Blog = lazy(() => import("./pages/Blog"));
const TutorDetails = lazy(() => import("./pages/TutorDetails"));
const TuitionDetails = lazy(() => import("./pages/TuitionDetails"));
const PostTuition = lazy(() => import("./pages/PostTuition"));
const BecomeTutor = lazy(() => import("./pages/BecomeTutor"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SessionRoom = lazy(() => import("./pages/SessionRoom"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentHistory = lazy(() => import("./pages/PaymentHistory"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const TutorsByCity = lazy(() => import("./pages/TutorsByCity"));
const AiAssistantHome = lazy(() => import("./pages/AiAssistant/AiAssistantHome"));
const AiAssistantChat = lazy(() => import("./pages/AiAssistant/AiAssistantChat"));
const AiAssistantQuiz = lazy(() => import("./pages/AiAssistant/AiAssistantQuiz"));
const AiAssistantHistory = lazy(() => import("./pages/AiAssistant/AiAssistantHistory"));
const AiAssistantTutorTools = lazy(() => import("./pages/AiAssistant/AiAssistantTutorTools"));
const SavedNotes = lazy(() => import("./pages/AiAssistant/SavedNotes"));
const AiAssistantSettings = lazy(() => import("./pages/AiAssistant/AiAssistantSettings"));
const OrganizationDirectory = lazy(() => import("./pages/OrganizationDirectory"));
const OrganizationDetails = lazy(() => import("./pages/OrganizationDetails"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const ConditionalNavbar = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard");
  const isSession = pathname.startsWith("/session");
  if (isDashboard || isSession) return null;
  return <Navbar />;
};

const ConditionalFooter = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard");
  const isSession = pathname.startsWith("/session");
  const isTutors = pathname.startsWith("/tutors");
  const isTuitions = pathname.startsWith("/tuitions");
  const isAiAssistant = pathname.startsWith("/ai-assistant");
  const isAuth = pathname === "/login" || pathname === "/register";
  if (isDashboard || isSession || isTutors || isTuitions || isAiAssistant || isAuth) return null;
  return <Footer />;
};

const ConditionalMobileBottomNav = () => {
  const { pathname } = useLocation();
  const isSession = pathname.startsWith("/session");
  const isCheckout = pathname.startsWith("/checkout");
  if (isSession || isCheckout) return null;
  return <MobileBottomNav />;
};

const ConditionalFloatingChat = () => {
  const { pathname } = useLocation();
  const { dbUser } = useAuth();
  const isSession = pathname.startsWith("/session");
  const isAiAssistant = pathname.startsWith("/ai-assistant");
  if (isSession || isAiAssistant) return null;
  if (!dbUser) return null;
  return <FloatingChat />;
};

const MainContent = ({ children }) => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/dashboard");
  const isSession = pathname.startsWith("/session");

  return (
    <main
      className={cn(
        "flex-grow transition-all duration-300",
        !isDashboard && !isSession ? "pt-14 safe-bottom" : "pt-0",
      )}
    >
      {children}
    </main>
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

const HeartbeatBridge = () => {
  useHeartbeat();
  return null;
};

let App = () => {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <DynamicIslandProvider>
            <RealtimeBridge />
            <HeartbeatBridge />
            <BrowserRouter>
              <SessionExpiryCheck />
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
              <DynamicIsland />
              <ConditionalNavbar />
              <MainContent>
                <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
                <Routes>
                  <Route path="/" element={<RouteErrorBoundary><Home /></RouteErrorBoundary>} />
                  <Route path="/tuitions" element={<RouteErrorBoundary><Tuitions /></RouteErrorBoundary>} />
                  <Route path="/tutors" element={<RouteErrorBoundary><Tutors /></RouteErrorBoundary>} />
                  <Route path="/tutors/:city" element={<RouteErrorBoundary><TutorsByCity /></RouteErrorBoundary>} />
                  <Route path="/tutor/:id" element={<RouteErrorBoundary><TutorDetails /></RouteErrorBoundary>} />
                  <Route path="/tuition/:id" element={<RouteErrorBoundary><TuitionDetails /></RouteErrorBoundary>} />
                  <Route path="/about" element={<RouteErrorBoundary><About /></RouteErrorBoundary>} />
                  <Route path="/contact" element={<RouteErrorBoundary><Contact /></RouteErrorBoundary>} />
                  <Route path="/post-tuition" element={<RouteErrorBoundary><PostTuition /></RouteErrorBoundary>} />
                  <Route path="/become-tutor" element={<RouteErrorBoundary><BecomeTutor /></RouteErrorBoundary>} />
                  <Route path="/blog" element={<RouteErrorBoundary><Blog /></RouteErrorBoundary>} />
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
                    element={
                      <RouteErrorBoundary>
                        <PrivateRoute>
                          <PaymentHistory />
                        </PrivateRoute>
                      </RouteErrorBoundary>
                    }
                  />
                  <Route path="/search" element={<RouteErrorBoundary><SearchPage /></RouteErrorBoundary>} />
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
                  <Route path="*" element={<RouteErrorBoundary><NotFound /></RouteErrorBoundary>} />
                </Routes>
                </Suspense>
              </MainContent>
                <ConditionalFooter />
                <ConditionalMobileBottomNav />
                <ConditionalFloatingChat />
              </div>
            </BrowserRouter>
          </DynamicIslandProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
