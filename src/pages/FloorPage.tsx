import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, Home } from 'lucide-react';
import Layout from '../components/Layout';

interface Flat {
  id: string;
  flat_number: string;
  slug: string;
  notes: string | null;
  created_at: string;
}

export default function FloorPage() {
  const { buildingId, entranceId, floorId } = useParams<{
    buildingId: string;
    entranceId: string;
    floorId: string;
  }>();
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [flatNumber, setFlatNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlats = async () => {
      if (!floorId) return;
      const { data } = await supabase
        .from('flats')
        .select('*')
        .eq('floor_id', floorId)
        .order('flat_number');
      setFlats(data || []);
      setLoading(false);
    };
    fetchFlats();
  }, [floorId]);

  const handleAddFlat = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const slug = flatNumber.toLowerCase().replace(/\s+/g, '-');
    await supabase
      .from('flats')
      .insert({
        floor_id: floorId,
        flat_number: flatNumber,
        slug,
        notes: notes || null,
      });
    setCreating(false);
    setShowForm(false);
    setFlatNumber('');
    setNotes('');
    // Refresh flats
    const { data } = await supabase
      .from('flats')
      .select('*')
      .eq('floor_id', floorId)
      .order('flat_number');
    setFlats(data || []);
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Flats on this Floor</h1>
        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => navigate(-1)} variant="outline" className="border-white/30 text-white hover:bg-white/10">
            Back
          </Button>
          <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="h-4 w-4" />
            <span>Add Flat</span>
          </Button>
        </div>
        {showForm && (
          <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Add New Flat</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFlat} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Flat Number *</label>
                  <input
                    type="text"
                    value={flatNumber}
                    onChange={e => setFlatNumber(e.target.value)}
                    required
                    className="w-full border border-white/30 rounded px-3 py-2 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Enter flat number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">Notes</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full border border-white/30 rounded px-3 py-2 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Optional notes"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={creating} className="bg-orange-500 hover:bg-orange-600 text-white">
                    {creating ? 'Creating...' : 'Create Flat'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-white/30 text-white hover:bg-white/10">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        {flats.length === 0 ? (
          <Card className="p-8 text-center bg-white/10 backdrop-blur-sm border-white/20">
            <Home className="h-12 w-12 text-white/60 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No flats yet</h3>
            <p className="text-white/80 mb-4">Add a flat to this floor to get started.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {flats.map(flat => (
              <Card key={flat.id} className="hover:shadow-xl transition-all bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Home className="h-5 w-5 text-orange-400" />
                    <span className="text-white">Flat {flat.flat_number}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link to={`/admin/buildings/${buildingId}/entrances/${entranceId}/floors/${floorId}/flats/${flat.id}`}>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full mt-2" size="sm">
                      Manage Flat
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 