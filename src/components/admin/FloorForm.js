'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
export function FloorForm({ entranceId, onSuccess, onCancel }) {
    const [floorNumber, setFloorNumber] = useState(1);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('floors')
                .insert([{
                    entrance_id: entranceId,
                    floor_number: floorNumber,
                }]);
            if (error)
                throw error;
            toast.success('Floor created successfully!');
            onSuccess();
        }
        catch (error) {
            toast.error('Error creating floor: ' + error.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Card, { className: "bg-white/10 backdrop-blur-sm border-white/20", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-white", children: "Add New Floor" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "floorNumber", className: "text-white", children: "Floor Number *" }), _jsx(Input, { id: "floorNumber", type: "number", placeholder: "e.g., 1, 2, 3", value: floorNumber, onChange: (e) => setFloorNumber(parseInt(e.target.value) || 1), min: "0", max: "100", required: true, className: "bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400" }), _jsx("p", { className: "text-xs text-white/60", children: "Use 0 for ground floor, negative numbers for basement levels" })] }), _jsxs("div", { className: "flex space-x-2 pt-4", children: [_jsx(Button, { type: "submit", disabled: loading, className: "bg-orange-500 hover:bg-orange-600 text-white", children: loading ? 'Creating...' : 'Create Floor' }), _jsx(Button, { type: "button", variant: "outline", onClick: onCancel, className: "border-white/30 text-white hover:bg-white/10", children: "Cancel" })] })] }) })] }));
}
