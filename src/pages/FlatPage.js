import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Layout from '../components/Layout';
export default function FlatPage() {
    const { flatId } = useParams();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [squareMeters, setSquareMeters] = useState('');
    const [creating, setCreating] = useState(false);
    const [flatSlug, setFlatSlug] = useState('');
    const [buildingSlug, setBuildingSlug] = useState('');
    const [entranceLabel, setEntranceLabel] = useState('');
    const [floorNumber, setFloorNumber] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [userId, setUserId] = useState('');
    useEffect(() => {
        const fetchRooms = async () => {
            if (!flatId)
                return;
            const { data } = await supabase
                .from('rooms')
                .select('id, room_name, square_meters, created_at, slug')
                .eq('flat_id', flatId)
                .order('room_name');
            setRooms(data || []);
            setLoading(false);
        };
        const fetchSlugs = async () => {
            if (!flatId)
                return;
            // Fetch flat slug, flat_number, and floor_id
            const { data: flatData } = await supabase
                .from('flats')
                .select('slug, flat_number, floor_id')
                .eq('id', flatId)
                .single();
            if (flatData) {
                setFlatSlug(flatData.slug);
                setFlatNumber(flatData.flat_number);
                // Fetch floor_number and entrance_id from floor
                const { data: floorData } = await supabase
                    .from('floors')
                    .select('floor_number, entrance_id')
                    .eq('id', flatData.floor_id)
                    .single();
                if (floorData) {
                    setFloorNumber(floorData.floor_number.toString());
                    // Fetch entrance label and building_id from entrance
                    const { data: entranceData } = await supabase
                        .from('entrances')
                        .select('label, building_id')
                        .eq('id', floorData.entrance_id)
                        .single();
                    if (entranceData) {
                        setEntranceLabel(entranceData.label);
                        // Fetch building slug
                        const { data: buildingData } = await supabase
                            .from('buildings')
                            .select('slug')
                            .eq('id', entranceData.building_id)
                            .single();
                        if (buildingData) {
                            setBuildingSlug(buildingData.slug);
                        }
                    }
                }
            }
        };
        const fetchUserId = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user)
                setUserId(user.id);
        };
        fetchRooms();
        fetchSlugs();
        fetchUserId();
    }, [flatId]);
    const handleAddRoom = async (e) => {
        e.preventDefault();
        setCreating(true);
        // Generate unique slug with user ID
        const slugParts = [
            userId,
            buildingSlug,
            entranceLabel,
            `floor${floorNumber}`,
            `flat${flatNumber}`,
            roomName
        ];
        const slug = slugParts
            .join('-')
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        const { error } = await supabase
            .from('rooms')
            .insert({
            flat_id: flatId,
            room_name: roomName,
            square_meters: Number(squareMeters),
            slug,
        });
        setCreating(false);
        if (error) {
            alert('Error creating room: ' + error.message);
            return;
        }
        setShowForm(false);
        setRoomName('');
        setSquareMeters('');
        // Refresh rooms after successful insert
        const { data, error: fetchError } = await supabase
            .from('rooms')
            .select('*')
            .eq('flat_id', flatId)
            .order('room_name');
        if (fetchError) {
            alert('Error fetching rooms: ' + fetchError.message);
            return;
        }
        setRooms(data || []);
    };
    if (loading) {
        return (_jsx(Layout, { children: _jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400" }) }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-8", children: "Rooms in this Flat" }), _jsx("div", { className: "flex justify-end mb-6", children: _jsx(Button, { onClick: () => setShowForm(true), className: "flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white", children: "Add Room" }) }), showForm && (_jsxs(Card, { className: "mb-6 bg-white/10 backdrop-blur-sm border-white/20", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-white", children: "Add New Room" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleAddRoom, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-white", children: "Room Name *" }), _jsx("input", { type: "text", value: roomName, onChange: e => setRoomName(e.target.value), required: true, className: "w-full border border-white/30 rounded px-3 py-2 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400", placeholder: "Enter room name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1 text-white", children: "Square Meters *" }), _jsx("input", { type: "number", value: squareMeters, onChange: e => setSquareMeters(e.target.value), required: true, min: "1", className: "w-full border border-white/30 rounded px-3 py-2 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400", placeholder: "e.g. 25" })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { type: "submit", disabled: creating, className: "bg-orange-500 hover:bg-orange-600 text-white", children: creating ? 'Creating...' : 'Create Room' }), _jsx(Button, { type: "button", variant: "outline", onClick: () => setShowForm(false), className: "border-white/30 text-white hover:bg-white/10", children: "Cancel" })] })] }) })] })), rooms.length === 0 ? (_jsxs(Card, { className: "p-8 text-center bg-white/10 backdrop-blur-sm border-white/20", children: [_jsx("h3", { className: "text-lg font-medium text-white mb-2", children: "No rooms yet" }), _jsx("p", { className: "text-white/80 mb-4", children: "Add a room to this flat to get started." })] })) : (_jsx("div", { className: "grid gap-4", children: rooms.map(room => (_jsxs(Card, { className: "hover:shadow-xl transition-all bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-white", children: room.room_name }), _jsxs("span", { className: "text-white/60 text-sm", children: [room.square_meters, " m\u00B2"] })] }) }), _jsx(CardContent, { children: buildingSlug && flatSlug && room.slug && (_jsx(Link, { to: `/${buildingSlug}/${flatSlug}/${room.slug}`, children: _jsx(Button, { className: "bg-orange-500 hover:bg-orange-600 text-white w-full mt-2", size: "sm", children: "Manage" }) })) })] }, room.id))) }))] }) }));
}
