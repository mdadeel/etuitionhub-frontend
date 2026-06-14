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
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChatProvider } from "./contexts/ChatContext";
import useSocketEvents from "./hooks/useSocketEvents";
import useHeartbeat from "./hooks/useHeartbeat";
import ToastViewport from "./components/shared/ToastViewport";
import PrivateRoute from "./components/shared/PrivateRoute";
import PublicRoute from "./components/shared/PublicRoute";
import FloatingChat from "./components/shared/FloatingChat";
import VercelAlert from "./components/shared/VercelAlert";
import { cn } from "@/lib/utils";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import { DynamicIslandProvider } from "./contexts/DynamicIslandProvider";
import { DynamicIsland } from "./components/shared/DynamicIsland";
import { PageSkeleton } from "@/components/shared/skeletons";

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
const SearchPage = lazy(() => import("./pages/SearchPage"));
const TutorsByCity = lazy(() => import("./pages/TutorsByCity"));
const AiAssistantHome = lazy(() => import("./pages/AiAssistant/AiAssistantHome"));
const AiAssistantChat = lazy(() => import("./pages/AiAssistant/AiAssistantChat"));
const AiAssistantQuiz = lazy(() => import("./pages/AiAssistant/AiAssistantQuiz"));
const AiAssistantHistory = lazy(() => import("./pages/AiAssistant/AiAssistantHistory"));
const AiAssistantTutorTools = lazy(() => import("./pages/AiAssistant/AiAssistantTutorTools"));
const SavedNotes = lazy(() => import("./pages/AiAssistant/SavedNotes"));
const AiAssistantSettings = lazy(() => import("./pages/AiAssistant/AiAssistantSettings"));

// Loading fallback component
const PageLoader = () => <PageSkeleton />;

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
  if (isDashboard || isSession || isTutors || isTuitions || isAiAssistant) return null;
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
  const isSession = pathname.startsWith("/session");
  const isAiAssistant = pathname.startsWith("/ai-assistant");
  if (isSession || isAiAssistant) return null;
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
              <VercelAlert />
              <ConditionalNavbar />
              <MainContent>
                <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tuitions" element={<Tuitions />} />
                  <Route path="/tutors" element={<Tutors />} />
                  <Route path="/tutors/:city" element={<TutorsByCity />} />
                  <Route path="/tutor/:id" element={<TutorDetails />} />
                  <Route path="/tuition/:id" element={<TuitionDetails />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/post-tuition" element={<PostTuition />} />
                  <Route path="/become-tutor" element={<BecomeTutor />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/password-reset"
                    element={
                      <PublicRoute>
                        <PasswordReset />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/admin-login"
                    element={
                      <PublicRoute>
                        <AdminLogin />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/dashboard/*"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/checkout/:id"
                    element={
                      <PrivateRoute>
                        <Checkout />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/session/:id"
                    element={
                      <PrivateRoute>
                        <SessionRoom />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/payment-success"
                    element={
                      <PrivateRoute>
                        <PaymentSuccess />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/payment-history"
                    element={
                      <PrivateRoute>
                        <PaymentHistory />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/search" element={<SearchPage />} />
                  <Route
                    path="/ai-assistant"
                    element={
                      <PrivateRoute>
                        <AiAssistantHome />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ai-assistant/chat/:sessionId"
                    element={
                      <PrivateRoute>
                        <AiAssistantChat />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ai-assistant/quiz/:quizId"
                    element={
                      <PrivateRoute>
                        <AiAssistantQuiz />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ai-assistant/history"
                    element={
                      <PrivateRoute>
                        <AiAssistantHistory />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ai-assistant/lesson-planner"
                    element={
                      <PrivateRoute>
                        <AiAssistantTutorTools />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ai-assistant/saved-notes"
                    element={
                      <PrivateRoute>
                        <SavedNotes />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ai-assistant/settings"
                    element={
                      <PrivateRoute>
                        <AiAssistantSettings />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </Suspense>
                </ErrorBoundary>
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
  );
};

export default App;
