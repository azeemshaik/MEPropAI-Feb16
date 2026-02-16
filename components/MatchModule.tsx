
import React, { useState, useEffect } from 'react';
import { findLandMatches, LandMatch, GroundingSource } from '../services/gemini';
import { Search, MapPin, TrendingUp, DollarSign, Loader2, CheckSquare, Square, Map as MapIcon, CheckCircle2, ExternalLink, Info } from 'lucide-react';
import SimpleMap from './SimpleMap';
import ComparisonModal from './ComparisonModal';

const MatchModule: React.FC = () => {
  const [capital, setCapital] = useState<number>(50000000);
  const [targetIRR, setTargetIRR] = useState<number>(18);
  const [type, setType] = useState<string>('Mixed-Use Communities');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<LandMatch[] | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');
  const [showGlobalMap, setShowGlobalMap] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);

  useEffect(() => {
    if (showGlobalMap) {
      setMapLoading(true);
      const timer = setTimeout(() => setMapLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [showGlobalMap]);

  const handleMatch = async () => {
    setLoading(true);
    setMatches(null);
    setSources([]);
    setExpandedIndex(null);
    setSelectedIndices([]);
    setFilterType('All'); 
    setShowGlobalMap(false);
    try {
      const { matches: results, sources: groundingSources } = await findLandMatches(capital, targetIRR, type);
      setMatches(results);
      setSources(groundingSources);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const toggleSelection = (idx: number) => {
    if (selectedIndices.includes(idx)) {
      setSelectedIndices(prev => prev.filter(i => i !== idx));
    } else {
      if (selectedIndices.length < 5) {
        setSelectedIndices(prev => [...prev, idx]);
      }
    }
  };

  const filteredMatches = matches?.filter(match => 
    filterType === 'All' ? true : match.type === filterType
  );

  const visibleIndices = filteredMatches?.map(m => matches!.indexOf(m)) || [];
  const allFilteredSelected = visibleIndices.length > 0 && visibleIndices.every(idx => selectedIndices.includes(idx));
  const someFilteredSelected = visibleIndices.some(idx => selectedIndices.includes(idx));

  const handleSelectAllToggle = () => {
    if (allFilteredSelected) {
      setSelectedIndices(prev => prev.filter(idx => !visibleIndices.includes(idx)));
    } else {
      setSelectedIndices(prev => Array.from(new Set([...prev, ...visibleIndices])));
    }
  };

  const handleCardMapClick = (match: LandMatch) => {
    const idx = matches?.indexOf(match);
    if (idx !== undefined && idx !== -1) {
      if (!selectedIndices.includes(idx)) {
        setSelectedIndices(prev => Array.from(new Set([...prev, idx])));
      }
      setShowComparison(true);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 pb-32">
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-80 space-y-8">
          <div className="sticky top-20">
            <h2 className="text-3xl font-bold text-apple-text mb-2">Discovery</h2>
            <p className="text-apple-secondary text-sm mb-8">Set your mandate to find high-precision land matches grounded in real-world data.</p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-apple-secondary uppercase tracking-widest px-1">Allocation (AED/SAR)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-secondary group-focus-within:text-primary-500 transition-colors">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <input 
                    type="number" 
                    value={capital}
                    onChange={(e) => setCapital(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-apple-text focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-apple-secondary uppercase tracking-widest px-1">Target IRR (%)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-secondary group-focus-within:text-primary-500 transition-colors">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <input 
                    type="number" 
                    value={targetIRR}
                    onChange={(e) => setTargetIRR(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-apple-text focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-apple-secondary uppercase tracking-widest px-1">Asset Class</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 text-apple-text focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm"
                >
                  <option>Residential Tower</option>
                  <option>Mixed-Use Communities</option>
                  <option>Commercial HQ</option>
                  <option>Industrial/Logistics</option>
                  <option>Hospitality/Resorts</option>
                </select>
              </div>

              <button 
                onClick={handleMatch}
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-5 rounded-3xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-primary-500/20 active:scale-95"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Find Match'}
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {matches ? (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-4 border border-gray-100 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleSelectAllToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
                      allFilteredSelected 
                        ? 'bg-primary-500 border-primary-500 text-white shadow-lg' 
                        : 'bg-white border-gray-200 text-apple-text hover:border-primary-500'
                    }`}
                  >
                    {allFilteredSelected ? <CheckCircle2 className="h-4 w-4" /> : someFilteredSelected ? <div className="w-4 h-4 rounded-sm border-2 border-primary-500 flex items-center justify-center"><div className="w-2 h-0.5 bg-primary-500"></div></div> : <Square className="h-4 w-4" />}
                    {allFilteredSelected ? 'Deselect All' : 'Select All'}
                  </button>
                  <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                  <h3 className="text-sm font-bold text-apple-text hidden sm:block">
                    {filteredMatches?.length} Grounded Matches
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowGlobalMap(!showGlobalMap)}
                    className={`p-2 rounded-xl transition-all border ${
                      showGlobalMap ? 'bg-apple-text text-white border-apple-text' : 'bg-white text-apple-secondary border-gray-200 hover:border-primary-500'
                    }`}
                    title="Toggle Map View"
                  >
                    <MapIcon className="h-4 w-4" />
                  </button>
                  <div className="h-6 w-px bg-gray-200"></div>
                  <div className="flex gap-1">
                    {['All', 'Residential', 'Commercial', 'Mixed-Use'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setFilterType(t)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                          filterType === t ? 'bg-primary-500 text-white shadow-md' : 'bg-gray-50 text-apple-secondary border border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {showGlobalMap && filteredMatches && filteredMatches.length > 0 && (
                <div className="apple-card h-80 relative overflow-hidden mb-6 border border-gray-100 shadow-xl">
                   {mapLoading ? (
                     <div className="absolute inset-0 z-[500] bg-gray-50 flex flex-col items-center justify-center animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                        <div className="h-4 w-48 bg-gray-200 rounded-full mb-2"></div>
                        <span className="text-[10px] font-bold text-apple-secondary uppercase tracking-widest">Verifying Satellite Data...</span>
                     </div>
                   ) : (
                     <>
                       <SimpleMap 
                        center={filteredMatches[0].coordinates} 
                        fitBounds={true}
                        markers={filteredMatches.map((m, i) => ({
                          id: i,
                          lat: m.coordinates.lat,
                          lng: m.coordinates.lng,
                          label: m.name,
                          isCurrent: selectedIndices.includes(matches.indexOf(m))
                        }))}
                        onMarkerClick={(m) => handleCardMapClick(filteredMatches[m.id as number])}
                       />
                       <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold text-apple-text shadow-xl border border-white">
                          INTERACTIVE REGIONAL CLUSTER • CLICK TO COMPARE
                       </div>
                     </>
                   )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMatches?.map((match, idx) => {
                  const originalIndex = matches.indexOf(match);
                  const isSelected = selectedIndices.includes(originalIndex);
                  const isExpanded = expandedIndex === originalIndex;

                  return (
                    <div 
                      key={idx}
                      className={`apple-card group border border-transparent transition-all ${isSelected ? 'border-primary-500 ring-4 ring-primary-500/5' : ''}`}
                    >
                      <div className="relative h-48 bg-gray-100 overflow-hidden cursor-crosshair">
                        <SimpleMap 
                          center={match.coordinates} 
                          fitBounds={true}
                          markers={[{...match.coordinates, label: match.name, isCurrent: true}]} 
                          onMarkerClick={() => handleCardMapClick(match)}
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-apple-text shadow-sm border border-white/50 z-[400]">
                          MATCH SCORE: {match.matchScore}%
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleSelection(originalIndex); }}
                          className={`absolute top-4 right-4 p-2 rounded-full transition-all z-[400] ${isSelected ? 'bg-primary-500 text-white shadow-lg' : 'bg-white/80 backdrop-blur text-apple-secondary hover:text-primary-500'}`}
                        >
                          {isSelected ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                        </button>
                        <div className="absolute inset-0 bg-transparent z-[10] flex items-end justify-center pb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-[10px] bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur">Click Map for Full Analysis</span>
                        </div>
                      </div>

                      <div className="p-6 cursor-pointer" onClick={() => toggleExpand(originalIndex)}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-apple-text line-clamp-1">{match.name}</h4>
                          <span className="text-xl font-bold text-primary-500">{match.projectedIRR}% <span className="text-[10px] text-apple-secondary">IRR</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-apple-secondary text-sm mb-4">
                          <MapPin className="h-4 w-4" />
                          <span>{match.location}</span>
                        </div>
                        <p className="text-sm text-apple-secondary leading-relaxed line-clamp-2">
                          {match.reasoning}
                        </p>
                        
                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t border-gray-100 space-y-4 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-50 p-4 rounded-2xl">
                                <span className="text-[10px] font-bold text-apple-secondary uppercase tracking-widest mb-1 block">Zoning</span>
                                <span className="text-sm font-semibold text-apple-text">{match.zoning}</span>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-2xl">
                                <span className="text-[10px] font-bold text-apple-secondary uppercase tracking-widest mb-1 block">Infrastructure</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {match.infrastructure.map((inf, i) => (
                                    <span key={i} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-apple-secondary">{inf}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Data Sources Display (Mandatory for Google Maps tool) */}
              {sources.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4 text-apple-text">
                    <Info className="h-4 w-4" />
                    <h4 className="text-sm font-bold uppercase tracking-widest">Grounding Sources</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {sources.map((source, i) => (
                      <a 
                        key={i} 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-xs font-medium text-apple-secondary hover:text-primary-500 hover:border-primary-500 transition-all shadow-sm"
                      >
                        {source.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[500px] apple-card flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-apple-text mb-2">Mandate Ready</h3>
              <p className="text-apple-secondary max-w-xs mx-auto">Input your capital requirements to activate our real-time matching engine with Google Maps grounding.</p>
            </div>
          )}
        </div>
      </div>

      {selectedIndices.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
          <div className="apple-blur border border-gray-200 p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 ml-2">
              <div className="bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                {selectedIndices.length}
              </div>
              <span className="text-sm font-semibold">Selected Properties</span>
            </div>
            <button 
              onClick={() => setShowComparison(true)}
              className="bg-apple-text hover:bg-black text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg active:scale-95"
            >
              Analyze
            </button>
          </div>
        </div>
      )}

      {showComparison && matches && (
        <ComparisonModal 
          selectedMatches={matches.filter((_, idx) => selectedIndices.includes(idx))}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

export default MatchModule;
