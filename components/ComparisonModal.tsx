import React, { useRef } from 'react';
import { X, TrendingUp, MapPin, Ruler, DollarSign } from 'lucide-react';
import { LandMatch } from '../services/gemini';
import SimpleMap, { MapMarker } from './SimpleMap';

interface ComparisonModalProps {
  selectedMatches: LandMatch[];
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ selectedMatches, onClose }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (selectedMatches.length === 0) return null;

  const maxIRR = Math.max(...selectedMatches.map(m => m.projectedIRR));

  const avgLat = selectedMatches.reduce((acc, curr) => acc + curr.coordinates.lat, 0) / selectedMatches.length;
  const avgLng = selectedMatches.reduce((acc, curr) => acc + curr.coordinates.lng, 0) / selectedMatches.length;

  const markers: MapMarker[] = selectedMatches.map((m, idx) => ({
    id: idx,
    lat: m.coordinates.lat,
    lng: m.coordinates.lng,
    label: m.name,
    isCurrent: false // Remove highlight in comparison mode
  }));

  const handleMarkerClick = (marker: MapMarker) => {
    if (scrollContainerRef.current) {
      const column = scrollContainerRef.current.querySelector(`[data-property-index="${marker.id}"]`);
      if (column) {
        column.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
            <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Comparison Analysis 
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono border border-indigo-500/20">
                    {selectedMatches.length} PROPERTIES
                  </span>
                </h3>
                <p className="text-sm text-slate-400">Side-by-side evaluation of investment fundamentals.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                <X className="h-6 w-6 text-slate-400 group-hover:text-white" />
            </button>
        </div>

        <div className="overflow-auto p-6 bg-slate-900/50 custom-scrollbar" ref={scrollContainerRef}>
           
           <div className="w-full h-72 mb-8 rounded-xl overflow-hidden border border-white/10 relative shadow-xl">
              <SimpleMap 
                center={{ lat: avgLat, lng: avgLng }} 
                markers={markers} 
                fitBounds={true}
                onMarkerClick={handleMarkerClick}
              />
              <div className="absolute top-4 right-4 z-[400] bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded text-xs font-mono text-slate-300 border border-white/10 shadow-lg">
                Geographic Spread • Click Marker to Navigate
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-[150px_repeat(auto-fit,minmax(250px,1fr))] gap-4 min-w-[300px] md:min-w-0">
              
              <div className="space-y-6 pt-24 hidden md:block">
                  <div className="h-12 flex items-center text-slate-500 font-semibold text-sm uppercase tracking-wider"><MapPin className="w-4 h-4 mr-2" /> Location</div>
                  <div className="h-12 flex items-center text-slate-500 font-semibold text-sm uppercase tracking-wider"><DollarSign className="w-4 h-4 mr-2" /> Price</div>
                  <div className="h-12 flex items-center text-slate-500 font-semibold text-sm uppercase tracking-wider"><Ruler className="w-4 h-4 mr-2" /> Size</div>
                  <div className="h-16 flex items-center text-slate-500 font-semibold text-sm uppercase tracking-wider"><TrendingUp className="w-4 h-4 mr-2" /> Proj. IRR</div>
                  <div className="h-12 flex items-center text-slate-500 font-semibold text-sm uppercase tracking-wider">Zoning</div>
                  <div className="h-32 flex items-start pt-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">Infrastructure</div>
              </div>

              {selectedMatches.map((match, idx) => {
                  const isBestIRR = match.projectedIRR === maxIRR;
                  const irrPercent = (match.projectedIRR / (maxIRR * 1.1)) * 100;

                  return (
                      <div 
                        key={idx} 
                        data-property-index={idx}
                        className="bg-white/5 rounded-xl p-5 border border-white/5 flex flex-col gap-6 relative group hover:bg-white/10 transition-colors"
                      >
                          <div className="h-16 mb-2 border-b border-white/5 pb-2">
                             <h4 className="text-lg font-bold text-white leading-tight">{match.name}</h4>
                             <p className="text-xs text-slate-400 mt-1 truncate">{match.location}</p>
                          </div>

                          <div className="h-12 flex items-center text-slate-200 text-sm border-b border-white/5 md:border-none">
                              <span className="md:hidden w-28 text-slate-500 text-xs uppercase font-bold">Location:</span>
                              {match.location}
                          </div>
                           <div className="h-12 flex items-center text-slate-200 text-sm border-b border-white/5 md:border-none">
                              <span className="md:hidden w-28 text-slate-500 text-xs uppercase font-bold">Price:</span>
                              {match.price}
                          </div>
                           <div className="h-12 flex items-center text-slate-200 text-sm border-b border-white/5 md:border-none">
                              <span className="md:hidden w-28 text-slate-500 text-xs uppercase font-bold">Size:</span>
                              {match.size}
                          </div>
                          
                          <div className="h-16 flex flex-col justify-center border-b border-white/5 md:border-none">
                              <div className="flex items-center justify-between mb-2">
                                  <span className="md:hidden w-28 text-slate-500 text-xs uppercase font-bold">IRR:</span>
                                  <div className={`flex items-center font-bold text-lg ${isBestIRR ? 'text-emerald-400' : 'text-slate-300'}`}>
                                      {match.projectedIRR}%
                                      {isBestIRR && <TrendingUp className="h-4 w-4 ml-1" />}
                                  </div>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                  <div 
                                      className={`h-full rounded-full transition-all duration-500 ${isBestIRR ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}
                                      style={{ width: `${irrPercent}%` }}
                                  />
                              </div>
                          </div>

                          <div className="h-12 flex items-center text-slate-300 text-sm border-b border-white/5 md:border-none truncate" title={match.zoning}>
                              <span className="md:hidden w-28 text-slate-500 text-xs uppercase font-bold">Zoning:</span>
                              {match.zoning}
                          </div>
                          <div className="h-32 overflow-y-auto text-xs text-slate-400 space-y-2 pt-1 custom-scrollbar">
                               <span className="md:hidden block text-slate-500 text-xs uppercase font-bold mb-1">Infrastructure:</span>
                               {match.infrastructure.map((inf, i) => (
                                   <div key={i} className="flex items-center gap-2 bg-slate-900/40 p-1.5 rounded border border-white/5">
                                       <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full shrink-0" />
                                       {inf}
                                   </div>
                               ))}
                          </div>
                      </div>
                  )
              })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;