"use client";

import SafeImage from "./SafeImage";
import { Search, SlidersHorizontal, MapPin, Home, Wifi, Wind, ShieldCheck, Car, X, ChevronLeft, Navigation, Clock, ChevronRight, Filter } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { getRelativeTime } from "@/lib/formatDate";
import FilterModal from "./FilterModal";
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
  filters: any;
}

export default function Sidebar({ rooms, onFilterChange, selectedRoom, onRoomSelect, loading, filters }: SidebarProps) {
  const handleApplyFilters = (newFilters: any) => {
    onFilterChange(newFilters);
  };

  return (
    <div className="w-[448px] h-full bg-white border-r border-gray-100 flex flex-col shadow-xl z-20">
      <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        
        {!selectedRoom ? (
          <>
            {/* Quick Chips categories */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-black text-gray-600 tracking-widest shrink-0 flex items-center gap-1">
                  Loại:
                </span>
                <button 
                  onClick={() => handleApplyFilters({ ...filters, category: filters.category === "Thuê trọ" ? "all" : "Thuê trọ" })}
                  className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest whitespace-nowrap transition-all border active:scale-95 ${filters.category === "Thuê trọ" ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
                >
                  Phòng trọ
                </button>
                <button 
                  onClick={() => handleApplyFilters({ ...filters, category: filters.category === "Nhà nguyên căn" ? "all" : "Nhà nguyên căn" })}
                  className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest whitespace-nowrap transition-all border active:scale-95 ${filters.category === "Nhà nguyên căn" ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
                >
                  Nhà nguyên căn
                </button>
                <button 
                  onClick={() => handleApplyFilters({ ...filters, category: filters.category === "Căn hộ / Dịch vụ" ? "all" : "Căn hộ / Dịch vụ" })}
                  className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest whitespace-nowrap transition-all border active:scale-95 ${filters.category === "Căn hộ / Dịch vụ" ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
                >
                  Căn hộ
                </button>
              </div>

              {/* Sorting Row */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <span className="text-[10px] font-black text-gray-600 tracking-widest shrink-0 flex items-center gap-1">
                  Sắp xếp:
                </span>
                {[
                  { id: "newest", label: "Mới nhất" },
                  { id: "price-asc", label: "Giá rẻ nhất" },
                  { id: "price-desc", label: "Cao cấp nhất" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleApplyFilters({ ...filters, sortBy: item.id })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all whitespace-nowrap border ${filters.sortBy === item.id ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
            <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2 shadow-sm">
              <SafeImage 
                src={selectedRoom.images?.[0]} 
                alt={selectedRoom.title} 
                fill 
                sizes="(max-width: 768px) 100vw, 448px" 
                className="object-cover" 
              />
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedRoom.title}</h2>
            <p className="flex items-start gap-1.5 text-xs text-gray-500 leading-relaxed">
              <MapPin className="w-4 h-4 mt-0.5 text-orange-500 shrink-0" />
              <span>{selectedRoom.address}</span>
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold text-orange-600 select-none">
                {(selectedRoom.price / 1000000).toLocaleString("vi-VN")} Tr₫
              </div>
              <Link 
                href={`/room/${selectedRoom.slug || (selectedRoom._id || selectedRoom.id)}`}
                className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-xs hover:bg-orange-700 transition-all shadow-md shadow-orange-100"
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

            <div className="bg-orange-50 p-4 rounded-2xl mt-4 border border-orange-100/50">
              <span className="text-orange-600 text-xs font-semibold uppercase block mb-1">Liên hệ</span>
              <span className="font-bold text-orange-800 text-lg tracking-wide">{selectedRoom.phone || "0353044770"}</span>
              <p className="text-[9px] text-orange-500/70 font-medium mt-1 italic leading-tight">"Nhắn với chủ trọ là bạn thấy tin từ zeRoom nhé! 🧡"</p>
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
                className={`flex flex-col gap-3 p-3 rounded-2xl transition-all border cursor-pointer ${selectedRoom?._id === room._id ? "bg-orange-50 border-orange-200" : "hover:bg-gray-50 border-gray-100 bg-white"} shadow-sm group`}
              >
                <div className="flex gap-4">
                  <Link 
                    href={`/room/${room.slug || room._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 relative shadow-sm bg-gray-100 italic cursor-pointer group-hover:shadow-md transition-shadow"
                  >
                      {/* Shimmer Effect while image is missing */}
                      {!room.images?.[0] && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] shadow-inner" />
                      )}
                      <SafeImage 
                        src={room.images?.[0]} 
                        alt={room.title} 
                        fill
                        sizes="128px"
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                  </Link>
                  <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-orange-600 flex-1">{room.title}</h4>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {room.user?.isVerified && (
                            <ShieldCheck className="w-4 h-4 text-orange-600 fill-orange-50" />
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-1 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 shrink-0 text-orange-500/70" />
                        {cleanAddress(room.address).split(",")[0]}
                      </p>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div className="flex flex-col">
                        <p className="text-sm font-black text-orange-600">
                          {room.price >= 1000000 ? `${(room.price / 1000000).toLocaleString("vi-VN")} Tr₫` : `${room.price.toLocaleString("vi-VN")}đ`}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium italic">
                          {getRelativeTime(room.createdAt)}
                        </p>
                      </div>
                      <Link 
                        href={`/room/${room.slug || room._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 text-[10px] font-bold text-orange-600 bg-white border border-orange-100 rounded-lg hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 shadow-sm"
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
