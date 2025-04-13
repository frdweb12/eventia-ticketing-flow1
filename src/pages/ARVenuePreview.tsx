
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { iplMatches, IPLMatch } from '@/data/iplData';
import { events, Event } from '@/data/eventsData';
import { X, Camera, ArrowLeft, Maximize2, Eye, Image, MapPin, Layers, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ARVenuePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<Event | IPLMatch | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showARInstructions, setShowARInstructions] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'seat' | 'map'>('3d');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    // Find the event or match by ID
    const foundEvent = events.find(e => e.id === id);
    const foundMatch = iplMatches.find(m => m.id === id);
    
    const foundItem = foundEvent || foundMatch;
    
    if (foundItem) {
      setEvent(foundItem);
    }
    
    // Simulate loading of 3D assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleBackToEvent = () => {
    navigate(`/event/${id}`);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openARCamera = () => {
    // In a real app, this would trigger the AR experience
    setShowARInstructions(true);
  };

  const rotateView = (direction: 'left' | 'right') => {
    setRotationAngle(prev => {
      const change = direction === 'left' ? -45 : 45;
      return (prev + change) % 360;
    });
  };

  const changeZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev + 0.1 : prev - 0.1;
      return Math.max(0.5, Math.min(1.5, newZoom));
    });
  };

  return (
    <div className={`bg-gray-900 text-white min-h-screen flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Navigation */}
      <div className="p-4 flex justify-between items-center bg-black/70 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={handleBackToEvent} className="text-white">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium truncate">
          {event ? ('teams' in event ? `${event.teams.team1.name} vs ${event.teams.team2.name}` : event.title) : 'Venue Preview'}
        </h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white">
            <Maximize2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(false)} className={`text-white ${!isFullscreen && 'hidden'}`}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-300">Loading venue preview...</p>
          </div>
        ) : (
          <>
            {/* 3D Preview Area */}
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="h-full w-full flex items-center justify-center transition-transform duration-300 ease-out"
                style={{ 
                  transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`,
                }}
              >
                {viewMode === '3d' && (
                  <div className="relative w-full h-full">
                    {/* Placeholder for 3D stadium view - in a real app this would be a WebGL canvas */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-gray-900/50"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-80 h-80 border-4 border-gray-500/30 rounded-full flex items-center justify-center">
                        <div className="w-64 h-32 border-4 border-gray-400/40 bg-green-800/30 rounded-full flex items-center justify-center transform perspective-800 rotateX(60deg)">
                          <div className="w-48 h-24 border-2 border-white/20 bg-green-700/40 rounded-full flex items-center justify-center">
                            <div className="w-40 h-16 border border-white/20 bg-green-600/40 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-1/2 left-0 right-0 flex justify-around">
                        <div className="w-20 h-40 border-2 border-gray-400/30 rounded-lg bg-gray-800/30 transform perspective-800 rotateY(30deg)"></div>
                        <div className="w-20 h-40 border-2 border-gray-400/30 rounded-lg bg-gray-800/30 transform perspective-800 rotateY(-30deg)"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {viewMode === 'seat' && (
                  <div className="relative w-full h-full">
                    {/* Placeholder for seat view */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-gray-900/30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full max-w-md aspect-video bg-gradient-to-b from-green-800/70 to-green-900/70 rounded-lg overflow-hidden">
                        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                        <div className="absolute inset-x-0 bottom-10 flex justify-center space-x-1">
                          {Array.from({ length: 22 }).map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-blue-500 rounded-full opacity-70"></div>
                          ))}
                        </div>
                        <div className="absolute inset-x-0 bottom-16 flex justify-center space-x-1">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-red-500 rounded-full opacity-70"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {viewMode === 'map' && (
                  <div className="relative w-full h-full">
                    {/* Placeholder for map view */}
                    <div className="absolute inset-0 bg-gray-800/80"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full max-w-lg bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm">
                        <div className="h-64 bg-gray-600/50 rounded relative mb-3">
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <p>Venue Map</p>
                          </div>
                          <div className="absolute right-3 top-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center animate-pulse">
                            <div className="h-3 w-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-300 text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          {event?.venue}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button 
                    variant={viewMode === '3d' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('3d')}
                    className="text-white border-white/30"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    3D View
                  </Button>
                  <Button 
                    variant={viewMode === 'seat' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('seat')}
                    className="text-white border-white/30"
                  >
                    <Image className="h-4 w-4 mr-1" />
                    Seat View
                  </Button>
                  <Button 
                    variant={viewMode === 'map' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className="text-white border-white/30"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Map
                  </Button>
                </div>
                
                <Button variant="default" size="sm" onClick={openARCamera} className="bg-primary text-white">
                  <Camera className="h-4 w-4 mr-1" />
                  View in AR
                </Button>
              </div>
            </div>

            {/* Rotation and Zoom Controls */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
              <Button variant="outline" size="icon" onClick={() => rotateView('left')} className="text-white border-white/30">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => rotateView('right')} className="text-white border-white/30">
                <RotateCcw className="h-4 w-4 transform scale-x-[-1]" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => changeZoom('in')} className="text-white border-white/30">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => changeZoom('out')} className="text-white border-white/30">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Venue Info */}
            <div className="absolute left-4 top-20 max-w-xs bg-black/50 backdrop-blur-sm rounded-lg p-4">
              <h2 className="font-medium mb-1">{event?.venue}</h2>
              <p className="text-sm text-gray-300 mb-2">
                {event && 'teams' in event 
                  ? `IPL Match: ${event.teams.team1.shortName} vs ${event.teams.team2.shortName}`
                  : event?.title
                }
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {'ticketTypes' in event && event.ticketTypes.map((type, index) => (
                  <div key={index} className="text-xs bg-gray-700/70 px-2 py-1 rounded">
                    {type.category}: ₹{type.price}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* AR Instructions Dialog */}
      <Dialog open={showARInstructions} onOpenChange={setShowARInstructions}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>View in Augmented Reality</DialogTitle>
            <DialogDescription>
              Experience the venue in AR directly from your device.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Layers className="h-4 w-4 mr-2 text-primary" />
                How to use AR view
              </h3>
              <ol className="text-sm space-y-2 list-decimal pl-5">
                <li>Point your camera at a flat surface</li>
                <li>Move your phone slowly to detect the surface</li>
                <li>Tap to place the 3D venue model</li>
                <li>Pinch to zoom, drag to rotate the model</li>
              </ol>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowARInstructions(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowARInstructions(false);
                toast({
                  title: "AR Mode Unavailable",
                  description: "This is a demo. AR mode would launch the camera in a real application.",
                });
              }}>
                <Camera className="h-4 w-4 mr-2" />
                Launch AR Mode
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ARVenuePreview;
