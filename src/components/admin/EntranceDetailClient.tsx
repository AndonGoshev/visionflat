"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Building, DoorOpen, Plus, Hash } from 'lucide-react';
import { FloorForm } from './FloorForm';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

// Types

type Building = Database['public']['Tables']['buildings']['Row'];
type Entrance = Database['public']['Tables']['entrances']['Row'];
type Floor = Database['public']['Tables']['floors']['Row'];

interface EntranceDetailClientProps {
  building: Building;
  entrance: Entrance;
  floors: Floor[];
}

export default function EntranceDetailClient({ building, entrance, floors: initialFloors }: EntranceDetailClientProps) {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [floors, setFloors] = useState<Floor[]>(initialFloors);

  // Fetch floors after a new one is created
  const fetchFloors = async () => {
    const { data, error } = await supabase
      .from('floors')
      .select('*')
      .eq('entrance_id', entrance.id)
      .order('floor_number');
    if (!error && data) setFloors(data);
  };

  const handleFloorCreated = () => {
    setShowForm(false);
    fetchFloors();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/buildings/${building.id}`)} className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Building
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Building className="h-5 w-5 text-orange-400" />
            <span className="text-white/80">{building.name}</span>
            <span className="text-white/40">•</span>
            <DoorOpen className="h-5 w-5 text-orange-400" />
            <h1 className="text-3xl font-bold text-white">Entrance {entrance.label}</h1>
          </div>
          <p className="text-white/80">
            Manage floors and flats for this entrance
          </p>
        </div>

        {/* Manage Floors Dropdown */}
        {floors.length > 0 && (
          <div className="mb-6 flex items-center gap-4">
            <label htmlFor="floor-select" className="font-medium text-white">Manage Floors:</label>
            <select
              id="floor-select"
              className="rounded border px-3 py-2 bg-white/10 text-white border-white/20 backdrop-blur-sm focus:ring-2 focus:ring-orange-400"
              onChange={e => {
                const floorId = e.target.value;
                if (floorId) {
                  navigate(`/admin/buildings/${building.id}/entrances/${entrance.id}/floors/${floorId}`);
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Select a floor...</option>
              {floors.map(floor => (
                <option key={floor.id} value={floor.id} className="text-slate-900">
                  Floor {floor.floor_number}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Floors</h2>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Add Floor</span>
          </Button>
        </div>

        {showForm && (
          <div className="mb-6">
            <FloorForm
              entranceId={entrance.id}
              onSuccess={handleFloorCreated}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {floors.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="py-12 text-center">
              <Hash className="h-12 w-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No floors yet
              </h3>
              <p className="text-white/80 mb-4">
                Add floors to organize your flats by level
              </p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Floor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {floors.map((floor) => (
              <Card 
                key={floor.id} 
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:shadow-xl hover:bg-white/15 transition-all duration-200"
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Hash className="h-5 w-5 text-orange-400" />
                    <span className="text-white">Floor {floor.floor_number}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => navigate(`/admin/buildings/${building.id}/entrances/${entrance.id}/floors/${floor.id}`)}
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full mt-2"
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 