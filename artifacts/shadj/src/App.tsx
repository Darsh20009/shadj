import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setAuthTokenGetter } from "@workspace/api-client-react";

import { RootLayout } from "@/components/layout/RootLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AIChatbot from "@/components/AIChatbot";

import Home from "@/pages/home";

const Portfolio     = lazy(() => import("@/pages/portfolio"));
const About         = lazy(() => import("@/pages/about"));
const Order         = lazy(() => import("@/pages/order"));
const Login         = lazy(() => import("@/pages/login"));
const Dashboard     = lazy(() => import("@/pages/dashboard"));
const AdminDashboard  = lazy(() => import("@/pages/admin/dashboard"));
const AdminPortfolio  = lazy(() => import("@/pages/admin/portfolio"));
const AdminOrders     = lazy(() => import("@/pages/admin/orders"));
const AdminUsers      = lazy(() => import("@/pages/admin/users"));
const AdminAnalytics  = lazy(() => import("@/pages/admin/analytics"));
const NotFound        = lazy(() => import("@/pages/not-found"));

setAuthTokenGetter(() => localStorage.getItem("shadj_token"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0816]">
      <div className="w-8 h-8 border-2 border-[#3730A3] border-t-[#F5E6C8] rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />

        <Route path="/admin">
          <AdminLayout><AdminDashboard /></AdminLayout>
        </Route>
        <Route path="/admin/portfolio">
          <AdminLayout><AdminPortfolio /></AdminLayout>
        </Route>
        <Route path="/admin/orders">
          <AdminLayout><AdminOrders /></AdminLayout>
        </Route>
        <Route path="/admin/users">
          <AdminLayout><AdminUsers /></AdminLayout>
        </Route>
        <Route path="/admin/analytics">
          <AdminLayout><AdminAnalytics /></AdminLayout>
        </Route>

        <Route path="/">
          <RootLayout><Home /></RootLayout>
        </Route>
        <Route path="/portfolio">
          <RootLayout>
            <Suspense fallback={<PageLoader />}>
              <Portfolio />
            </Suspense>
          </RootLayout>
        </Route>
        <Route path="/about">
          <RootLayout>
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          </RootLayout>
        </Route>
        <Route path="/order">
          <RootLayout>
            <Suspense fallback={<PageLoader />}>
              <Order />
            </Suspense>
          </RootLayout>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base="">
          <Router />
          <AIChatbot />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
