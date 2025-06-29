import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, Home } from 'lucide-react';
import Layout from '../components/Layout';
export default function FloorPage() {
    const { buildingId, entranceId, floorId } = useParams();
    const [flats, setFlats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [flatNumber, setFlatNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchFlats = async () => {
            if (!floorId)
                return;
            const { data } = await supabase
                .from('flats')
                .select('*')
                .eq('floor_id', floorId)
                .order('flat_number');
            setFlats(data || []);
            setLoading(false);
        };
        fetchFlats();
    }, [floorId]);
    const handleAddFlat = async (e) => {
        e.preventDefault();
        setCreating(true);
        const slug = flatNumber.toLowerCase().replace(/\s+/g, '-');
        await supabase
            .from('flats')
            .insert({
            floor_id: floorId,
            flat_number: flatNumber,
            slug,
            notes: notes || null,
        });
        setCreating(false);
        setShowForm(false);
        setFlatNumber('');
        setNotes('');
        // Refresh flats
        const { data } = await supabase
            .from('flats')
            .select('*')
            .eq('floor_id', floorId)
            .order('flat_number');
        setFlats(data || []);
    };
    if (loading) {
        return (_jsx(Layout, { children: _jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400" }) }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-8", children: "Flats on this Floor" }), _jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx(Button, { onClick: () => navigate(-1), variant: "outline", className: "border-white/30 text-white hover:bg-white/10", children: "Back" }), _jsxs(Button, { onClick: () => setShowForm(true), className: "flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "Add Flat" })] })] }), showForm && (_jsxs(Card, { className: "mb-6 bg-white/10 backdrop-blur-sm border-white/20", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-white", children: "Add New Flat" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleAddFlat, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-white", children: "Flat Number *" }), _jsx("input", { type: "text", value: flatNumber, onChange: e => setFlatNumber(e.target.value), required: true, className: "w-full border border-white/30 rounded px-3 py-2 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400", placeholder: "Enter flat number" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-white", children: "Notes" }), _jsx("textarea", { value: notes, onChange: e => setNotes(e.target.value), className: "w-full border border-white/30 rounded px-3 py-2 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400", placeholder: "Optional notes" })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { type: "submit", disabled: creating, className: "bg-orange-500 hover:bg-orange-600 text-white", children: creating ? 'Creating...' : 'Create Flat' }), _jsx(Button, { type: "button", variant: "outline", onClick: () => setShowForm(false), className: "border-white/30 text-white hover:bg-white/10", children: "Cancel" })] })] }) })] })), flats.length === 0 ? (_jsxs(Card, { className: "p-8 text-center bg-white/10 backdrop-blur-sm border-white/20", children: [_jsx(Home, { className: "h-12 w-12 text-white/60 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-white mb-2", children: "No flats yet" }), _jsx("p", { className: "text-white/80 mb-4", children: "Add a flat to this floor to get started." })] })) : (_jsx("div", { className: "grid gap-4", children: flats.map(flat => (_jsxs(Card, { className: "hover:shadow-xl transition-all bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(Home, { className: "h-5 w-5 text-orange-400" }), _jsxs("span", { className: "text-white", children: ["Flat ", flat.flat_number] })] }) }), _jsx(CardContent, { children: _jsx(Link, { to: `/admin/buildings/${buildingId}/entrances/${entranceId}/floors/${floorId}/flats/${flat.id}`, children: _jsx(Button, { className: "bg-orange-500 hover:bg-orange-600 text-white w-full mt-2", size: "sm", children: "Manage Flat" }) }) })] }, flat.id))) }))] }) }));
}
