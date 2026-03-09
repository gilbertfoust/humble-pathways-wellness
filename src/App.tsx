import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Founder from "./pages/Founder";
import HowItWorks from "./pages/HowItWorks";
import Research from "./pages/Research";
import HipaaCompliance from "./pages/HipaaCompliance";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ReflectionChat from "./pages/ReflectionChat";
import ClinicianHub from "./pages/ClinicianHub";
import PromptLibrary from "./pages/PromptLibrary";
import ResourceHub from "./pages/ResourceHub";
import SavedReflections from "./pages/SavedReflections";
import MemberSettings from "./pages/MemberSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPrompts from "./pages/admin/AdminPrompts";
import AdminResources from "./pages/admin/AdminResources";
import AdminStats from "./pages/admin/AdminStats";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/founder" element={<Founder />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/research" element={<Research />} />
              <Route path="/hipaa" element={<HipaaCompliance />} />
              <Route path="/community" element={<Community />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected member routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/reflection" element={
                <ProtectedRoute><ReflectionChat /></ProtectedRoute>
              } />
              <Route path="/prompts" element={
                <ProtectedRoute><PromptLibrary /></ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute><ResourceHub /></ProtectedRoute>
              } />
              <Route path="/saved" element={
                <ProtectedRoute><SavedReflections /></ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute><MemberSettings /></ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={
                <AdminRoute><AdminDashboard /></AdminRoute>
              } />
              <Route path="/admin/prompts" element={
                <AdminRoute><AdminPrompts /></AdminRoute>
              } />
              <Route path="/admin/resources" element={
                <AdminRoute><AdminResources /></AdminRoute>
              } />
              <Route path="/admin/stats" element={
                <AdminRoute><AdminStats /></AdminRoute>
              } />
              <Route path="/admin/settings" element={
                <AdminRoute><AdminSettings /></AdminRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
