import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import RoomPageClient from '../components/RoomPageClient';
import Layout from '../components/Layout';
function normalizeRoomData(data) {
    if (!data)
        return null;
    // Supabase returns nested joins as arrays, so we need to unwrap them
    const flat = Array.isArray(data.flat) ? data.flat[0] : data.flat;
    if (!flat)
        return null;
    const floor = Array.isArray(flat.floor) ? flat.floor[0] : flat.floor;
    if (!floor)
        return null;
    const entrance = Array.isArray(floor.entrance) ? floor.entrance[0] : floor.entrance;
    if (!entrance)
        return null;
    const building = Array.isArray(entrance.building) ? entrance.building[0] : entrance.building;
    if (!building)
        return null;
    return {
        id: data.id,
        slug: data.slug,
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
export default function RoomPage() {
    const { buildingSlug, flatSlug, roomSlug } = useParams();
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchRoom = async () => {
            if (!buildingSlug || !flatSlug || !roomSlug)
                return;
            // Fetch the room with all nested info
            const { data, error } = await supabase
                .from('rooms')
                .select(`
          id,
          slug,
          room_name,
          square_meters,
          image_url_1,
          image_url_2,
          image_url_3,
          flat:flats!inner(
            flat_number,
            slug,
            floor:floors!inner(
              floor_number,
              entrance:entrances!inner(
                label,
                building:buildings!inner(
                  name,
                  address,
                  city,
                  slug
                )
              )
            )
          )
        `)
                .eq('slug', roomSlug)
                .eq('flat.slug', flatSlug)
                .eq('flat.floor.entrance.building.slug', buildingSlug)
                .maybeSingle();
            if (!error && data) {
                setRoomData(normalizeRoomData(data));
            }
            else {
                setRoomData(null);
            }
            setLoading(false);
        };
        fetchRoom();
    }, [buildingSlug, flatSlug, roomSlug]);
    return (_jsx(Layout, { children: _jsx(RoomPageClient, { roomData: roomData, loading: loading }) }));
}
