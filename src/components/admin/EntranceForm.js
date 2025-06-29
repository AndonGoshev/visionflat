'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
export function EntranceForm({ buildingId, onSuccess, onCancel }) {
    const [label, setLabel] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('entrances')
                .insert([{
                    building_id: buildingId,
                    label: label.trim(),
                }]);
            if (error)
                throw error;
            toast.success('Entrance created successfully!');
            onSuccess();
        }
        catch (error) {
            toast.error('Error creating entrance: ' + error.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Card, { className: "bg-white/10 backdrop-blur-sm border-white/20", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-white", children: "Add New Entrance" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "label", className: "text-white", children: "Entrance Label *" }), _jsx(Input, { id: "label", type: "text", placeholder: "e.g., A, B, C, Main, East", value: label, onChange: (e) => setLabel(e.target.value), required: true, className: "bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400" }), _jsx("p", { className: "text-xs text-white/60", children: "Common labels: A, B, C or Main, North, South, East, West" })] }), _jsxs("div", { className: "flex space-x-2 pt-4", children: [_jsx(Button, { type: "submit", disabled: loading, className: "bg-orange-500 hover:bg-orange-600 text-white", children: loading ? 'Creating...' : 'Create Entrance' }), _jsx(Button, { type: "button", variant: "outline", onClick: onCancel, className: "border-white/30 text-white hover:bg-white/10", children: "Cancel" })] })] }) })] }));
}
