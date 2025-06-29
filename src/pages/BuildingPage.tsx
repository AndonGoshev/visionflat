import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import BuildingDetailClient from '../components/admin/BuildingDetailClient';
import type { Database } from '../lib/supabase';
import Layout from '../components/Layout';

// Types

type Building = Database['public']['Tables']['buildings']['Row'];
type Entrance = Database['public']['Tables']['entrances']['Row'];

export default function BuildingPage() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [entrances, setEntrances] = useState<Entrance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!buildingId) return;
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
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BuildingDetailClient building={building} entrances={entrances} />
    </Layout>
  );
} 