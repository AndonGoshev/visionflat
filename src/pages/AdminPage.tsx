import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Building2, Users, Home, Square } from 'lucide-react';
import { BuildingList } from '../components/admin/BuildingList';
import { LoginForm } from '../components/admin/LoginForm';
import type { User } from '@supabase/supabase-js';
import Layout from '../components/Layout';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    buildings: 0,
    flats: 0,
    rooms: 0,
    qrCodes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Fetch user stats
        await fetchStats(user.id);
      }
      setLoading(false);
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setStats({ buildings: 0, flats: 0, rooms: 0, qrCodes: 0 });
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const fetchStats = async (userId: string) => {
    try {
      // Count buildings
      const { count: buildingsCount } = await supabase
        .from('buildings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      // Count flats (through building ownership)
      const { count: flatsCount } = await supabase
        .from('flats')
        .select(`*,floor:floors!inner(entrance:entrances!inner(building:buildings!inner(user_id)))`, { count: 'exact', head: true })
        .eq('floor.entrance.building.user_id', userId);
      // Count rooms (through building ownership)
      const { count: roomsCount } = await supabase
        .from('rooms')
        .select(`*,flat:flats!inner(floor:floors!inner(entrance:entrances!inner(building:buildings!inner(user_id))))`, { count: 'exact', head: true })
        .eq('flat.floor.entrance.building.user_id', userId);
      setStats({
        buildings: buildingsCount || 0,
        flats: flatsCount || 0,
        rooms: roomsCount || 0,
        qrCodes: roomsCount || 0, // Each room can have a QR code
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Layout>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Property Portfolio
          </h1>
          <p className="text-white/80">
            Manage your buildings, create room visualizations, and generate QR codes for buyers
          </p>
        </div>
        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:shadow-xl hover:bg-white/15 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white flex items-center">
                <Building2 className="h-4 w-4 mr-2 text-orange-400" />
                Buildings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.buildings}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:shadow-xl hover:bg-white/15 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white flex items-center">
                <Home className="h-4 w-4 mr-2 text-orange-400" />
                Flats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.flats}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:shadow-xl hover:bg-white/15 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white flex items-center">
                <Square className="h-4 w-4 mr-2 text-orange-400" />
                Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.rooms}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:shadow-xl hover:bg-white/15 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white flex items-center">
                <Users className="h-4 w-4 mr-2 text-orange-400" />
                QR Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.qrCodes}</div>
            </CardContent>
          </Card>
        </div>
        {/* Buildings Section */}
        <div className="mt-12">
          <BuildingList onStatsUpdate={() => user && fetchStats(user.id)} />
        </div>
      </div>
    </Layout>
  );
} 