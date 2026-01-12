import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../Apiconfig/ApiConfig.ts'

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

 
  const [showResetModal, setShowResetModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Signed in successfully!' });
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`,
        { email: forgotEmail },
        { headers: { 'Content-Type': 'application/json' } }
      );

      toast({ title: 'Success', description: response.data.message || 'OTP sent!' });
      setShowResetModal(true); 
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        { email: forgotEmail, otp, newPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );

      toast({ title: 'Success', description: response.data.message || 'Password reset successfully!' });
      setShowResetModal(false);
      setForgotEmail('');
      setOtp('');
      setNewPassword('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Invoice Management</CardTitle>
          <CardDescription>Sign in to manage your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className=" w-full">
              <TabsTrigger value="signin" className="w-full">Sign In</TabsTrigger>
              <TabsTrigger value="forgot" className="w-full">Forgot Password</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button type='button' onClick={()=>setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'>
                    {showPassword?(
                        <svg xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2">
           <path d="M2 2l20 20M10.58 10.58A3 3 0 0112 9c1.66 0 3 1.34 3 3 0 .62-.19 1.19-.52 1.66M9.88 14.12A3 3 0 0112 15c1.66 0 3-1.34 3-3"/>
           <path d="M17.94 17.94C20.09 16.36 21.77 14.35 22 12c-.23-2.35-1.91-4.36-4.06-5.94M6.06 6.06C3.91 7.64 2.23 9.65 2 12c.23 2.35 1.91 4.36 4.06 5.94"/>
         </svg>
                     ):(
                        <svg xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2">
           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
           <circle cx="12" cy="12" r="3" />
         </svg>
                     )}
                   </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="forgot">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={forgotLoading}>
                  {forgotLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <Card className="w-full max-w-md p-6">
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>Enter OTP and new password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={forgotEmail} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>OTP</Label>
                  <Input type="text" value={otp} onChange={e => setOtp(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={resetLoading} className="w-full">
                    {resetLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                  <Button type="button" variant="secondary" className="w-full" onClick={() => setShowResetModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
