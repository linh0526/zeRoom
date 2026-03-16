"use client";

import { Search, SlidersHorizontal, MapPin, Home, Wifi, Wind, ShieldCheck, Car, X, ChevronLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { getRelativeTime } from "@/lib/formatDate";
import { cleanAddress } from "@/lib/addressUtils";

interface Room {
  id: number;
  title: string;
  price: number;
  address: string;
  images: string[];
  type?: string;
  category?: string;
  bedrooms?: number;
  areaSize?: number;
  readyDate?: string;
  phone?: string;
}

interface SidebarProps {
  rooms: any[];
  onFilterChange: (filters: any) => void;
  selectedRoom?: any;
  onRoomSelect?: (room: any | null) => void;
  loading?: boolean;
}

export default function Sidebar({ rooms, onFilterChange, selectedRoom, onRoomSelect, loading }: SidebarProps) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(15000000);
  const [minArea, setMinArea] = useState(0);
  const [category, setCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(true);

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    onFilterChange({ minPrice: min, maxPrice: max, minArea, category });
  };

  const handleAreaChange = (val: number) => {
    setMinArea(val);
    onFilterChange({ minPrice, maxPrice, minArea: val, category });
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    onFilterChange({ minPrice, maxPrice, minArea, category: val });
  };

  return (
    <div className="w-[448px] h-full bg-white border-r border-gray-100 flex flex-col shadow-xl z-20">
      <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        
        {!selectedRoom ? (
          <>
            {/* Search and Toggle Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Bạn muốn đến đâu?" 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  onChange={(e) => onFilterChange({ minPrice, maxPrice, minArea, category, search: e.target.value })}
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl transition-all border ${showFilters ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            {showFilters && (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                {/* Category Filter */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Loại hình</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "all", label: "Tất cả" },
                      { id: "Căn hộ / Dịch vụ", label: "Căn hộ / Dịch vụ" },
                      { id: "Thuê trọ", label: "Phòng trọ" }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleCategoryChange(item.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${category === item.id ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' : 'bg-white text-gray-600 border-gray-100 hover:border-blue-200'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Ngân sách</h3>
                    <span className="text-xs text-blue-600 font-bold">
                      Dưới {maxPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="15000000" 
                    step="500000"
                    value={maxPrice}
                    onChange={(e) => handlePriceChange(minPrice, Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="relative">
                        <input 
                          type="number" 
                          value={minPrice}
                          onChange={(e) => handlePriceChange(Number(e.target.value), maxPrice)}
                          className="w-full pl-3 pr-7 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-900 outline-none focus:border-blue-500 transition-all font-bold"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-gray-400 font-bold">đ</span>
                      </div>
                    </div>
                    <div className="text-gray-300">—</div>
                    <div className="flex-1">
                      <div className="relative">
                        <input 
                          type="number" 
                          value={maxPrice}
                          onChange={(e) => handlePriceChange(minPrice, Number(e.target.value))}
                          className="w-full pl-3 pr-7 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-900 outline-none focus:border-blue-500 transition-all font-bold"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-gray-400 font-bold">đ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Area Filter */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Diện tích</h3>
                    <span className="text-xs text-blue-600 font-bold">
                      Từ {minArea} m²
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    value={minArea}
                    onChange={(e) => handleAreaChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>0 m²</span>
                    <span>100+ m²</span>
                  </div>
                </div>
              </div>
            )}


          </>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
            <button 
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              onClick={() => onRoomSelect?.(null)}
            >
              <ChevronLeft className="w-4 h-4" /> Quay lại bộ lọc
            </button>
            <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2 shadow-sm">
              <img src={selectedRoom.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2340&auto=format&fit=crop'} alt={selectedRoom.title} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedRoom.title}</h2>
            <p className="flex items-start gap-1.5 text-xs text-gray-500 leading-relaxed">
              <MapPin className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
              <span>{selectedRoom.address}</span>
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold text-blue-600 select-none">
                {(selectedRoom.price / 1000000).toLocaleString("vi-VN")} Tr₫
              </div>
              <Link 
                href={`/room/${selectedRoom._id || selectedRoom.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
              >
                Xem chi tiết
              </Link>
            </div>
            
            <h3 className="font-bold text-gray-800 border-t border-gray-100 pt-5 mt-5 uppercase text-xs tracking-wider">Đặc điểm thuê trọ</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs bg-gray-50 p-4 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Sẵn sàng:</span>
                <span className="font-bold text-gray-800">{selectedRoom.readyDate || "07/03/2026"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Loại hình:</span>
                <span className="font-bold text-gray-800">{selectedRoom.category || "Phòng trọ"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Số phòng ngủ:</span>
                <span className="font-bold text-gray-800">{selectedRoom.bedrooms || 1} PN</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl mt-4 border border-blue-100/50">
              <span className="text-blue-600 text-xs font-semibold uppercase block mb-1">Liên hệ</span>
              <span className="font-bold text-blue-800 text-lg tracking-wide">{selectedRoom.phone || "0353044770"}</span>
              <p className="text-[9px] text-blue-500/70 font-medium mt-1 italic leading-tight">"Nhắn với chủ trọ là bạn thấy tin từ zeRoom nhé! 💙"</p>
            </div>
          </div>
        )}

        {/* Room List Results */}
        <div className="pt-6 border-t border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center justify-between">
            Tin mới đăng
          </h3>
          <div className="space-y-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-2xl animate-pulse">
                  <div className="w-32 h-24 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-1/3 mt-auto" />
                  </div>
                </div>
              ))
            ) : rooms.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm font-medium">
                Không tìm thấy tin đăng nào phù hợp
              </div>
            ) : rooms.map((room) => (
              <div 
                key={room._id} 
                onClick={(e) => {
                  if (onRoomSelect) {
                    onRoomSelect(room);
                    const sidebar = document.querySelector('.custom-scrollbar');
                    if (sidebar) sidebar.scrollTop = 0;
                  }
                }}
                className={`flex flex-col gap-3 p-3 rounded-2xl transition-all border cursor-pointer ${selectedRoom?._id === room._id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50 border-gray-100 bg-white"} shadow-sm group`}
              >
                <div className="flex gap-4">
                  <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 relative shadow-sm bg-gray-100 italic">
                    {/* Shimmer Effect while image is missing */}
                    {!room.images?.[0] && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] shadow-inner" />
                    )}
                    <img 
                      src={room.images?.[0] || undefined} 
                      alt={room.title} 
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                      loading="lazy"
                      onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                      style={{ opacity: room.images?.[0] ? 0 : 1 }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
                    />
                    {!room.images?.[0] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                        <Home className="w-8 h-8 text-gray-200" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 flex-1">{room.title}</h4>
                        {room.user?.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-blue-600 fill-blue-50 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-1 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 shrink-0 text-blue-500/70" />
                        {cleanAddress(room.address).split(",")[0]}
                      </p>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="flex flex-col">
                        <p className="text-sm font-black text-blue-600">
                          {room.price >= 1000000 ? `${(room.price / 1000000).toLocaleString("vi-VN")} Tr₫` : `${room.price.toLocaleString("vi-VN")}đ`}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium italic">
                          {getRelativeTime(room.createdAt)}
                        </p>
                      </div>
                      <Link 
                        href={`/room/${room._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 text-[10px] font-bold text-blue-600 bg-white border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-sm"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Sidebar */}

    </div>
  );
}
