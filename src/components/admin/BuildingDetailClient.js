"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, Building, Plus, DoorOpen, ChevronRight } from 'lucide-react';
import { EntranceForm } from './EntranceForm';
import { supabase } from '../../lib/supabase';
export default function BuildingDetailClient({ building, entrances: initialEntrances }) {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [entrances, setEntrances] = useState(initialEntrances);
    // Fetch entrances after a new one is created
    const fetchEntrances = async () => {
        if (!building)
            return;
        const { data, error } = await supabase
            .from('entrances')
            .select('*')
            .eq('building_id', building.id)
            .order('label');
        if (!error && data)
            setEntrances(data);
    };
    const handleEntranceCreated = () => {
        setShowForm(false);
        fetchEntrances();
    };
    if (!building) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-xl font-semibold text-white mb-2", children: "Building not found" }), _jsxs(Button, { variant: "outline", onClick: () => navigate('/admin'), className: "border-white/30 text-white hover:bg-white/10", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Dashboard"] })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900", children: [_jsx("nav", { className: "bg-black/20 backdrop-blur-sm border-b border-white/10", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "flex items-center h-16", children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate('/admin'), className: "text-white hover:bg-white/10", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Dashboard"] }) }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Building, { className: "h-6 w-6 text-orange-400" }), _jsx("h1", { className: "text-3xl font-bold text-white", children: building.name }), _jsxs(Badge, { variant: "secondary", className: "bg-white/20 text-white border-white/30", children: ["/", building.slug] })] }), _jsxs("p", { className: "text-white/80", children: [building.address, ", ", building.city] }), building.notes && (_jsx("p", { className: "text-white/80 mt-2", children: building.notes }))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: "Entrances" }), _jsxs(Button, { onClick: () => setShowForm(true), className: "flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "Add Entrance" })] })] }), showForm && (_jsx("div", { className: "mb-6", children: _jsx(EntranceForm, { buildingId: building.id, onSuccess: handleEntranceCreated, onCancel: () => setShowForm(false) }) })), entrances.length === 0 ? (_jsx(Card, { className: "bg-white/10 backdrop-blur-sm border-white/20", children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(DoorOpen, { className: "h-12 w-12 text-white/60 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-white mb-2", children: "No entrances yet" }), _jsx("p", { className: "text-white/80 mb-4", children: "Add entrances to organize your building structure" }), _jsxs(Button, { onClick: () => setShowForm(true), className: "bg-orange-500 hover:bg-orange-600 text-white", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Entrance"] })] }) })) : (_jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: entrances.map((entrance) => (_jsxs(Card, { className: "hover:shadow-xl transition-all bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(DoorOpen, { className: "h-5 w-5 text-orange-400" }), _jsxs("span", { className: "text-white", children: ["Entrance ", entrance.label] })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-white/70", children: ["Created ", new Date(entrance.created_at).toLocaleDateString()] }), _jsx("div", { className: "flex gap-2", children: _jsx(Link, { to: `/admin/buildings/${building.id}/entrances/${entrance.id}`, children: _jsxs(Button, { variant: "outline", size: "sm", className: "border-white/30 text-white hover:bg-white/10", children: [_jsx("span", { children: "Manage" }), _jsx(ChevronRight, { className: "h-4 w-4 ml-1" })] }) }) })] }) })] }, entrance.id))) }))] })] })] }));
}
