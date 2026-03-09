import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import PromptLibrary from "./pages/PromptLibrary";
import ResourceHub from "./pages/ResourceHub";
import SavedReflections from "./pages/SavedReflections";
import MemberSettings from "./pages/MemberSettings";
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
              
              {/* Protected routes */}
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
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
