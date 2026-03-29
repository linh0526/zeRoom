"use client";

import { 
  MapPin, User, LogOut, LayoutDashboard, Search, SlidersHorizontal, ChevronDown, Check, Plus
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const PROVINCES = [
  "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Bình Dương", "Đồng Nai", 
  "Bà Rịa - Vũng Tàu", "Cần Thơ", "Khánh Hòa", "Hải Phòng", "An Giang", 
  "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Phước", 
  "Bình Thuận", "Bình Định", "Cà Mau", "Cao Bằng", "Gia Lai", "Hà Giang", 
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình", "Hưng Yên", 
  "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", 
  "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", 
  "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", 
  "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", 
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", 
  "Vĩnh Long", "Vĩnh Phúc", "Yên Bái", "Đắk Lắk", "Đắk Nông", "Điện Biên", 
  "Đồng Tháp"
];

interface HeaderProps {
  onFilterChange?: (filters: any) => void;
  filters?: any;
  onOpenFilter?: () => void;
}

export default function Header({ onFilterChange, filters, onOpenFilter }: HeaderProps) {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  const [search, setSearch] = useState(filters?.search || "");
  const [provinceSearch, setProvinceSearch] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(filters?.province || "Tất cả khu vực");
  
  const pathname = usePathname();
  const router = useRouter();
  const locationRef = useRef<HTMLDivElement>(null);

  const filteredProvinces = provinceSearch 
    ? PROVINCES.filter(p => p.toLowerCase().includes(provinceSearch.toLowerCase())) 
    : PROVINCES;

  const isHome = pathname === "/";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationSelect(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (onFilterChange) {
      onFilterChange({ ...filters, search: val });
    }
  };

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
    setShowLocationSelect(false);
    if (onFilterChange) {
      onFilterChange({ ...filters, province: province === "Tất cả khu vực" ? "Tất cả" : province });
    }
  };

  return (
    <header className="h-16 md:h-20 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-[500] sticky top-0 gap-2 md:gap-4">
      {/* Left: Logo */}
      <div className="flex items-center shrink-0 min-w-fit md:min-w-[140px]">
        <Link href="/" aria-label="zeRoom Home" className="flex items-center gap-2 group transition-all">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 rotate-[-4deg] group-hover:rotate-0 transition-all duration-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-gray-900 hidden lg:block">
            ze<span className="text-orange-500">Room</span>
          </h1>
        </Link>
      </div>

      {/* Center: Search & Filter */}
      <div className="flex-1 max-w-2xl px-0 md:px-4">
        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-2 md:px-4 py-1.5 gap-1 md:gap-2 group focus-within:ring-4 focus-within:ring-orange-500/10 focus-within:border-orange-500 focus-within:bg-white transition-all duration-300 shadow-sm relative">
          {/* Location Picker */}
          <div className="relative shrink-0" ref={locationRef}>
            <button 
              onClick={() => setShowLocationSelect(!showLocationSelect)}
              className="flex items-center gap-1 md:gap-2 px-1.5 md:px-2 py-1.5 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-200"
            >
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="text-[11px] font-bold text-gray-800 line-clamp-1 max-w-[60px] md:max-w-[100px] hidden sm:block">{selectedProvince}</span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform shrink-0 ${showLocationSelect ? 'rotate-180' : ''}`} />
            </button>
            
            {showLocationSelect && (
              <div className="absolute top-[calc(100%+12px)] left-[-16px] sm:left-0 w-[calc(100vw-32px)] sm:w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[1001]">
                <div className="p-3 border-b border-gray-50 sticky top-0 bg-white z-10">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Tìm tỉnh thành..." 
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-xl text-xs outline-none"
                      value={provinceSearch}
                      onChange={(e) => setProvinceSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto custom-scrollbar p-1">
                  <button 
                    onClick={() => handleProvinceSelect("Tất cả khu vực")}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold rounded-xl transition-colors ${selectedProvince === "Tất cả khu vực" ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Tất cả khu vực
                    {selectedProvince === "Tất cả khu vực" && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div className="h-px bg-gray-50 my-1 mx-2" />
                  {filteredProvinces.map(p => (
                    <button 
                      key={p}
                      onClick={() => handleProvinceSelect(p)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold rounded-xl transition-colors ${selectedProvince === p ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {p}
                      {selectedProvince === p && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-gray-200 shrink-0" />

          {/* Search Input */}
          <div className="flex-1 flex items-center gap-1.5 md:gap-2 px-0.5 md:px-1">
            <Search className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="bg-transparent border-none outline-none text-[11px] text-gray-900 w-full font-medium placeholder:text-gray-400"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isHome) {
                  router.push(`/?search=${encodeURIComponent(search)}`);
                }
              }}
            />
          </div>

          <div className="w-px h-5 bg-gray-200 shrink-0" />

          {/* Filter Trigger */}
          <button 
            onClick={() => onOpenFilter?.()}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 bg-white hover:bg-gray-100 rounded-xl transition-all border border-gray-100 shadow-sm active:scale-95 shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-[10px] font-black text-gray-800 uppercase tracking-tighter hidden md:block">Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Right: User Menu & Post */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0 min-w-fit md:min-w-[140px] justify-end">
        <Link 
          href="/post" 
          className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/30 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xl:block">Đăng tin</span>
        </Link>

        {session ? (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 transition-all text-orange-600 shadow-sm"
            >
              <User className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[1001]">
                <div className="px-4 py-3 border-b border-gray-50 mb-2">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Xin chào,</p>
                  <p className="text-xs font-black text-gray-900 line-clamp-1">{session.user?.name}</p>
                </div>
                <Link href="/manage" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-xs font-bold text-gray-600">
                  <LayoutDashboard className="w-4 h-4" />
                  Quản lý tin đăng
                </Link>
                <div className="h-px bg-gray-50 my-2 mx-2" />
                <button 
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 rounded-xl transition-colors text-xs font-bold text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => signIn()}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center hover:bg-orange-100 transition-all text-orange-600 shadow-sm"
          >
            <User className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
