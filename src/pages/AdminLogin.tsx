
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Shield, Lock } from 'lucide-react';

const AdminLogin = () => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "Admin token is required",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, we would validate the token with the backend
    // For now, just show a toast message
    setTimeout(() => {
      setIsLoading(false);
      
      if (token === 'supersecuretoken123') {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        // In a real app, we would store the token and redirect to the admin dashboard
      } else {
        toast({
          title: "Invalid admin token",
          description: "Please check your token and try again",
          variant: "destructive"
        });
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter your admin token to access the dashboard</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Token
              </label>
              <div className="relative">
                <Input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your admin token"
                  className="pl-10"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                No OTP required. Use the token provided in your .env file.
              </p>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </>
              ) : (
                "Login to Admin Dashboard"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Hint: For demo purposes, use "supersecuretoken123"</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
