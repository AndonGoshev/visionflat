"use client";

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, Building, Plus, DoorOpen, ChevronRight } from 'lucide-react';
import { EntranceForm } from './EntranceForm';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

// Types

type Building = Database['public']['Tables']['buildings']['Row'];
type Entrance = Database['public']['Tables']['entrances']['Row'];

interface BuildingDetailClientProps {
  building: Building | null;
  entrances: Entrance[];
}

export default function BuildingDetailClient({ building, entrances: initialEntrances }: BuildingDetailClientProps) {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [entrances, setEntrances] = useState<Entrance[]>(initialEntrances);

  // Fetch entrances after a new one is created
  const fetchEntrances = async () => {
    if (!building) return;
    const { data, error } = await supabase
      .from('entrances')
      .select('*')
      .eq('building_id', building.id)
      .order('label');
    if (!error && data) setEntrances(data);
  };

  const handleEntranceCreated = () => {
    setShowForm(false);
    fetchEntrances();
  };

  if (!building) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Building not found</h2>
          <Button variant="outline" onClick={() => navigate('/admin')} className="border-white/30 text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Building Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Building className="h-6 w-6 text-orange-400" />
            <h1 className="text-3xl font-bold text-white">{building.name}</h1>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">/{building.slug}</Badge>
          </div>
          <p className="text-white/80">
            {building.address}, {building.city}
          </p>
          {building.notes && (
            <p className="text-white/80 mt-2">{building.notes}</p>
          )}
        </div>

        {/* Entrances Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Entrances</h2>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Add Entrance</span>
            </Button>
          </div>

          {showForm && (
            <div className="mb-6">
              <EntranceForm
                buildingId={building.id}
                onSuccess={handleEntranceCreated}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {entrances.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="py-12 text-center">
                <DoorOpen className="h-12 w-12 text-white/60 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No entrances yet
                </h3>
                <p className="text-white/80 mb-4">
                  Add entrances to organize your building structure
                </p>
                <Button onClick={() => setShowForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entrance
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {entrances.map((entrance) => (
                <Card key={entrance.id} className="hover:shadow-xl transition-all bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DoorOpen className="h-5 w-5 text-orange-400" />
                      <span className="text-white">Entrance {entrance.label}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-white/70">
                        Created {new Date(entrance.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/admin/buildings/${building.id}/entrances/${entrance.id}`}>
                          <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                            <span>Manage</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 