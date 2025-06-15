import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { trackPageView } from "./utils/analytics";
import { initializeSecurity } from "./utils/security";
import { initializeAnalytics } from "./config/analytics";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import AuthCallbackDebug from "./pages/AuthCallbackDebug";
import UserPortal from "./pages/UserPortal";
import BlogDetail from "./pages/BlogDetail";
import AdminPortal from "./pages/AdminPortal";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import AdminPreview from "./pages/AdminPreview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Analytics wrapper component to track route changes
const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(window.location.href);
  }, [location]);

  // Initialize security measures and analytics
  useEffect(() => {
    initializeSecurity();
    initializeAnalytics();
  }, []);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
              <Route path="/auth/callback" element={<AuthCallbackDebug />} />
              <Route path="/user" element={
                <ProtectedRoute>
                  <UserPortal />
                </ProtectedRoute>
              } />
              <Route path="/user/blog/:id" element={
                <ProtectedRoute>
                  <BlogDetail />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminPortal />
                </ProtectedRoute>
              } />
              <Route path="/admin/blog/new" element={
                <ProtectedRoute requireAdmin>
                  <CreateBlog />
                </ProtectedRoute>
              } />
              <Route path="/admin/blog/edit/:id" element={
                <ProtectedRoute requireAdmin>
                  <EditBlog />
                </ProtectedRoute>
              } />
              <Route path="/admin/preview/:id" element={
                <ProtectedRoute requireAdmin>
                  <AdminPreview />
                </ProtectedRoute>
              } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AnalyticsWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
