"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Building2, Home, Square, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import * as QRCodeLib from 'qrcode';

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

export default function RoomPageClient({ roomData, loading, initialImageIndex = 0 }: RoomPageClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    async function generateQR() {
      if (!roomData) return;
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white/10 backdrop-blur-sm border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Room Not Found</h2>
          <p className="text-white/80 mb-6">
            The room you're looking for doesn't exist or may have been moved.
          </p>
          <Link to="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const images = [
    roomData.image_url_1,
    roomData.image_url_2,
    roomData.image_url_3,
  ].filter(Boolean) as string[];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-white/70 mb-2">
            <Building2 className="h-4 w-4 text-orange-400" />
            <span>{roomData.flat.floor.entrance.building.name}</span>
            <span>•</span>
            <Home className="h-4 w-4 text-orange-400" />
            <span>Flat {roomData.flat.flat_number}</span>
            <span>•</span>
            <span>Floor {roomData.flat.floor.floor_number}</span>
            <span>•</span>
            <span>Entrance {roomData.flat.floor.entrance.label}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white capitalize">
            {roomData.room_name.replace('-', ' ')}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Room Info */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="secondary" className="flex items-center space-x-1 bg-white/20 text-white border-white/30">
              <Square className="h-3 w-3 text-orange-400" />
              <span>{roomData.square_meters} m²</span>
            </Badge>
          </div>
          <p className="text-white/80">
            Located at {roomData.flat.floor.entrance.building.address}, {roomData.flat.floor.entrance.building.city}
          </p>
        </div>

        {/* Image Carousel */}
        {images.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Design Visualizations
            </h2>
            <div className="relative">
              <div className="aspect-video relative overflow-hidden rounded-xl bg-black/30 border border-white/20">
                <img
                  src={images[currentImageIndex]}
                  alt={`${roomData.room_name} visualization ${currentImageIndex + 1}`}
                  className="object-cover w-full h-full absolute inset-0"
                  style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                />
                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-full shadow-lg transition-all border border-white/20"
                    >
                      <ChevronLeft className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 p-2 rounded-full shadow-lg transition-all border border-white/20"
                    >
                      <ChevronRight className="h-5 w-5 text-white" />
                    </button>
                  </>
                )}
                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm border border-white/20">
                    {currentImageIndex + 1} of {images.length}
                  </div>
                )}
              </div>
              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="flex space-x-2 mt-4 justify-center">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 relative overflow-hidden rounded-lg border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-orange-400 ring-2 ring-orange-400/30'
                          : 'border-white/30 hover:border-white/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="object-cover w-full h-full absolute inset-0"
                        style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <Card className="mb-8 p-8 text-center bg-white/10 backdrop-blur-sm border-white/20">
            <div className="text-white/60 mb-4">
              <Building2 className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Visualizations Coming Soon
            </h3>
            <p className="text-white/80">
              AI-generated design options for this room are being prepared.
            </p>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">
            Love this style?
          </h3>
          <p className="text-white/80 mb-4">
            Get in touch with our sales team to learn more about customization options 
            and availability for this unit.
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Contact Sales</Button>
        </Card>
      </div>

      {/* QR Code Section at the bottom */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <Card className="mt-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <span>QR Code for Public Room Page</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {qrCodeDataUrl && (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = `qr-${roomData.flat.floor.entrance.building.name}-${roomData.flat.flat_number}-${roomData.room_name}.png`;
                      link.href = qrCodeDataUrl;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Download PNG
                  </Button>
                  <Button
                    onClick={async () => {
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
                    }}
                    variant="outline"
                  >
                    Regenerate QR Code
                  </Button>
                </div>
                <p className="text-white mt-2 text-center break-all">{`${window.location.origin}/room/${roomData.slug}`}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}