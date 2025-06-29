import { Building } from 'lucide-react';
import type { Database } from '../../lib/supabase';
type Building = Database['public']['Tables']['buildings']['Row'];
type Entrance = Database['public']['Tables']['entrances']['Row'];
interface BuildingDetailClientProps {
    building: Building | null;
    entrances: Entrance[];
}
export default function BuildingDetailClient({ building, entrances: initialEntrances }: BuildingDetailClientProps): import("react/jsx-runtime").JSX.Element;
export {};
