import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { Preloader } from "@/components/ui/Preloader";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Applications = lazy(() => import("./pages/Applications"));
const Arena = lazy(() => import("./pages/Arena"));
const Playground = lazy(() => import("./pages/Playground"));
const Assessments = lazy(() => import("./pages/Assessments"));
const Contests = lazy(() => import("./pages/Contests"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Network = lazy(() => import("./pages/Network"));
const Messages = lazy(() => import("./pages/Messages"));
const Profile = lazy(() => import("./pages/Profile"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Settings = lazy(() => import("./pages/Settings"));
const Learning = lazy(() => import("./pages/Learning"));
const NotFound = lazy(() => import("./pages/NotFound"));

// --- Asset Preloading for "Instant" Feel ---
// Initialize Draco loader exactly as in the component
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
dracoLoader.setDecoderConfig({ type: "js" });

// Start fetching the 3D model immediately
useLoader.preload(GLTFLoader, "/kibo-new.glb", (loader) => {
  loader.setDRACOLoader(dracoLoader);
});

// Full screen loader (fallback for lazy chunks)
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Global Preloader blocks view until 3D assets are ready */}
      <Preloader />

      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/network" element={<Network />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/learning" element={<Learning />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
