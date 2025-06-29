'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Building, Plus, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { BuildingForm } from './BuildingForm';
export function BuildingList({ onStatsUpdate }) {
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    useEffect(() => {
        fetchBuildings();
    }, []);
    const fetchBuildings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                return;
            const { data, error } = await supabase
                .from('buildings')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setBuildings(data || []);
        }
        catch (error) {
            toast.error('Error fetching buildings: ' + error.message);
        }
        finally {
            setLoading(false);
        }
    };
    const handleBuildingCreated = () => {
        setShowForm(false);
        fetchBuildings();
        onStatsUpdate?.();
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400" }) }));
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: "Your Buildings" }), _jsxs(Button, { onClick: () => setShowForm(true), className: "flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "Add Building" })] })] }), showForm && (_jsx("div", { className: "mb-6", children: _jsx(BuildingForm, { onSuccess: handleBuildingCreated, onCancel: () => setShowForm(false) }) })), buildings.length === 0 ? (_jsx(Card, { className: "bg-white/10 backdrop-blur-sm border-white/20", children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(Building, { className: "h-12 w-12 text-white/60 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-white mb-2", children: "No buildings yet" }), _jsx("p", { className: "text-white/80 mb-4", children: "Get started by adding your first building project" }), _jsxs(Button, { onClick: () => setShowForm(true), className: "bg-orange-500 hover:bg-orange-600 text-white", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Your First Building"] })] }) })) : (_jsx("div", { className: "grid gap-6", children: buildings.map((building) => (_jsxs(Card, { className: "bg-white/10 backdrop-blur-sm border-white/20 hover:shadow-xl hover:bg-white/15 transition-all duration-200", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(Building, { className: "h-5 w-5 text-orange-400" }), _jsx("span", { className: "text-white", children: building.name })] }), _jsxs("div", { className: "flex items-center space-x-4 mt-2 text-sm text-white/70", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(MapPin, { className: "h-4 w-4" }), _jsxs("span", { children: [building.address, ", ", building.city] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsx("span", { children: new Date(building.created_at).toLocaleDateString() })] })] })] }), _jsxs(Badge, { variant: "secondary", className: "bg-white/20 text-white border-white/30", children: ["/", building.slug] })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { children: building.notes && (_jsx("p", { className: "text-white/80 text-sm mb-2", children: building.notes })) }), _jsx(Link, { to: `/admin/buildings/${building.id}`, children: _jsxs(Button, { variant: "outline", size: "sm", className: "border-white/30 text-white hover:bg-white/10", children: [_jsx("span", { children: "Manage" }), _jsx(ChevronRight, { className: "h-4 w-4 ml-1" })] }) })] }) })] }, building.id))) }))] }));
}
