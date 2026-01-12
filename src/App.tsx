import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Admins from "./pages/Admins";

import Brands from "./pages/Brands/Brands";
import ClientForm from "./pages/ClientForm";
import ClientDetail from "./pages/ClientDetail";
import Invoices from "./pages/Invoices";
import InvoiceForm from "./pages/InvoiceForm";
import InvoiceDetail from "./pages/InvoiceDetail";
import NotFound from "./pages/NotFound";
import BrandForm from "./pages/Brands/BrandForm";
import BrandDetail from "./pages/Brands/BrandDetail";
import AdminDetail from "./pages/AdminDetail";
import Viewers from "./pages/Viewers";
import ViewerDetail from "./pages/ViewerDetail";
import ViewerForm from "./pages/ViewerForm";


import AdminForm from "./pages/AdminForm";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
               <Route
              path="/brands"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Brands />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Clients />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/new"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <ClientForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

             <Route
              path="/admins"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Admins />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admins/new"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <AdminForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

             <Route
              path="/viewers"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Viewers />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewers/new"
              element={
                <ProtectedRoute requiredRole="viewer">
                  <DashboardLayout>
                    <ViewerForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />


               <Route
              path="/brands/new"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <BrandForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ClientForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

              <Route
              path="/admins/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AdminForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />


             <Route
              path="/viewers/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ViewerForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
               <Route
              path="/brands/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BrandForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
              <Route
              path="/brands/:id/edit"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <BrandForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id/edit"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <ClientForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

             <Route
              path="/admins/:id/edit"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <AdminForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />


               <Route
              path="/viewers/:id/edit"
              element={
                <ProtectedRoute requiredRole="viewer">
                  <DashboardLayout>
                    <ViewerForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Invoices />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/new"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <InvoiceForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <InvoiceDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id/edit"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <InvoiceForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
