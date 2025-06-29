"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Building, DoorOpen, Plus, Hash } from 'lucide-react';
import { FloorForm } from './FloorForm';
import { supabase } from '../../lib/supabase';
export default function EntranceDetailClient({ building, entrance, floors: initialFloors }) {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [floors, setFloors] = useState(initialFloors);
    // Fetch floors after a new one is created
    const fetchFloors = async () => {
        const { data, error } = await supabase
            .from('floors')
            .select('*')
            .eq('entrance_id', entrance.id)
            .order('floor_number');
        if (!error && data)
            setFloors(data);
    };
    const handleFloorCreated = () => {
        setShowForm(false);
        fetchFloors();
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900", children: [_jsx("nav", { className: "bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "flex items-center h-16", children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate(`/admin/buildings/${building.id}`), className: "text-white hover:bg-white/10", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Building"] }) }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8 border-b border-white/10 pb-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Building, { className: "h-5 w-5 text-orange-400" }), _jsx("span", { className: "text-white/80", children: building.name }), _jsx("span", { className: "text-white/40", children: "\u2022" }), _jsx(DoorOpen, { className: "h-5 w-5 text-orange-400" }), _jsxs("h1", { className: "text-3xl font-bold text-white", children: ["Entrance ", entrance.label] })] }), _jsx("p", { className: "text-white/80", children: "Manage floors and flats for this entrance" })] }), floors.length > 0 && (_jsxs("div", { className: "mb-6 flex items-center gap-4", children: [_jsx("label", { htmlFor: "floor-select", className: "font-medium text-white", children: "Manage Floors:" }), _jsxs("select", { id: "floor-select", className: "rounded border px-3 py-2 bg-white/10 text-white border-white/20 backdrop-blur-sm focus:ring-2 focus:ring-orange-400", onChange: e => {
                                    const floorId = e.target.value;
                                    if (floorId) {
                                        navigate(`/admin/buildings/${building.id}/entrances/${entrance.id}/floors/${floorId}`);
                                    }
                                }, defaultValue: "", children: [_jsx("option", { value: "", disabled: true, children: "Select a floor..." }), floors.map(floor => (_jsxs("option", { value: floor.id, className: "text-slate-900", children: ["Floor ", floor.floor_number] }, floor.id)))] })] })), _jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: "Floors" }), _jsxs(Button, { onClick: () => setShowForm(true), className: "flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "Add Floor" })] })] }), showForm && (_jsx("div", { className: "mb-6", children: _jsx(FloorForm, { entranceId: entrance.id, onSuccess: handleFloorCreated, onCancel: () => setShowForm(false) }) })), floors.length === 0 ? (_jsx(Card, { className: "bg-white/10 backdrop-blur-sm border-white/20", children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(Hash, { className: "h-12 w-12 text-white/60 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-white mb-2", children: "No floors yet" }), _jsx("p", { className: "text-white/80 mb-4", children: "Add floors to organize your flats by level" }), _jsxs(Button, { onClick: () => setShowForm(true), className: "bg-orange-500 hover:bg-orange-600 text-white", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Floor"] })] }) })) : (_jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: floors.map((floor) => (_jsxs(Card, { className: "bg-white/10 backdrop-blur-sm border-white/20 hover:shadow-xl hover:bg-white/15 transition-all duration-200", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(Hash, { className: "h-5 w-5 text-orange-400" }), _jsxs("span", { className: "text-white", children: ["Floor ", floor.floor_number] })] }) }), _jsx(CardContent, { children: _jsx(Button, { onClick: () => navigate(`/admin/buildings/${building.id}/entrances/${entrance.id}/floors/${floor.id}`), className: "bg-orange-500 hover:bg-orange-600 text-white w-full mt-2", children: "Manage" }) })] }, floor.id))) }))] })] }));
}
