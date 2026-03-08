import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Founder from "./pages/Founder";
import HowItWorks from "./pages/HowItWorks";
import Research from "./pages/Research";
import HipaaCompliance from "./pages/HipaaCompliance";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
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
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/founder" element={<Founder />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/research" element={<Research />} />
            <Route path="/hipaa" element={<HipaaCompliance />} />
            <Route path="/community" element={<Community />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reflection" element={<ReflectionChat />} />
            <Route path="/prompts" element={<PromptLibrary />} />
            <Route path="/resources" element={<ResourceHub />} />
            <Route path="/saved" element={<SavedReflections />} />
            <Route path="/settings" element={<MemberSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
