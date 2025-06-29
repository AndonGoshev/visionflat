import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import BuildingDetailClient from '../components/admin/BuildingDetailClient';
import Layout from '../components/Layout';
export default function BuildingPage() {
    const { buildingId } = useParams();
    const [building, setBuilding] = useState(null);
    const [entrances, setEntrances] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            if (!buildingId)
                return;
            // Fetch building details
            const { data: building } = await supabase
                .from('buildings')
                .select('*')
                .eq('id', buildingId)
                .single();
            setBuilding(building || null);
            // Fetch entrances
            const { data: entrances } = await supabase
                .from('entrances')
                .select('*')
                .eq('building_id', buildingId)
                .order('label');
            setEntrances(entrances || []);
            setLoading(false);
        };
        fetchData();
    }, [buildingId]);
    if (loading) {
        return (_jsx(Layout, { children: _jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400" }) }) }));
    }
    return (_jsx(Layout, { children: _jsx(BuildingDetailClient, { building: building, entrances: entrances }) }));
}
