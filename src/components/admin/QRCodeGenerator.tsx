import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { QrCode, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import * as QRCodeLib from 'qrcode';

interface QRCodeGeneratorProps {
  roomUrl: string;
  roomName: string;
  buildingName: string;
  flatNumber: string;
  onGenerated?: (dataUrl: string) => void;
}

export function QRCodeGenerator({ roomUrl, roomName, buildingName, flatNumber, onGenerated }: QRCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
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
      if (onGenerated) onGenerated(dataUrl);
      toast.success('QR code generated successfully!');
    } catch (error) {
      toast.error('Error generating QR code');
      console.error('QR Code generation error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

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

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="h-5 w-5 text-blue-600" />
          <span>QR Code for Room</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-slate-600">
          <p><strong>Building:</strong> {buildingName}</p>
          <p><strong>Flat:</strong> {flatNumber}</p>
          <p><strong>Room:</strong> {roomName}</p>
          <p><strong>URL:</strong> <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">{roomUrl}</code></p>
        </div>

        {!qrCodeDataUrl ? (
          <Button
            onClick={generateQRCode}
            disabled={generating}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {generating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <QrCode className="h-4 w-4 mr-2" />
            )}
            Generate QR Code
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={downloadQRCode}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              <Button
                onClick={openRoomPage}
                variant="outline"
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Page
              </Button>
            </div>
            
            <Button
              onClick={() => setQrCodeDataUrl('')}
              variant="outline"
              className="w-full"
            >
              Generate New QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}