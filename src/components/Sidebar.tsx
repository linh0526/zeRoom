"use client";

import { Search, SlidersHorizontal, MapPin, Home, Wifi, Wind, ShieldCheck, Car, X, ChevronLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Room {
  id: number;
  title: string;
  price: number;
  address: string;
  images: string[];
  type?: string;
  bedrooms?: number;
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

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  return (
    <div className="w-[448px] h-full bg-white border-r border-gray-100 flex flex-col shadow-xl z-20">
      <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        
        {!selectedRoom ? (
          <>
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Bạn muốn đến đâu?" 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  Ngân sách của bạn
                </h3>
                <span className="text-xs text-blue-600 font-medium">
                  Dưới {maxPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="15000000" 
                step="500000"
                value={maxPrice}
                onChange={(e) => {
                  handlePriceChange(minPrice, Number(e.target.value));
                }}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 mb-1 ml-1">Từ</p>
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
                <div className="flex-shrink-0 mt-4 text-gray-300">—</div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 mb-1 ml-1">Đến</p>
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
              <img src={selectedRoom.images[0]} alt={selectedRoom.title} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedRoom.title}</h2>
            <p className="flex items-start gap-1.5 text-xs text-gray-500 leading-relaxed">
              <MapPin className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
              <span>{selectedRoom.address}</span>
            </p>
            <div className="text-2xl font-bold text-blue-600 mt-2 hover:text-blue-700 transition-colors select-none">
              {(selectedRoom.price / 1000000).toLocaleString("vi-VN")} Tr₫
            </div>
            <a 
              href={`/room/${selectedRoom.id}`} 
              className="block w-full text-center py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-[0.98]"
            >
              Xem chi tiết
            </a>
            
            <h3 className="font-bold text-gray-800 border-t border-gray-100 pt-5 mt-5 uppercase text-xs tracking-wider">Đặc điểm thuê trọ</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs bg-gray-50 p-4 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Sẵn sàng:</span>
                <span className="font-bold text-gray-800">{selectedRoom.readyDate || "07/03/2026"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Loại hình:</span>
                <span className="font-bold text-gray-800">{selectedRoom.type || "Phòng trọ"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Số phòng ngủ:</span>
                <span className="font-bold text-gray-800">{selectedRoom.bedrooms || 1} PN</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl mt-4 border border-blue-100/50">
              <span className="text-blue-600 text-xs font-semibold uppercase block mb-1">Liên hệ</span>
              <span className="font-bold text-blue-800 text-lg tracking-wide">{selectedRoom.phone || "0353044770"}</span>
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
                  <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 relative shadow-sm">
                    <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2340&auto=format&fit=crop'} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600">{room.title}</h4>
                      <p className="text-[10px] text-gray-400 line-clamp-1 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 shrink-0 text-blue-500/70" />
                        {room.address?.split(",")[0] || "Chưa rõ địa chỉ"}
                      </p>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="flex flex-col">
                        <p className="text-sm font-black text-blue-600">
                          {room.price >= 1000000 ? `${(room.price / 1000000).toLocaleString("vi-VN")} Tr₫` : `${room.price.toLocaleString("vi-VN")}đ`}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium italic">
                          {new Date(room.createdAt).toLocaleDateString("vi-VN")}
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
