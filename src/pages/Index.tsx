import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Shield, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">Invoice Pro</span>
          </div>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Professional Invoice Management
            <span className="block text-primary">Made Simple</span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Create, manage, and track invoices with ease. Multi-currency support,
            role-based access, and powerful features for modern businesses.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              View Demo
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-24 grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Multi-Currency</h3>
            <p className="text-sm text-muted-foreground">
              Support for INR, USD, EUR, GBP, AED, and more. Perfect for global businesses.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Role-Based Access</h3>
            <p className="text-sm text-muted-foreground">
              Superadmin, Admin, and Viewer roles with granular permissions.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Flexible Taxes</h3>
            <p className="text-sm text-muted-foreground">
              GST, VAT, CGST, SGST, IGST, and custom tax configurations.
            </p>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>© 2025 Invoice Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
