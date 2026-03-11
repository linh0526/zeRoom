"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] w-[90%] max-w-4xl bg-white rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{room.title}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 text-gray-500 hover:text-blue-600 rounded-full transition-colors shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 group bg-gray-100">
         <img src={images[currentIdx]} alt={room.title} className="w-full h-full object-contain" />
         
         {images.length > 1 && (
           <>
             <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
               <ChevronLeft className="w-6 h-6" />
             </button>
             <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
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
               className={`relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${currentIdx === idx ? 'ring-2 ring-blue-600 ring-offset-2 opacity-100' : 'opacity-40 hover:opacity-100'}`}
             >
                <img src={img} alt="" className="w-full h-full object-cover" />
             </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-col">
          <p className="text-xl font-black text-blue-600">
            {room.price >= 1000000 ? `${(room.price / 1000000).toLocaleString("vi-VN")} Tr₫` : `${room.price.toLocaleString("vi-VN")}đ`}
          </p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Giá thuê / tháng</p>
        </div>
        
        <a 
          href={`/room/${room._id}`}
          className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center gap-2 group"
        >
          Xem chi tiết
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
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
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (Array.isArray(data)) {
        setAllRooms(data);
        setRooms(data);
      }
    } catch (error) {
      console.error("Lỗi fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...allRooms];
    
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((room) => room.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((room) => room.price <= filters.maxPrice);
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
