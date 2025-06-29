'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface BuildingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function BuildingForm({ onSuccess, onCancel }: BuildingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    address: '',
    city: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('buildings')
        .insert([{
          ...formData,
          user_id: user.id,
        }]);

      if (error) throw error;

      toast.success('Building created successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error('Error creating building: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Add New Building</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Building Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Sunny Towers"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-white">URL Slug *</Label>
              <Input
                id="slug"
                type="text"
                placeholder="e.g., sunny-towers"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400"
              />
              <p className="text-xs text-white/60">
                Used in URLs: /{formData.slug}/flat-number/room
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-white">Address *</Label>
              <Input
                id="address"
                type="text"
                placeholder="e.g., 123 Main Street"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-white">City *</Label>
              <Input
                id="city"
                type="text"
                placeholder="e.g., New York"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional information about the building..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-orange-400"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white">
              {loading ? 'Creating...' : 'Create Building'}
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