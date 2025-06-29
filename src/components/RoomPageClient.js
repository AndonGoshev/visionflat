"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Building2, Home, Square, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import * as QRCodeLib from 'qrcode';
export default function RoomPageClient({ roomData, loading, initialImageIndex = 0 }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    useEffect(() => {
        async function generateQR() {
            if (!roomData)
                return;
            const url = `/room/${roomData.slug}`;
            const fullUrl = `${window.location.origin}${url}`;
            const dataUrl = await QRCodeLib.toDataURL(fullUrl, {
                width: 512,
                margin: 2,
                color: {
                    dark: '#1e293b',
                    light: '#ffffff',
                },
            });
            setQrCodeDataUrl(dataUrl);
        }
        generateQR();
    }, [roomData]);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400" }) }));
    }
    if (!roomData) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4", children: _jsxs(Card, { className: "max-w-md w-full p-8 text-center bg-white/10 backdrop-blur-sm border-white/20", children: [_jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "Room Not Found" }), _jsx("p", { className: "text-white/80 mb-6", children: "The room you're looking for doesn't exist or may have been moved." }), _jsx(Link, { to: "/", children: _jsxs(Button, { className: "bg-orange-500 hover:bg-orange-600 text-white", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Go Home"] }) })] }) }));
    }
    const images = [
        roomData.image_url_1,
        roomData.image_url_2,
        roomData.image_url_3,
    ].filter(Boolean);
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };
    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900", children: [_jsx("div", { className: "bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 py-4", children: [_jsxs("div", { className: "flex items-center space-x-2 text-sm text-white/70 mb-2", children: [_jsx(Building2, { className: "h-4 w-4 text-orange-400" }), _jsx("span", { children: roomData.flat.floor.entrance.building.name }), _jsx("span", { children: "\u2022" }), _jsx(Home, { className: "h-4 w-4 text-orange-400" }), _jsxs("span", { children: ["Flat ", roomData.flat.flat_number] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["Floor ", roomData.flat.floor.floor_number] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["Entrance ", roomData.flat.floor.entrance.label] })] }), _jsx("h1", { className: "text-2xl md:text-3xl font-bold text-white capitalize", children: roomData.room_name.replace('-', ' ') })] }) }), _jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "flex items-center space-x-4 mb-4", children: _jsxs(Badge, { variant: "secondary", className: "flex items-center space-x-1 bg-white/20 text-white border-white/30", children: [_jsx(Square, { className: "h-3 w-3 text-orange-400" }), _jsxs("span", { children: [roomData.square_meters, " m\u00B2"] })] }) }), _jsxs("p", { className: "text-white/80", children: ["Located at ", roomData.flat.floor.entrance.building.address, ", ", roomData.flat.floor.entrance.building.city] })] }), images.length > 0 ? (_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-xl font-semibold text-white mb-4", children: "Design Visualizations" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "aspect-video relative overflow-hidden rounded-xl bg-black/30 border border-white/20", children: [_jsx("img", { src: images[currentImageIndex], alt: `${roomData.room_name} visualization ${currentImageIndex + 1}`, className: "object-cover w-full h-full absolute inset-0", style: { objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 } }), images.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: prevImage, className: "absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-full shadow-lg transition-all border border-white/20", children: _jsx(ChevronLeft, { className: "h-5 w-5 text-white" }) }), _jsx("button", { onClick: nextImage, className: "absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-full shadow-lg transition-all border border-white/20", children: _jsx(ChevronRight, { className: "h-5 w-5 text-white" }) })] })), images.length > 1 && (_jsxs("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm border border-white/20", children: [currentImageIndex + 1, " of ", images.length] }))] }), images.length > 1 && (_jsx("div", { className: "flex space-x-2 mt-4 justify-center", children: images.map((image, index) => (_jsx("button", { onClick: () => setCurrentImageIndex(index), className: `w-16 h-16 relative overflow-hidden rounded-lg border-2 transition-all ${index === currentImageIndex
                                                ? 'border-orange-400 ring-2 ring-orange-400/30'
                                                : 'border-white/30 hover:border-white/50'}`, children: _jsx("img", { src: image, alt: `Thumbnail ${index + 1}`, className: "object-cover w-full h-full absolute inset-0", style: { objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 } }) }, index))) }))] })] })) : (_jsxs(Card, { className: "mb-8 p-8 text-center bg-white/10 backdrop-blur-sm border-white/20", children: [_jsx("div", { className: "text-white/60 mb-4", children: _jsx(Building2, { className: "h-12 w-12 mx-auto" }) }), _jsx("h3", { className: "text-lg font-medium text-white mb-2", children: "Visualizations Coming Soon" }), _jsx("p", { className: "text-white/80", children: "AI-generated design options for this room are being prepared." })] })), _jsxs(Card, { className: "p-6 bg-white/10 backdrop-blur-sm border-white/20", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: "Love this style?" }), _jsx("p", { className: "text-white/80 mb-4", children: "Get in touch with our sales team to learn more about customization options and availability for this unit." }), _jsx(Button, { className: "bg-orange-500 hover:bg-orange-600 text-white", children: "Contact Sales" })] })] }), _jsx("div", { className: "max-w-4xl mx-auto px-4 pb-8", children: _jsxs(Card, { className: "mt-8 bg-white/10 backdrop-blur-sm border-white/20", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "flex items-center space-x-2 text-white", children: _jsx("span", { children: "QR Code for Public Room Page" }) }) }), _jsx(CardContent, { children: qrCodeDataUrl && (_jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsx("div", { className: "bg-white p-4 rounded-lg shadow-sm border", children: _jsx("img", { src: qrCodeDataUrl, alt: "QR Code", className: "w-48 h-48" }) }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { onClick: () => {
                                                    const link = document.createElement('a');
                                                    link.download = `qr-${roomData.flat.floor.entrance.building.name}-${roomData.flat.flat_number}-${roomData.room_name}.png`;
                                                    link.href = qrCodeDataUrl;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }, className: "bg-green-600 hover:bg-green-700", children: "Download PNG" }), _jsx(Button, { onClick: async () => {
                                                    const url = `/room/${roomData.slug}`;
                                                    const fullUrl = `${window.location.origin}${url}`;
                                                    const dataUrl = await QRCodeLib.toDataURL(fullUrl, {
                                                        width: 512,
                                                        margin: 2,
                                                        color: {
                                                            dark: '#1e293b',
                                                            light: '#ffffff',
                                                        },
                                                    });
                                                    setQrCodeDataUrl(dataUrl);
                                                }, variant: "outline", children: "Regenerate QR Code" })] }), _jsx("p", { className: "text-white mt-2 text-center break-all", children: `${window.location.origin}/room/${roomData.slug}` })] })) })] }) })] }));
}
