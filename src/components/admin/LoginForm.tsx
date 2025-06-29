'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Building2, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
  const [email, setEmail] = useState('demo@visionflat.com');
  const [password, setPassword] = useState('demo123456');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('SIGNUP:', email, password, fullName, companyName);
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              company_name: companyName,
            }
          }
        });
        if (error) throw error;
        
        // Create user profile
        if (data.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([{
              id: data.user.id,
              full_name: fullName,
              company_name: companyName,
            }]);
          
          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }
        
        toast.success('Account created successfully! You can now sign in.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Signed in successfully!');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const useDemoCredentials = () => {
    setEmail('demo@visionflat.com');
    setPassword('demo123456');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-orange-400" />
            <span className="text-xl font-bold text-white">VisionFlat</span>
          </div>
          <CardTitle className="text-2xl text-white">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </CardTitle>
          <p className="text-white/80 text-sm">
            {isSignUp 
              ? 'Start showcasing your properties with AI visualizations' 
              : 'Sign in to manage your property portfolio'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-white">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Your Real Estate Company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </Button>
          </form>
          
          {!isSignUp && (
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10"
                onClick={useDemoCredentials}
              >
                Use Demo Credentials
              </Button>
              <p className="text-xs text-white/60 text-center mt-2">
                Email: demo@visionflat.com | Password: demo123456
              </p>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-orange-400 hover:text-orange-300"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : 'New to VisionFlat? Create an account'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}