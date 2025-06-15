import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Grid3X3,
  Camera,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

interface PropertyGalleryProps {
  media: MediaItem[];
  propertyTitle: string;
}

export default function PropertyGallery({ media, propertyTitle }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const currentMedia = media[selectedIndex];
  const images = media.filter(item => item.type === 'image');
  const videos = media.filter(item => item.type === 'video');

  const nextMedia = () => {
    setSelectedIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
    setSelectedIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const selectMedia = (index: number) => {
    setSelectedIndex(index);
    setShowGrid(false);
  };

  if (!media || media.length === 0) {
    return (
      <div className="w-full h-96 bg-neutral-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
          <p className="text-neutral-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Gallery Display */}
      <div className="relative">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative cursor-pointer group">
              {currentMedia.type === 'image' ? (
                <img
                  src={currentMedia.url}
                  alt={currentMedia.title || `${propertyTitle} - Image ${selectedIndex + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="relative">
                  <video
                    src={currentMedia.url}
                    poster={currentMedia.thumbnail}
                    className="w-full h-96 object-cover rounded-lg"
                    muted={isMuted}
                    autoPlay={isPlaying}
                    loop
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="bg-black/50 text-white hover:bg-black/70"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaying(!isPlaying);
                      }}
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant="secondary" className="bg-black/50 text-white">
                  {selectedIndex + 1} / {media.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 text-white hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGrid(!showGrid);
                  }}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>

              {/* Navigation Arrows */}
              {media.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevMedia();
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextMedia();
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </DialogTrigger>

          {/* Full Screen Gallery Modal */}
          <DialogContent className="max-w-screen-xl w-full h-full p-0 bg-black">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                onClick={() => setIsFullscreen(false)}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Media Display */}
              {currentMedia.type === 'image' ? (
                <img
                  src={currentMedia.url}
                  alt={currentMedia.title || `${propertyTitle} - Image ${selectedIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <video
                  src={currentMedia.url}
                  poster={currentMedia.thumbnail}
                  className="max-w-full max-h-full object-contain"
                  controls
                  autoPlay
                />
              )}

              {/* Navigation */}
              {media.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={prevMedia}
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={nextMedia}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </Button>
                </>
              )}

              {/* Bottom Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between items-center text-white">
                  <div>
                    <p className="text-lg font-semibold">{currentMedia.title || `${propertyTitle}`}</p>
                    {currentMedia.description && (
                      <p className="text-sm text-white/80">{currentMedia.description}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {selectedIndex + 1} / {media.length}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Thumbnail Grid */}
      {(showGrid || media.length > 1) && (
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={() => selectMedia(index)}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden border-2 transition-all",
                selectedIndex === index 
                  ? "border-primary shadow-lg" 
                  : "border-transparent hover:border-neutral-300"
              )}
            >
              {item.type === 'image' ? (
                <img
                  src={item.thumbnail || item.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={item.thumbnail || item.url}
                    alt={`Video thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Media Stats */}
      <div className="flex justify-between items-center text-sm text-neutral-600">
        <div className="flex gap-4">
          {images.length > 0 && (
            <div className="flex items-center gap-1">
              <Camera className="w-4 h-4" />
              <span>{images.length} {images.length === 1 ? 'Photo' : 'Photos'}</span>
            </div>
          )}
          {videos.length > 0 && (
            <div className="flex items-center gap-1">
              <Video className="w-4 h-4" />
              <span>{videos.length} {videos.length === 1 ? 'Video' : 'Videos'}</span>
            </div>
          )}
        </div>
        
        {media.length > 6 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
          >
            {showGrid ? 'Hide' : 'Show All'} ({media.length})
          </Button>
        )}
      </div>
    </div>
  );
}