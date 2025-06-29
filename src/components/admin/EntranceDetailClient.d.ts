import { Building } from 'lucide-react';
import type { Database } from '../../lib/supabase';
type Building = Database['public']['Tables']['buildings']['Row'];
type Entrance = Database['public']['Tables']['entrances']['Row'];
type Floor = Database['public']['Tables']['floors']['Row'];
interface EntranceDetailClientProps {
    building: Building;
    entrance: Entrance;
    floors: Floor[];
}
export default function EntranceDetailClient({ building, entrance, floors: initialFloors }: EntranceDetailClientProps): import("react/jsx-runtime").JSX.Element;
export {};
