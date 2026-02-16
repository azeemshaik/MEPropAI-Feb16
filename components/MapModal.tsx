import React from 'react';
import { X, MapPin } from 'lucide-react';
import SimpleMap from './SimpleMap';
import { LandMatch } from '../services/gemini';

interface MapModalProps {
  match: LandMatch;
  allMatches: LandMatch[];
  selectedIndices: number[];
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ match, allMatches, selectedIndices, onClose }) => {
  // Calculate center and markers
  const centerCoords = match.coordinates || { lat: 24.7136, lng: 46.6753 };
  
  // Create markers map
  const uniqueMarkersMap = new Map();
  
  // Add selected items
  selectedIndices.forEach(i => {
      const m = allMatches[i];
      if (m && m.coordinates) {
          uniqueMarkersMap.set(i, {
              lat: m.coordinates.lat,
              lng: m.coordinates.lng,
              label: m.name,
              isCurrent: m === match // Check reference equality
          });
      }
  });

  // Ensure current match is present
  const matchIndex = allMatches.indexOf(match);
  if (match.coordinates) {
     uniqueMarkersMap.set(matchIndex, {
        lat: match.coordinates.lat,
        lng: match.coordinates.lng,
        label: `Capital Match: ${match.name}`,
        isCurrent: true
     });
  }
  
  const finalMarkers = Array.from(uniqueMarkersMap.values());

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-[85vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50 z-10">
            <div className="flex items-center gap-3">
                <div className="bg-primary-500/20 p-2 rounded-lg text-primary-400">
                    <MapPin className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white leading-none">{match.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{match.location}</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group bg-black/20 border border-white/5">
                <X className="h-5 w-5 text-slate-400 group-hover:text-white" />
            </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-slate-950">
            <SimpleMap center={centerCoords} markers={finalMarkers} />
            
            {/* Overlay Info */}
            <div className="absolute bottom-6 left-6 z-[400] max-w-sm hidden md:block">
                <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
                    <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">Site Analysis</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-3">
                        {match.reasoning}
                    </p>
                    <div className="flex gap-2">
                         <span className="text-xs bg-white/5 border border-white/5 px-2 py-1 rounded text-slate-400">{match.type}</span>
                         <span className="text-xs bg-white/5 border border-white/5 px-2 py-1 rounded text-slate-400">{match.size}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MapModal;