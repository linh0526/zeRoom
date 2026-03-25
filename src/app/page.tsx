"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getRelativeTime } from "@/lib/formatDate";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse text-sm">Đang tải bản đồ...</p>
      </div>
    </div>
  ),
});

function MapRoomOverlay({ room, onClose }: { room: any; onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!room) return null;

  const images = room.images || [];
  const nextImg = () => setCurrentIdx(p => (p + 1) % images.length);
  const prevImg = () => setCurrentIdx(p => (p - 1 + images.length) % images.length);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] w-[90%] max-w-2xl bg-white rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{room.title}</h3>
        <button onClick={onClose} aria-label="Đóng bảng xem trước" className="p-1 hover:bg-gray-100 text-gray-500 hover:text-orange-600 rounded-full transition-colors shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 group bg-gray-100">
        {images[currentIdx] && (
          <Image 
            src={images[currentIdx]} 
            alt={room.title} 
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 700px, 800px"
            className="object-contain" 
            unoptimized={images[currentIdx]?.includes("scontent")}
          />
        )}
        {!images[currentIdx] && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-200"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Không có ảnh</p>
          </div>
        )}
         
        {images.length > 1 && (
          <>
            <button onClick={prevImg} aria-label="Ảnh trước đó" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextImg} aria-label="Ảnh kế tiếp" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
          {images.map((img: string, idx: number) => (
             <button 
               key={idx} 
               onClick={() => setCurrentIdx(idx)}
               aria-label={`Xem ảnh thứ ${idx + 1}`}
               className={`relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${currentIdx === idx ? 'ring-2 ring-orange-600 ring-offset-2 opacity-100' : 'opacity-40 hover:opacity-100'}`}
             >
                {img && (
                  <Image 
                    src={img} 
                    alt={`Ảnh thứ ${idx + 1} của ${room.title}`} 
                    fill 
                    sizes="112px" 
                    className="object-cover" 
                    unoptimized={img?.includes("scontent")}
                  />
                )}
             </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-col">
          <p className="text-xl font-black text-orange-600">
            {room.price >= 1000000 ? `${(room.price / 1000000).toLocaleString("vi-VN")} Tr₫` : `${room.price.toLocaleString("vi-VN")}đ`}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Giá thuê / tháng</p>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <p className="text-[10px] text-gray-400 font-bold italic">{getRelativeTime(room.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [allRooms, setAllRooms] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch ALL rooms without images (for the map - fast)
      const allRes = await fetch("/api/posts?includeImages=false");
      const allData = await allRes.json();
      
      if (Array.isArray(allData)) {
        setAllRooms(allData);
        setRooms(allData);
        
        // 2. Fetch latest 50 rooms WITH images (for the sidebar - manageable)
        const recentRes = await fetch("/api/posts?includeImages=true&limit=50");
        const recentData = await recentRes.json();
        
        if (Array.isArray(recentData)) {
          // Create a map of rooms with images
          const imageMap = new Map(recentData.map(r => [r._id, r.images]));
          
          // Update the state with images where available
          setAllRooms(prev => prev.map(room => ({
            ...room,
            images: imageMap.get(room._id) || room.images
          })));
          
          setRooms(prev => prev.map(room => ({
            ...room,
            images: imageMap.get(room._id) || room.images
          })));
        }
      }
    } catch (error) {
      console.error("Lỗi fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...allRooms];
    
    // Lọc theo tìm kiếm
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(s) || 
        r.address.toLowerCase().includes(s)
      );
    }

    // Lọc theo loại hình
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(r => r.category === filters.category);
    }

    // Lọc theo giá
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((room) => room.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((room) => room.price <= filters.maxPrice);
    }

    // Lọc theo diện tích
    if (filters.minArea !== undefined) {
      filtered = filtered.filter(r => (r.areaSize || 0) >= filters.minArea);
    }

    // Lọc theo số phòng ngủ
    if (filters.bedrooms && filters.bedrooms !== "all") {
      const bedroomsNum = filters.bedrooms.includes("+") 
        ? parseInt(filters.bedrooms) 
        : parseInt(filters.bedrooms);
      
      if (filters.bedrooms.includes("+")) {
        filtered = filtered.filter(r => (r.bedrooms || 0) >= bedroomsNum);
      } else {
        filtered = filtered.filter(r => (r.bedrooms || 0) === bedroomsNum);
      }
    }

    // Sắp xếp
    if (filters.sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }
    
    setRooms(filtered);
  };

  return (
    <main className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          rooms={rooms} 
          onFilterChange={handleFilterChange} 
          selectedRoom={selectedRoom}
          onRoomSelect={setSelectedRoom}
          loading={loading}
        />
        
        <section className="flex-1 relative">
          <MapComponent rooms={rooms} selectedRoom={selectedRoom} onRoomSelect={setSelectedRoom} />
          
          {selectedRoom && (
            <MapRoomOverlay room={selectedRoom} onClose={() => setSelectedRoom(null)} />
          )}
        </section>
      </div>
    </main>
  );
}
