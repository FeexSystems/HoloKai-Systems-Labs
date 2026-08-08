import React, { useState, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import { HoloKaiProvider } from '@/lib/HoloKaiContext';
import SectionSkeleton from '@/components/ui/SectionSkeleton';

// Route-level Code Splitting via React.lazy
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LandingIndex = lazy(() => import('@landing/pages/Index'));
const SplineLab = lazy(() => import('@landing/pages/SplineLab'));
const LandingAdmin = lazy(() => import('@landing/pages/Admin'));
const OrbitalLab = lazy(() => import('@/pages/OrbitalLab'));
const CivilizationCore = lazy(() => import('@/pages/CivilizationCore'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));

// Public / informational
const OraclePortal = lazy(() => import('@/pages/OraclePortal'));
const GuardianProfiles = lazy(() => import('@/pages/GuardianProfiles'));
const GuardianArchive = lazy(() => import('@/pages/GuardianArchive'));
const GlobalInsights = lazy(() => import('@/pages/GlobalInsights'));
const HelpCenter = lazy(() => import('@/pages/HelpCenter'));
const SystemStatus = lazy(() => import('@/pages/SystemStatus'));

// Protected / personal
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ResearchPortfolio = lazy(() => import('@/pages/ResearchPortfolio'));
const ResearchJournal = lazy(() => import('@/pages/ResearchJournal'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Settings = lazy(() => import('@/pages/Settings'));

// Mixed
const CommunityGallery = lazy(() => import('@/pages/CommunityGallery'));
const ContributionPortal = lazy(() => import('@/pages/ContributionPortal'));

import FloatingDock from '@/components/ui/FloatingDock';
import { useHoloKai } from '@/lib/HoloKaiContext';
import AncientDustCursor from '@/components/ui/AncientDustCursor';
import HoloKaiChatOverlay from '@/components/ui/HoloKaiChatOverlay';
import CulturalGlossary from '@/components/ui/CulturalGlossary';
import { cn } from '@/lib/utils';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Suspense fallback={<SectionSkeleton />}>
      <Routes>
        {/* Primary working application entry points */}
        <Route path="/" element={<LandingIndex />} />
        <Route path="/landing" element={<LandingIndex />} />
        <Route path="/vision" element={<LandingPage />} />
        <Route path="/core" element={<CivilizationCore />} />
        <Route path="/app" element={<CivilizationCore />} />

        {/* Labs — public, immersive entrances */}
        <Route path="/lab-spline" element={<SplineLab />} />
        <Route path="/orbital-lab" element={<OrbitalLab />} />
        <Route path="/landing-admin" element={<LandingAdmin />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Public / informational pages */}
        <Route path="/oracle-portal" element={<OraclePortal />} />
        <Route path="/oracle" element={<OraclePortal />} />
        <Route path="/guardian-profiles" element={<GuardianProfiles />} />
        <Route path="/guardian-archive" element={<GuardianArchive />} />
        <Route path="/civilization-archive" element={<GuardianArchive />} />
        <Route path="/global-insights" element={<GlobalInsights />} />
        <Route path="/research-portfolio" element={<ResearchPortfolio />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/system-status" element={<SystemStatus />} />

        {/* Mixed access (readable public, actions may require auth later) */}
        <Route path="/community-gallery" element={<CommunityGallery />} />
        <Route path="/contribution-portal" element={<ContributionPortal />} />

        {/* Protected — authenticated research environment */}
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/research-journal" element={<ResearchJournal />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};


const AppContent = ({ scanlinesEnabled, onToggleScanlines }) => {
  return (
    <div className={cn(
      "relative min-h-screen transition-colors duration-500 theme-midnight bg-[#06070a] text-zinc-100 selection:bg-amber-500/20 selection:text-amber-400",
      scanlinesEnabled && "scanline"
    )}>
      <AncientDustCursor />
      <AuthenticatedApp />
      <HoloKaiChatOverlay />
      <CulturalGlossary />
      <FloatingDock 
        scanlinesEnabled={scanlinesEnabled} 
        onToggleScanlines={onToggleScanlines} 
      />
    </div>
  );
};


function App() {
  const [scanlinesEnabled, setScanlinesEnabled] = useState(false);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <HoloKaiProvider>
            <AppContent 
              scanlinesEnabled={scanlinesEnabled} 
              onToggleScanlines={() => setScanlinesEnabled(!scanlinesEnabled)} 
            />
          </HoloKaiProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
