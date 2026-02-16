
import React, { useState, useEffect } from 'react';
import { 
  Calendar, ShieldCheck, ClipboardCheck, Globe, Key, 
  Truck, AlertTriangle, TrendingDown, CheckCircle2, 
  Clock, Package, Boxes, Loader2, Info, Navigation,
  Search, Filter, ShoppingBag, Zap, Award, Star,
  ArrowRight, LayoutGrid, List, ChevronRight, Flag,
  MessageSquare, X, Send, Timer, BarChart, AlertCircle,
  Activity, ShieldAlert, ChevronDown, SlidersHorizontal
} from 'lucide-react';
import { 
  BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { analyzeProcurementRisk, ProcurementRisk } from '../services/gemini';

interface SupplierMetrics {
  onTimeRate: number;
  qualityScore: number;
  responseTime: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
  unit: string;
  moq: string;
  leadTime: string;
  supplier: string;
  rating: number;
  verified: boolean;
  sustainabilityScore: number;
  category: string;
  supplierMetrics: SupplierMetrics;
}

const products: Product[] = [
  {
    id: 1,
    name: "Grade A Reinforced Structural Steel Rebar",
    image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&q=80&w=400",
    price: "2,450 - 2,800",
    unit: "ton",
    moq: "50 tons",
    leadTime: "12-14 days",
    supplier: "Emirates Steel Arkan",
    rating: 4.9,
    verified: true,
    sustainabilityScore: 88,
    category: "Structural",
    supplierMetrics: {
      onTimeRate: 98,
      qualityScore: 99,
      responseTime: "1.5 hrs"
    }
  },
  {
    id: 2,
    name: "Low-Carbon Portland Cement Bulk",
    image: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=400",
    price: "280 - 310",
    unit: "ton",
    moq: "100 tons",
    leadTime: "3-5 days",
    supplier: "National Cement Co.",
    rating: 4.7,
    verified: true,
    sustainabilityScore: 94,
    category: "Structural",
    supplierMetrics: {
      onTimeRate: 95,
      qualityScore: 97,
      responseTime: "45 mins"
    }
  },
  {
    id: 3,
    name: "Industrial HVAC Central Cooling Plant",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=400",
    price: "45,000 - 62,000",
    unit: "unit",
    moq: "1 unit",
    leadTime: "45 days",
    supplier: "Daikin Middle East",
    rating: 4.8,
    verified: true,
    sustainabilityScore: 82,
    category: "MEP",
    supplierMetrics: {
      onTimeRate: 92,
      qualityScore: 98,
      responseTime: "3 hrs"
    }
  },
  {
    id: 4,
    name: "Smart Glass Curtain Wall Panels (Triple Glazed)",
    image: "https://images.unsplash.com/photo-1508919892451-4c81acad1983?auto=format&fit=crop&q=80&w=400",
    price: "420 - 550",
    unit: "sqm",
    moq: "200 sqm",
    leadTime: "30 days",
    supplier: "Gulf Glass Industries",
    rating: 4.9,
    verified: true,
    sustainabilityScore: 91,
    category: "Facade",
    supplierMetrics: {
      onTimeRate: 96,
      qualityScore: 99,
      responseTime: "1 hr"
    }
  },
  {
    id: 5,
    name: "Polished Italian Carrara Marble Slabs",
    image: "https://images.unsplash.com/photo-1628592102751-ba83b0314276?auto=format&fit=crop&q=80&w=400",
    price: "180 - 240",
    unit: "sqm",
    moq: "50 sqm",
    leadTime: "25 days",
    supplier: "Al-Rashed Stone",
    rating: 4.6,
    verified: true,
    sustainabilityScore: 75,
    category: "Finishes",
    supplierMetrics: {
      onTimeRate: 88,
      qualityScore: 94,
      responseTime: "5 hrs"
    }
  },
  {
    id: 6,
    name: "Institutional Grade Fire Safety System",
    image: "https://images.unsplash.com/photo-1590483734714-36856037a3c3?auto=format&fit=crop&q=80&w=400",
    price: "12,000 - 18,000",
    unit: "package",
    moq: "1 package",
    leadTime: "15 days",
    supplier: "NAFFCO Group",
    rating: 5.0,
    verified: true,
    sustainabilityScore: 85,
    category: "MEP",
    supplierMetrics: {
      onTimeRate: 99,
      qualityScore: 100,
      responseTime: "20 mins"
    }
  }
];

const ganttData = [
  { 
    category: 'Structural', 
    tasks: [
      { name: 'Foundation Piling', start: 0, end: 1.2, status: 'Completed', color: 'bg-blue-500' },
      { name: 'Grade Beam Casting', start: 1, end: 2.5, status: 'In Progress', color: 'bg-blue-400' },
      { name: 'Core Frame Erection', start: 2.2, end: 4.8, status: 'Planned', color: 'bg-blue-300' }
    ]
  },
  { 
    category: 'MEP Systems', 
    tasks: [
      { name: 'Main Plant Procurement', start: 0.5, end: 3, status: 'Completed', color: 'bg-indigo-500' },
      { name: 'Rough-in Level 1-10', start: 2.8, end: 5.2, status: 'Planned', color: 'bg-indigo-400' },
      { name: 'BMS Integration', start: 5, end: 6, status: 'Planned', color: 'bg-indigo-300' }
    ]
  },
  { 
    category: 'Facade', 
    tasks: [
      { name: 'Custom Glazing Mfg', start: 1.5, end: 4, status: 'In Progress', color: 'bg-purple-500' },
      { name: 'Installation (Lower)', start: 4.2, end: 5.8, status: 'Planned', color: 'bg-purple-400' }
    ]
  },
  { 
    category: 'Finishes', 
    tasks: [
      { name: 'Common Area Fit-out', start: 4.5, end: 6, status: 'Planned', color: 'bg-teal-500' }
    ]
  }
];

const ProcurementModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('marketplace');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [risks, setRisks] = useState<ProcurementRisk[]>([]);
  const [loadingRisks, setLoadingRisks] = useState(false);
  
  // Advanced Filter State
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [minSustainability, setMinSustainability] = useState<number>(0);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  // Quote Modal State
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);
  const [quoteQuantity, setQuoteQuantity] = useState<string>('');
  const [quoteMessage, setQuoteMessage] = useState<string>('');
  const [isSendingQuote, setIsSendingQuote] = useState(false);

  useEffect(() => {
    if (activeSubTab === 'risk-dashboard' || activeSubTab === 'logistics') {
      fetchRisks();
    }
  }, [activeSubTab]);

  const fetchRisks = async () => {
    setLoadingRisks(true);
    try {
      const data = await analyzeProcurementRisk('Middle East (KSA, UAE, Qatar)');
      setRisks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRisks(false);
    }
  };

  const handleRequestQuote = (product: Product) => {
    setQuoteProduct(product);
    setQuoteQuantity(product.moq.split(' ')[0]);
    setQuoteMessage(`We are interested in procuring ${product.name} for our upcoming project in Riyadh. Please provide your best institutional rate for bulk delivery.`);
  };

  const submitQuote = async () => {
    setIsSendingQuote(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSendingQuote(false);
    setQuoteProduct(null);
    alert("Quote request sent successfully to " + quoteProduct?.supplier);
  };

  const categories = [
    "All Categories",
    "Structural",
    "MEP",
    "Facade",
    "Finishes",
    "Smart Systems",
    "Tools & Hardware"
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Convert price string like "2,450 - 2,800" to a base number for filtering
    const priceValue = parseInt(p.price.split('-')[0].replace(/,/g, ''));
    const matchesPrice = (!minPrice || priceValue >= parseInt(minPrice)) && 
                         (!maxPrice || priceValue <= parseInt(maxPrice));
    
    const matchesRating = p.rating >= minRating;
    const matchesSustainability = p.sustainabilityScore >= minSustainability;
    const matchesVerified = !onlyVerified || p.verified;

    return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesSustainability && matchesVerified;
  });

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'Critical': return '#ef4444';
      case 'Warning': return '#f59e0b';
      case 'Stable': return '#10b981';
      default: return '#94a3b8';
    }
  };

  const getRiskDistributionData = () => {
    const counts = risks.reduce((acc: any, risk) => {
      acc[risk.riskLevel] = (acc[risk.riskLevel] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(level => ({
      name: level,
      value: counts[level]
    }));
  };

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setMinSustainability(0);
    setOnlyVerified(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 animate-fade-in relative">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-apple-text mb-2">Institutional <span className="text-primary-500">Procurement</span></h2>
          <p className="text-apple-secondary max-w-xl">Middle East supply chain orchestration. Direct sourcing with institutional transparency.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
          {[
            { id: 'marketplace', label: 'Market', icon: ShoppingBag },
            { id: 'timeline', label: 'Gantt', icon: Calendar },
            { id: 'vault', label: 'Vault', icon: ShieldCheck },
            { id: 'risk-dashboard', label: 'Risk Dashboard', icon: AlertCircle },
            { id: 'logistics', label: 'Supply Lanes', icon: Globe },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeSubTab === tab.id 
                ? 'bg-white text-apple-text shadow-sm' 
                : 'text-apple-secondary hover:text-apple-text'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'marketplace' && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Categories - Alibaba Style */}
          <aside className="lg:w-64 space-y-6">
            <div className="apple-card p-4">
              <h3 className="text-xs font-bold text-apple-secondary uppercase tracking-widest mb-4 px-2">Categories</h3>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                      selectedCategory === cat 
                      ? 'bg-primary-50 text-primary-600 font-bold' 
                      : 'text-apple-text hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                    <ChevronRight className={`h-3 w-3 ${selectedCategory === cat ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                ))}
              </nav>
            </div>

            <div className="apple-card p-4 bg-slate-900 text-white">
              <Award className="h-6 w-6 text-indigo-400 mb-3" />
              <h4 className="text-sm font-bold mb-1">Institutional Pricing</h4>
              <p className="text-[10px] text-slate-400 mb-4">You are viewing bulk-order rates pre-negotiated for Tier 1 developers.</p>
              <div className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> VERIFIED CREDENTIALS ACTIVE
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-apple-secondary group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search materials, systems, or suppliers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`flex items-center justify-center gap-2 px-6 py-3.5 border rounded-2xl text-sm font-bold transition-all shadow-sm active:scale-95 ${
                    showAdvancedFilters 
                      ? 'bg-primary-500 border-primary-500 text-white' 
                      : 'bg-white border-gray-200 text-apple-text hover:border-primary-500'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Expandable Advanced Filters Panel */}
              {showAdvancedFilters && (
                <div className="apple-card p-6 bg-white border border-gray-100 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Price Range */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-apple-secondary uppercase tracking-widest flex items-center gap-2">
                        <TrendingDown className="h-3 w-3" /> Price Range (SAR)
                      </label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          placeholder="Min" 
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary-500/10 outline-none"
                        />
                        <span className="text-gray-300">—</span>
                        <input 
                          type="number" 
                          placeholder="Max" 
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary-500/10 outline-none"
                        />
                      </div>
                    </div>

                    {/* Minimum Rating */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-apple-secondary uppercase tracking-widest flex items-center gap-2">
                        <Star className="h-3 w-3" /> Min. Rating
                      </label>
                      <div className="flex items-center justify-between bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star}
                            onClick={() => setMinRating(star)}
                            className={`p-1.5 rounded-lg transition-all ${minRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                          >
                            <Star className={`h-4 w-4 ${minRating >= star ? 'fill-yellow-500' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sustainability Score */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-apple-secondary uppercase tracking-widest flex items-center gap-2">
                        <Zap className="h-3 w-3" /> ESG Sustainability (min)
                      </label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="5"
                          value={minSustainability}
                          onChange={(e) => setMinSustainability(parseInt(e.target.value))}
                          className="flex-1 accent-primary-500"
                        />
                        <span className="text-xs font-bold w-8">{minSustainability}%</span>
                      </div>
                    </div>

                    {/* Verification & Reset */}
                    <div className="flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                         <label className="text-[10px] font-bold text-apple-secondary uppercase tracking-widest cursor-pointer" htmlFor="verified-toggle">
                           Verified Only
                         </label>
                         <button 
                          id="verified-toggle"
                          onClick={() => setOnlyVerified(!onlyVerified)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${onlyVerified ? 'bg-primary-500' : 'bg-gray-200'}`}
                         >
                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${onlyVerified ? 'translate-x-5' : 'translate-x-0'}`} />
                         </button>
                      </div>
                      <button 
                        onClick={resetFilters}
                        className="w-full mt-4 text-[10px] font-bold text-primary-500 uppercase tracking-widest hover:underline text-left"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Grid - Alibaba/Marketplace Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? filteredProducts.map((p) => (
                <div key={p.id} className="apple-card group overflow-hidden border border-transparent hover:border-primary-500 transition-all cursor-pointer flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {p.verified && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[9px] font-bold text-primary-600 flex items-center gap-1 shadow-sm">
                        <Award className="h-3 w-3" /> PRO VERIFIED
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur px-2 py-1 rounded-lg text-[9px] font-bold text-white flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> {p.rating}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-2">
                      <h4 className="font-bold text-apple-text line-clamp-2 min-h-[2.5rem] mb-1 group-hover:text-primary-500 transition-colors">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-apple-secondary font-medium">
                        <MapPinIcon /> {p.supplier}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xl font-bold text-apple-text">
                        SAR {p.price} <span className="text-[10px] text-apple-secondary font-normal">/ {p.unit}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] text-apple-secondary">MOQ: <span className="font-bold text-apple-text">{p.moq}</span></span>
                        <span className="text-[10px] text-apple-secondary">Lead: <span className="font-bold text-apple-text">{p.leadTime}</span></span>
                      </div>
                    </div>

                    {/* Supplier Performance Metrics Section */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="text-[9px] font-bold text-apple-secondary uppercase tracking-widest mb-2 flex items-center gap-1">
                        <BarChart className="h-3 w-3" /> Supplier Performance
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <Timer className="h-2.5 w-2.5" /> {p.supplierMetrics.onTimeRate}%
                          </div>
                          <span className="text-[8px] text-apple-secondary whitespace-nowrap">On-Time</span>
                        </div>
                        <div className="flex flex-col items-center border-x border-gray-200">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
                            <ShieldCheck className="h-2.5 w-2.5" /> {p.supplierMetrics.qualityScore}%
                          </div>
                          <span className="text-[8px] text-apple-secondary whitespace-nowrap">Quality</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600">
                            <MessageSquare className="h-2.5 w-2.5" /> {p.supplierMetrics.responseTime}
                          </div>
                          <span className="text-[8px] text-apple-secondary whitespace-nowrap">Response</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-green-600 uppercase tracking-widest">Sustainability Score</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className="bg-green-500 h-full" style={{ width: `${p.sustainabilityScore}%` }} />
                            </div>
                            <span className="text-[10px] font-bold">{p.sustainabilityScore}</span>
                          </div>
                        </div>
                        <button className="p-2 bg-gray-50 rounded-xl text-apple-text hover:bg-primary-500 hover:text-white transition-all">
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRequestQuote(p); }}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Request Quote
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center apple-card bg-gray-50 border border-dashed border-gray-300">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-apple-text">No matching materials found</h3>
                  <p className="text-apple-secondary text-sm">Try adjusting your search or filters to broaden results.</p>
                  <button onClick={resetFilters} className="mt-6 text-primary-500 font-bold hover:underline">Clear all filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quote Request Modal */}
      {quoteProduct && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setQuoteProduct(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-apple-text">Request Custom Quote</h3>
                    <p className="text-xs text-apple-secondary">Institutional Procurement Request</p>
                  </div>
                </div>
                <button onClick={() => setQuoteProduct(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="h-5 w-5 text-apple-secondary" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <img src={quoteProduct.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                  <div>
                    <h4 className="font-bold text-apple-text text-sm">{quoteProduct.name}</h4>
                    <p className="text-xs text-apple-secondary">{quoteProduct.supplier}</p>
                    <div className="mt-1 text-[10px] font-bold text-primary-500 uppercase tracking-widest">
                      Price: SAR {quoteProduct.price} / {quoteProduct.unit}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-apple-secondary uppercase tracking-widest px-1">Order Quantity ({quoteProduct.unit})</label>
                    <input 
                      type="number" 
                      value={quoteQuantity}
                      onChange={(e) => setQuoteQuantity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                    />
                    <p className="text-[10px] text-apple-secondary px-1 italic">Minimum order quantity: {quoteProduct.moq}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-apple-secondary uppercase tracking-widest px-1">Specific Requirements / Message</label>
                    <textarea 
                      rows={4}
                      value={quoteMessage}
                      onChange={(e) => setQuoteMessage(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all resize-none"
                    />
                  </div>
                </div>

                <button 
                  onClick={submitQuote}
                  disabled={isSendingQuote}
                  className="w-full bg-apple-text hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {isSendingQuote ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Send Inquiry <Send className="h-4 w-4" /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gantt Chart View */}
      {activeSubTab === 'timeline' && (
        <div className="apple-card p-8 animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold">Construction Orchestration</h3>
              <p className="text-xs text-apple-secondary">Mapping high-yield procurement packages to the build schedule.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                <span className="text-[10px] font-bold text-green-700 uppercase">On Schedule</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <button className="text-[10px] font-bold text-primary-500 uppercase hover:underline">Update Baseline</button>
            </div>
          </div>

          <div className="relative overflow-x-auto pb-6 custom-scrollbar">
            <div className="min-w-[800px]">
              {/* Timeline Header */}
              <div className="grid grid-cols-[200px_1fr] border-b border-gray-100 pb-4">
                <div className="text-[10px] font-bold text-apple-secondary uppercase tracking-widest pl-2">Asset Group</div>
                <div className="grid grid-cols-6 gap-0">
                  {['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'].map(m => (
                    <div key={m} className="text-center text-[10px] font-bold text-apple-secondary uppercase tracking-widest border-l border-gray-100">{m}</div>
                  ))}
                </div>
              </div>

              {/* Gantt Rows */}
              <div className="relative">
                {/* Vertical Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-[200px_1fr] pointer-events-none">
                  <div></div>
                  <div className="grid grid-cols-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="border-l border-gray-100 h-full"></div>
                    ))}
                  </div>
                </div>

                {/* Content Rows */}
                <div className="space-y-6 pt-6">
                  {ganttData.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-[200px_1fr] items-center group">
                      <div className="pl-2">
                        <h4 className="text-sm font-bold text-apple-text">{row.category}</h4>
                        <span className="text-[9px] text-apple-secondary font-medium uppercase tracking-tighter">{row.tasks.length} Active Workstreams</span>
                      </div>
                      <div className="relative h-12 flex flex-col justify-center">
                        {row.tasks.map((task, tidx) => {
                          const left = (task.start / 6) * 100;
                          const width = ((task.end - task.start) / 6) * 100;
                          return (
                            <div 
                              key={tidx}
                              className={`absolute h-6 ${task.color} rounded-lg shadow-sm border border-white/20 flex items-center px-3 cursor-pointer hover:brightness-110 transition-all z-10`}
                              style={{ 
                                left: `${left}%`, 
                                width: `${width}%`,
                                top: tidx === 0 ? '0px' : tidx === 1 ? '16px' : '32px',
                                opacity: 0.9,
                                height: '24px'
                              }}
                              title={`${task.name}: ${task.status}`}
                            >
                              <span className="text-[9px] font-bold text-white truncate drop-shadow-sm">{task.name}</span>
                              {task.status === 'Completed' && <CheckCircle2 className="h-2.5 w-2.5 ml-auto text-white" />}
                              {task.status === 'In Progress' && <Clock className="h-2.5 w-2.5 ml-auto text-white animate-pulse" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones Indicator */}
              <div className="mt-16 grid grid-cols-[200px_1fr]">
                <div className="text-[10px] font-bold text-apple-secondary uppercase tracking-widest pl-2">Key Milestones</div>
                <div className="relative h-10 border-t border-dashed border-gray-200 flex items-center">
                   {[
                     { name: 'Groundbreaking', pos: 0.2 },
                     { name: 'Structural Top-out', pos: 4.8 },
                     { name: 'Institutional Handover', pos: 5.8 }
                   ].map((m, i) => (
                     <div key={i} className="absolute flex flex-col items-center" style={{ left: `${(m.pos / 6) * 100}%` }}>
                        <div className="w-px h-10 bg-primary-500/30 absolute -top-5" />
                        <Flag className="h-3 w-3 text-primary-500 mb-1" />
                        <span className="text-[8px] font-bold text-apple-text whitespace-nowrap bg-white px-1">{m.name}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>

          {/* Critical Path Insight */}
          <div className="mt-10 p-5 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-5">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-orange-900">Procurement Bottleneck Detected</h4>
              <p className="text-xs text-orange-700 leading-relaxed">
                "Custom Glazing Mfg" (Facade) delay in Month 2 will push "Interior Fit-out" (Finishes) into Month 7. 
                <span className="font-bold ml-1 cursor-pointer underline">Authorize expedited air-freight?</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Risk Dashboard sub-tab */}
      {activeSubTab === 'risk-dashboard' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="apple-card p-6 bg-slate-900 text-white">
              <Activity className="h-6 w-6 text-primary-400 mb-3" />
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Exposure Index</h4>
              <div className="text-3xl font-bold">Moderate</div>
              <p className="text-[10px] text-slate-500 mt-2">Calculated based on SAR volatility and shipping lane alerts.</p>
            </div>
            <div className="apple-card p-6 bg-slate-900 text-white">
              <ShieldAlert className="h-6 w-6 text-red-400 mb-3" />
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Alerts</h4>
              <div className="text-3xl font-bold">{risks.filter(r => r.riskLevel === 'Critical').length} Critical</div>
              <p className="text-[10px] text-slate-500 mt-2">Requires immediate institutional attention.</p>
            </div>
            <div className="apple-card p-6 bg-slate-900 text-white">
              <Boxes className="h-6 w-6 text-emerald-400 mb-3" />
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stable Lanes</h4>
              <div className="text-3xl font-bold">{risks.filter(r => r.riskLevel === 'Stable').length} Monitored</div>
              <p className="text-[10px] text-slate-500 mt-2">High predictability across primary suppliers.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="apple-card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary-500" />
                Risk Distribution
              </h3>
              <div className="h-72">
                {loadingRisks ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-200 mb-2" />
                    <span className="text-xs text-apple-secondary font-bold uppercase tracking-widest">Aggregating Risk Data...</span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getRiskDistributionData()}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {getRiskDistributionData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getRiskColor(entry.name)} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="apple-card p-8 bg-gray-50 border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Mitigation Feed</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {risks.map((risk, i) => (
                  <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-primary-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRiskColor(risk.riskLevel) }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-apple-secondary">{risk.category}</span>
                    </div>
                    <p className="text-xs text-apple-text font-bold mb-1">{risk.mitigation}</p>
                    <p className="text-[10px] text-apple-secondary leading-relaxed">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'logistics' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 apple-card p-8 min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary-500" />
                  Global Supply Lanes
                </h3>
                <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full text-red-600 text-[10px] font-bold animate-pulse">
                  <AlertTriangle className="h-3 w-3" /> RED SEA ADVISORY ACTIVE
                </div>
              </div>
              {loadingRisks ? (
                <div className="flex-1 flex flex-col items-center justify-center text-apple-secondary">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary-200" />
                  <p className="text-sm font-medium">Scanning live satellite and market data...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {risks.length > 0 ? risks.map((risk, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 group hover:border-primary-200 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${risk.riskLevel === 'Critical' ? 'bg-red-500' : 'bg-orange-400'}`} />
                          <h4 className="font-bold text-apple-text">{risk.category}</h4>
                        </div>
                      </div>
                      <p className="text-xs text-apple-secondary mb-4 leading-relaxed">{risk.description}</p>
                    </div>
                  )) : (
                    <div className="flex-1 flex items-center justify-center text-apple-secondary italic">
                      No live risks detected in current sector.
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="apple-card p-8 bg-slate-900 text-white">
              <TrendingDown className="h-6 w-6 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Currency Hedge</h3>
              <p className="text-xs text-slate-400 mb-6">SAR/AED linked orders secured with multi-currency locking.</p>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Total Exposure</span>
                    <span className="font-bold text-slate-100">8.4M AED</span>
                 </div>
                 <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold transition-all">
                    Adjust Forward Contract
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'vault' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
          <div className="md:col-span-4 space-y-4">
            <div className="apple-card p-6 bg-slate-900 text-white">
              <ShieldCheck className="h-8 w-8 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Compliance Vault</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Verification of supplier ESG and regional green building certifications.</p>
            </div>
          </div>
          <div className="md:col-span-8 grid grid-cols-1 gap-4">
            {[
              { name: 'Al-Fanar MEP Solutions', cert: 'Estidama 3-Pearl', status: 'Verified' },
              { name: 'Emirates Steel Arkan', cert: 'Vision 2030 ESG', status: 'Verified' },
            ].map((s, i) => (
              <div key={i} className="apple-card p-6 flex items-center justify-between transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <Key className="h-5 w-5 text-apple-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-apple-text">{s.name}</h4>
                    <p className="text-xs text-apple-secondary">{s.cert}</p>
                  </div>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {s.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MapPinIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default ProcurementModule;
