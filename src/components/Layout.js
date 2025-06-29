import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Building2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
export default function Layout({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                // Fetch user profile
                const { data: profileData } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();
                setProfile(profileData);
            }
        };
        getUser();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session?.user) {
                setProfile(null);
            }
        });
        return () => subscription.unsubscribe();
    }, []);
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error('Error signing out');
        }
        else {
            toast.success('Signed out successfully');
        }
    };
    return (_jsxs("div", { className: "min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white flex flex-col", children: [_jsx("nav", { className: "bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50", children: _jsx("div", { className: "w-full px-4", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Building2, { className: "h-8 w-8 text-orange-400" }), _jsx("span", { className: "text-xl font-bold text-white", children: "VisionFlat" })] }), user && (_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm font-medium text-white", children: profile?.full_name || user.email }), profile?.company_name && (_jsx("div", { className: "text-xs text-white/70", children: profile.company_name }))] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleSignOut, className: "flex items-center space-x-2 border-white/30 text-white hover:bg-white/10", children: [_jsx(LogOut, { className: "h-4 w-4" }), _jsx("span", { children: "Sign Out" })] })] }))] }) }) }), _jsx("main", { className: "flex-1 w-full", children: children })] }));
}
