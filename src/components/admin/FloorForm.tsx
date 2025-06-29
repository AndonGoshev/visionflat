'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface FloorFormProps {
  entranceId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function FloorForm({ entranceId, onSuccess, onCancel }: FloorFormProps) {
  const [floorNumber, setFloorNumber] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('floors')
        .insert([{
          entrance_id: entranceId,
          floor_number: floorNumber,
        }]);

      if (error) throw error;

      toast.success('Floor created successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error('Error creating floor: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Add New Floor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="floorNumber" className="text-white">Floor Number *</Label>
            <Input
              id="floorNumber"
              type="number"
              placeholder="e.g., 1, 2, 3"
              value={floorNumber}
              onChange={(e) => setFloorNumber(parseInt(e.target.value) || 1)}
              min="0"
              max="100"
              required
              className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400"
            />
            <p className="text-xs text-white/60">
              Use 0 for ground floor, negative numbers for basement levels
            </p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? 'Creating...' : 'Create Floor'}
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