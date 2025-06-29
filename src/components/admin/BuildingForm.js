'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
export function BuildingForm({ onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        address: '',
        city: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };
    const handleNameChange = (name) => {
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name),
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user)
                throw new Error('Not authenticated');
            const { error } = await supabase
                .from('buildings')
                .insert([{
                    ...formData,
                    user_id: user.id,
                }]);
            if (error)
                throw error;
            toast.success('Building created successfully!');
            onSuccess();
        }
        catch (error) {
            toast.error('Error creating building: ' + error.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Card, { className: "bg-white/10 backdrop-blur-sm border-white/20", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-white", children: "Add New Building" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", className: "text-white", children: "Building Name *" }), _jsx(Input, { id: "name", type: "text", placeholder: "e.g., Sunny Towers", value: formData.name, onChange: (e) => handleNameChange(e.target.value), required: true, className: "bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "slug", className: "text-white", children: "URL Slug *" }), _jsx(Input, { id: "slug", type: "text", placeholder: "e.g., sunny-towers", value: formData.slug, onChange: (e) => setFormData({ ...formData, slug: e.target.value }), required: true, className: "bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400" }), _jsxs("p", { className: "text-xs text-white/60", children: ["Used in URLs: /", formData.slug, "/flat-number/room"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "address", className: "text-white", children: "Address *" }), _jsx(Input, { id: "address", type: "text", placeholder: "e.g., 123 Main Street", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }), required: true, className: "bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "city", className: "text-white", children: "City *" }), _jsx(Input, { id: "city", type: "text", placeholder: "e.g., New York", value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }), required: true, className: "bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "notes", className: "text-white", children: "Notes" }), _jsx(Textarea, { id: "notes", placeholder: "Additional information about the building...", value: formData.notes, onChange: (e) => setFormData({ ...formData, notes: e.target.value }), rows: 3, className: "bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400" })] }), _jsxs("div", { className: "flex space-x-2 pt-4", children: [_jsx(Button, { type: "submit", disabled: loading, className: "bg-orange-500 hover:bg-orange-600 text-white", children: loading ? 'Creating...' : 'Create Building' }), _jsx(Button, { type: "button", variant: "outline", onClick: onCancel, className: "border-white/30 text-white hover:bg-white/10", children: "Cancel" })] })] }) })] }));
}
