interface RoomData {
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
    slug: string;
}
interface RoomPageClientProps {
    roomData: RoomData | null;
    loading: boolean;
    initialImageIndex?: number;
}
export default function RoomPageClient({ roomData, loading, initialImageIndex }: RoomPageClientProps): import("react/jsx-runtime").JSX.Element;
export {};
