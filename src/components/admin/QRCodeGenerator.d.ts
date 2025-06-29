interface QRCodeGeneratorProps {
    roomUrl: string;
    roomName: string;
    buildingName: string;
    flatNumber: string;
    onGenerated?: (dataUrl: string) => void;
}
export declare function QRCodeGenerator({ roomUrl, roomName, buildingName, flatNumber, onGenerated }: QRCodeGeneratorProps): import("react/jsx-runtime").JSX.Element;
export {};
