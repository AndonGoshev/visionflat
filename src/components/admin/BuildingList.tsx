'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Building, Plus, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { BuildingForm } from './BuildingForm';
import type { Database } from '../../lib/supabase';

type Building = Database['public']['Tables']['buildings']['Row'];

interface BuildingListProps {
  onStatsUpdate?: () => void;
}

export function BuildingList({ onStatsUpdate }: BuildingListProps) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBuildings(data || []);
    } catch (error: any) {
      toast.error('Error fetching buildings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuildingCreated = () => {
    setShowForm(false);
    fetchBuildings();
    onStatsUpdate?.();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Buildings</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="h-4 w-4" />
          <span>Add Building</span>
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <BuildingForm
            onSuccess={handleBuildingCreated}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {buildings.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="py-12 text-center">
            <Building className="h-12 w-12 text-white/60 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No buildings yet
            </h3>
            <p className="text-white/80 mb-4">
              Get started by adding your first building project
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Building
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {buildings.map((building) => (
            <Card 
              key={building.id} 
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:shadow-xl hover:bg-white/15 transition-all duration-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-orange-400" />
                      <span className="text-white">{building.name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-white/70">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{building.address}, {building.city}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(building.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    /{building.slug}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    {building.notes && (
                      <p className="text-white/80 text-sm mb-2">{building.notes}</p>
                    )}
                  </div>
                  <Link to={`/admin/buildings/${building.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <span>Manage</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}