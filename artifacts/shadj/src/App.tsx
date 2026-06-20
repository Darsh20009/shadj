import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setAuthTokenGetter } from "@workspace/api-client-react";

import { RootLayout } from "@/components/layout/RootLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";

import Home from "@/pages/home";
import Portfolio from "@/pages/portfolio";
import About from "@/pages/about";
import Order from "@/pages/order";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminPortfolio from "@/pages/admin/portfolio";
import AdminOrders from "@/pages/admin/orders";
import AdminUsers from "@/pages/admin/users";
import AdminAnalytics from "@/pages/admin/analytics";

import NotFound from "@/pages/not-found";

setAuthTokenGetter(() => localStorage.getItem("shadj_token"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
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
        <RootLayout><Portfolio /></RootLayout>
      </Route>
      <Route path="/about">
        <RootLayout><About /></RootLayout>
      </Route>
      <Route path="/order">
        <RootLayout><Order /></RootLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
