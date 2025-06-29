// import * as React from 'react';
import { QrCode, Sparkles, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function DashboardPage() {
  return (
    <Layout>
      <div className="p-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Visualize Your
            <span className="text-orange-400 block">Dream Space</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Transform unfinished apartment interiors with AI-powered visualizations. 
            Scan QR codes in physical rooms to explore endless design possibilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/admin">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Get Started
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/15 transition-all">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
              <QrCode className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">QR Code Integration</h3>
            <p className="text-white/80">
              Place QR codes in physical rooms for instant access to design visualizations. 
              Buyers can scan and explore on their mobile devices.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/15 transition-all">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Visualizations</h3>
            <p className="text-white/80">
              Upload AI-generated room designs to showcase different styles and possibilities. 
              Help buyers envision their future home.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/15 transition-all">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Easy Management</h3>
            <p className="text-white/80">
              Comprehensive admin dashboard to manage buildings, flats, and rooms. 
              Upload images and generate QR codes with ease.
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-20 bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Try a Demo</h2>
            <p className="text-white/80">
              Experience how visitors interact with your properties through QR codes
            </p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto border border-white/10">
            <div className="text-center">
              <div className="w-32 h-32 bg-white/10 rounded-lg shadow-lg mx-auto mb-4 flex items-center justify-center border border-white/20">
                <QrCode className="h-16 w-16 text-white/60" />
              </div>
              <p className="text-sm text-white/80 mb-4">
                Sample QR Code for Demo Room
              </p>
              <Link to="/demo-building/flat-1/living-room">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  Visit Demo Room
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 