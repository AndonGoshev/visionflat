import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import Layout from '../components/Layout';

interface Room {
  id: string;
  room_name: string;
  square_meters: number;
  image_url_1: string | null;
  image_url_2: string | null;
  image_url_3: string | null;
  flat: {
    flat_number: string;
    floor: {
      floor_number: number;
      entrance: {
        label: string;
        building: {
          name: string;
          address: string;
          city: string;
        };
      };
    };
  };
}

function normalizeRoomData(data: any): Room | null {
  if (!data) return null;
  const flat = Array.isArray(data.flat) ? data.flat[0] : data.flat;
  if (!flat) return null;
  const floor = Array.isArray(flat.floor) ? flat.floor[0] : flat.floor;
  if (!floor) return null;
  const entrance = Array.isArray(floor.entrance) ? floor.entrance[0] : floor.entrance;
  if (!entrance) return null;
  const building = Array.isArray(entrance.building) ? entrance.building[0] : entrance.building;
  if (!building) return null;
  return {
    id: data.id,
    room_name: data.room_name,
    square_meters: data.square_meters,
    image_url_1: data.image_url_1,
    image_url_2: data.image_url_2,
    image_url_3: data.image_url_3,
    flat: {
      flat_number: flat.flat_number,
      floor: {
        floor_number: floor.floor_number,
        entrance: {
          label: entrance.label,
          building: {
            name: building.name,
            address: building.address,
            city: building.city,
          },
        },
      },
    },
  };
}

export default function RoomDisplayPage() {
  const { roomSlug } = useParams<{ roomSlug: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomSlug) return;
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          id,
          room_name,
          square_meters,
          image_url_1,
          image_url_2,
          image_url_3,
          flat:flats!inner(
            flat_number,
            floor:floors!inner(
              floor_number,
              entrance:entrances!inner(
                label,
                building:buildings!inner(
                  name,
                  address,
                  city
                )
              )
            )
          )
        `)
        .eq('slug', roomSlug)
        .single();
      if (!error && data) {
        setRoom(normalizeRoomData(data));
      } else {
        setRoom(null);
      }
      setLoading(false);
    };
    fetchRoom();
  }, [roomSlug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
        </div>
      </Layout>
    );
  }

  if (!room) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md w-full p-8 text-center bg-white/10 backdrop-blur-sm border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Room Not Found</h2>
            <p className="text-white/80 mb-6">
              The room you're looking for doesn't exist or may have been moved.
            </p>
          </Card>
        </div>
      </Layout>
    );
  }

  const images = [room.image_url_1, room.image_url_2, room.image_url_3].filter(Boolean) as string[];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="mb-8 p-8 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white mb-4">{room.room_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-white/80">
                <div>Flat: {room.flat.flat_number}</div>
                <div>Floor: {room.flat.floor.floor_number}</div>
                <div>Entrance: {room.flat.floor.entrance.label}</div>
                <div>Building: {room.flat.floor.entrance.building.name}</div>
                <div>Address: {room.flat.floor.entrance.building.address}, {room.flat.floor.entrance.building.city}</div>
                <div>Area: {room.square_meters} m²</div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">AI-Generated Interior Designs</h3>
                {images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Room design ${idx + 1}`} className="rounded-xl w-full h-48 object-cover bg-white/10 border border-white/20" />
                    ))}
                  </div>
                ) : (
                  <div className="text-white/60 text-center py-8 bg-white/10 rounded-xl border border-white/20">
                    <span>No AI-generated images yet. Check back soon!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 