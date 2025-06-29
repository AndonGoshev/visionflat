import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';
import EntranceDetailClient from '../components/admin/EntranceDetailClient';
export default function EntrancePage() {
    const { buildingId, entranceId } = useParams();
    const [building, setBuilding] = useState(null);
    const [entrance, setEntrance] = useState(null);
    const [floors, setFloors] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            if (!buildingId || !entranceId)
                return;
            // Fetch building
            const { data: building } = await supabase
                .from('buildings')
                .select('*')
                .eq('id', buildingId)
                .single();
            setBuilding(building || null);
            // Fetch entrance
            const { data: entrance } = await supabase
                .from('entrances')
                .select('*')
                .eq('id', entranceId)
                .eq('building_id', buildingId)
                .single();
            setEntrance(entrance || null);
            // Fetch floors
            const { data: floors } = await supabase
                .from('floors')
                .select('*')
                .eq('entrance_id', entranceId)
                .order('floor_number');
            setFloors(floors || []);
            setLoading(false);
        };
        fetchData();
    }, [buildingId, entranceId]);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400" }) }));
    }
    if (!building || !entrance) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center", children: _jsx("div", { className: "text-center", children: _jsx("h2", { className: "text-xl font-semibold text-white mb-2", children: "Entrance or Building not found" }) }) }));
    }
    return (_jsx(Layout, { children: _jsx(EntranceDetailClient, { building: building, entrance: entrance, floors: floors }) }));
}
