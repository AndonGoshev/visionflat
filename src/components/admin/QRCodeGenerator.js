import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { QrCode, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import * as QRCodeLib from 'qrcode';
export function QRCodeGenerator({ roomUrl, roomName, buildingName, flatNumber, onGenerated }) {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [generating, setGenerating] = useState(false);
    const generateQRCode = async () => {
        setGenerating(true);
        try {
            const fullUrl = `${window.location.origin}${roomUrl}`;
            const dataUrl = await QRCodeLib.toDataURL(fullUrl, {
                width: 512,
                margin: 2,
                color: {
                    dark: '#1e293b', // slate-800
                    light: '#ffffff',
                },
            });
            setQrCodeDataUrl(dataUrl);
            if (onGenerated)
                onGenerated(dataUrl);
            toast.success('QR code generated successfully!');
        }
        catch (error) {
            toast.error('Error generating QR code');
            console.error('QR Code generation error:', error);
        }
        finally {
            setGenerating(false);
        }
    };
    const downloadQRCode = () => {
        if (!qrCodeDataUrl)
            return;
        const link = document.createElement('a');
        link.download = `qr-${buildingName}-${flatNumber}-${roomName}.png`;
        link.href = qrCodeDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('QR code downloaded!');
    };
    const openRoomPage = () => {
        const fullUrl = `${window.location.origin}${roomUrl}`;
        window.open(fullUrl, '_blank');
    };
    return (_jsxs(Card, { className: "bg-white/80 backdrop-blur-sm border-slate-200", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(QrCode, { className: "h-5 w-5 text-blue-600" }), _jsx("span", { children: "QR Code for Room" })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "text-sm text-slate-600", children: [_jsxs("p", { children: [_jsx("strong", { children: "Building:" }), " ", buildingName] }), _jsxs("p", { children: [_jsx("strong", { children: "Flat:" }), " ", flatNumber] }), _jsxs("p", { children: [_jsx("strong", { children: "Room:" }), " ", roomName] }), _jsxs("p", { children: [_jsx("strong", { children: "URL:" }), " ", _jsx("code", { className: "text-xs bg-slate-100 px-1 py-0.5 rounded", children: roomUrl })] })] }), !qrCodeDataUrl ? (_jsxs(Button, { onClick: generateQRCode, disabled: generating, className: "w-full bg-blue-600 hover:bg-blue-700", children: [generating ? (_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" })) : (_jsx(QrCode, { className: "h-4 w-4 mr-2" })), "Generate QR Code"] })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex justify-center", children: _jsx("div", { className: "bg-white p-4 rounded-lg shadow-sm border", children: _jsx("img", { src: qrCodeDataUrl, alt: "QR Code", className: "w-48 h-48" }) }) }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { onClick: downloadQRCode, className: "flex-1 bg-green-600 hover:bg-green-700", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Download PNG"] }), _jsxs(Button, { onClick: openRoomPage, variant: "outline", className: "flex-1", children: [_jsx(ExternalLink, { className: "h-4 w-4 mr-2" }), "Preview Page"] })] }), _jsx(Button, { onClick: () => setQrCodeDataUrl(''), variant: "outline", className: "w-full", children: "Generate New QR Code" })] }))] })] }));
}
