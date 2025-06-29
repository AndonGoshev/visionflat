'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface EntranceFormProps {
  buildingId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EntranceForm({ buildingId, onSuccess, onCancel }: EntranceFormProps) {
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('entrances')
        .insert([{
          building_id: buildingId,
          label: label.trim(),
        }]);

      if (error) throw error;

      toast.success('Entrance created successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error('Error creating entrance: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Add New Entrance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label" className="text-white">Entrance Label *</Label>
            <Input
              id="label"
              type="text"
              placeholder="e.g., A, B, C, Main, East"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400"
            />
            <p className="text-xs text-white/60">
              Common labels: A, B, C or Main, North, South, East, West
            </p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white">
              {loading ? 'Creating...' : 'Create Entrance'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="border-white/30 text-white hover:bg-white/10">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}