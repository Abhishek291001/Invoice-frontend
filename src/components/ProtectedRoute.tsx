import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppRole } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && requiredRole && userRole) {
      const hasPermission = 
        userRole === 'superadmin' || 
        userRole === requiredRole || 
        (userRole === 'admin' && requiredRole === 'viewer');
      
      if (!hasPermission) {
        navigate('/dashboard');
      }
    }
  }, [user, userRole, loading, requiredRole, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
