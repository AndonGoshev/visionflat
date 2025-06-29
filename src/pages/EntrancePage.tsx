import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import Layout from '../components/Layout';
import EntranceDetailClient from '../components/admin/EntranceDetailClient';

// Types

type Building = Database['public']['Tables']['buildings']['Row'];
type Entrance = Database['public']['Tables']['entrances']['Row'];
type Floor = Database['public']['Tables']['floors']['Row'];

export default function EntrancePage() {
  const { buildingId, entranceId } = useParams<{ buildingId: string; entranceId: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [entrance, setEntrance] = useState<Entrance | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!buildingId || !entranceId) return;
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  if (!building || !entrance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Entrance or Building not found</h2>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <EntranceDetailClient building={building} entrance={entrance} floors={floors} />
    </Layout>
  );
} 