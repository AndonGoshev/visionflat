'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
    const handleAuth = async (e) => {
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
                if (error)
                    throw error;
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
            }
            else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error)
                    throw error;
                toast.success('Signed in successfully!');
            }
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    const useDemoCredentials = () => {
        setEmail('demo@visionflat.com');
        setPassword('demo123456');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4", children: _jsxs(Card, { className: "w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2 mb-4", children: [_jsx(Building2, { className: "h-8 w-8 text-orange-400" }), _jsx("span", { className: "text-xl font-bold text-white", children: "VisionFlat" })] }), _jsx(CardTitle, { className: "text-2xl text-white", children: isSignUp ? 'Create Your Account' : 'Welcome Back' }), _jsx("p", { className: "text-white/80 text-sm", children: isSignUp
                                ? 'Start showcasing your properties with AI visualizations'
                                : 'Sign in to manage your property portfolio' })] }), _jsxs(CardContent, { children: [_jsxs("form", { onSubmit: handleAuth, className: "space-y-4", children: [isSignUp && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "fullName", className: "text-white", children: "Full Name *" }), _jsx(Input, { id: "fullName", type: "text", placeholder: "John Doe", value: fullName, onChange: (e) => setFullName(e.target.value), required: true, className: "bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "companyName", className: "text-white", children: "Company Name" }), _jsx(Input, { id: "companyName", type: "text", placeholder: "Your Real Estate Company", value: companyName, onChange: (e) => setCompanyName(e.target.value), className: "bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400" })] })] })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", className: "text-white", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "your@email.com", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", className: "text-white", children: "Password" }), _jsx(Input, { id: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400" })] }), _jsx(Button, { type: "submit", className: "w-full bg-orange-500 hover:bg-orange-600 text-white", disabled: loading, children: loading ? (_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" })) : (_jsxs(_Fragment, { children: [_jsx(LogIn, { className: "h-4 w-4 mr-2" }), isSignUp ? 'Create Account' : 'Sign In'] })) })] }), !isSignUp && (_jsxs("div", { className: "mt-4", children: [_jsx(Button, { type: "button", variant: "outline", className: "w-full border-white/30 text-white hover:bg-white/10", onClick: useDemoCredentials, children: "Use Demo Credentials" }), _jsx("p", { className: "text-xs text-white/60 text-center mt-2", children: "Email: demo@visionflat.com | Password: demo123456" })] })), _jsx("div", { className: "mt-6 text-center", children: _jsx("button", { type: "button", onClick: () => setIsSignUp(!isSignUp), className: "text-sm text-orange-400 hover:text-orange-300", children: isSignUp
                                    ? 'Already have an account? Sign in'
                                    : 'New to VisionFlat? Create an account' }) })] })] }) }));
}
