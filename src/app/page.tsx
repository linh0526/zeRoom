"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";
const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });
import RoomCard from "@/components/RoomCard";

import FilterModal from "@/components/FilterModal";

const PROVINCE_COORDINATES: Record<string, [number, number]> = {
  "Hồ Chí Minh": [10.762622, 106.660172],
  "Hà Nội": [21.028511, 105.804817],
  "Đà Nẵng": [16.0544, 108.2022],
  "Bình Dương": [10.9804, 106.6519],
  "Đồng Nai": [10.9416, 106.8273],
  "Bà Rịa - Vũng Tàu": [10.4114, 107.1355],
  "Cần Thơ": [10.0333, 105.7833],
  "Khánh Hòa": [12.2467, 109.1911],
  "Hải Phòng": [20.8449, 106.6881],
  "An Giang": [10.5181, 105.1189],
  "Bắc Giang": [21.2731, 106.1946],
  "Bắc Kạn": [22.147, 105.8347],
  "Bạc Liêu": [9.2941, 105.7242],
  "Bắc Ninh": [21.1861, 106.0763],
  "Bến Tre": [10.2422, 106.3762],
  "Bình Phước": [11.5333, 106.8842],
  "Bình Thuận": [10.9333, 108.1],
  "Bình Định": [13.782, 109.2193],
  "Cà Mau": [9.1769, 105.1524],
  "Cao Bằng": [22.6667, 106.25],
  "Gia Lai": [13.9833, 108.0],
  "Hà Giang": [22.8233, 104.9833],
  "Hà Nam": [20.5833, 105.9167],
  "Hà Tĩnh": [18.3333, 105.9],
  "Hải Dương": [20.9405, 106.333],
  "Hậu Giang": [9.784, 105.47],
  "Hòa Bình": [20.8172, 105.3375],
  "Hưng Yên": [20.6464, 106.0511],
  "Kiên Giang": [10.012, 105.0809],
  "Kon Tum": [14.35, 108.0],
  "Lai Châu": [22.3959, 103.4447],
  "Lâm Đồng": [11.9404, 108.4583],
  "Lạng Sơn": [21.85, 106.75],
  "Lào Cai": [22.4833, 103.9667],
  "Long An": [10.5333, 106.4167],
  "Nam Định": [20.4167, 106.1667],
  "Nghệ An": [18.6667, 105.6667],
  "Ninh Bình": [20.25, 105.9833],
  "Ninh Thuận": [11.5667, 108.9833],
  "Phú Thọ": [21.3214, 105.3994],
  "Phú Yên": [13.0833, 109.3],
  "Quảng Bình": [17.4833, 106.6],
  "Quảng Nam": [15.55, 108.3333],
  "Quảng Ngãi": [15.1167, 108.8],
  "Quảng Ninh": [20.95, 107.0833],
  "Quảng Trị": [16.75, 107.1667],
  "Sóc Trăng": [9.6, 105.9667],
  "Sơn La": [21.3167, 103.9],
  "Tây Ninh": [11.3, 106.1],
  "Thái Bình": [20.45, 106.3333],
  "Thái Nguyên": [21.5833, 105.8333],
  "Thanh Hóa": [19.8, 105.7667],
  "Thừa Thiên Huế": [16.4667, 107.6],
  "Tiền Giang": [10.4167, 106.3333],
  "Trà Vinh": [9.9333, 106.3333],
  "Tuyên Quang": [21.8167, 105.2167],
  "Vĩnh Long": [10.25, 105.9667],
  "Vĩnh Phúc": [21.3, 105.6],
  "Yên Bái": [21.7, 104.8667],
  "Đắk Lắk": [12.6667, 108.0333],
  "Đắk Nông": [12.0, 107.6833],
  "Điện Biên": [21.3833, 103.0167],
  "Đồng Tháp": [10.45, 105.6333]
};

export default function Home() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<any>({
    search: "",
    minPrice: 0,
    maxPrice: 15000000,
    minArea: 0,
    category: "all",
    sortBy: "newest",
    bedrooms: "all",
    province: "all"
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.762622, 106.660172]);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/posts?includeImages=true");
      if (!res.ok) throw new Error("API response was not ok");
      const data = await res.json();
      setRooms(data);
      setFilteredRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleFilterChange = (newFilters: any) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // If province changed, update map center
    if (newFilters.province && newFilters.province !== filters.province) {
      const coords = PROVINCE_COORDINATES[newFilters.province as keyof typeof PROVINCE_COORDINATES];
      if (coords) {
        setMapCenter(coords);
      }
    }

    let filtered = rooms.filter((room) => {
      const matchSearch = !updatedFilters.search || 
        room.title.toLowerCase().includes(updatedFilters.search.toLowerCase()) ||
        room.address.toLowerCase().includes(updatedFilters.search.toLowerCase());
      
      const matchCategory = updatedFilters.category === "all" || room.category === updatedFilters.category;
      
      const matchPrice = room.price >= updatedFilters.minPrice && room.price <= updatedFilters.maxPrice;
      
      const matchArea = room.area >= updatedFilters.minArea;

      const matchBedrooms = updatedFilters.bedrooms === "all" || 
        (updatedFilters.bedrooms === "4+" ? parseInt(room.itemConfig?.detail_rooms?.[0]?.value) >= 4 : room.itemConfig?.detail_rooms?.[0]?.value === updatedFilters.bedrooms);

      const matchProvince = updatedFilters.province === "all" || 
        room.address.includes(updatedFilters.province);

      return matchSearch && matchCategory && matchPrice && matchArea && matchBedrooms && matchProvince;
    });

    if (updatedFilters.sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (updatedFilters.sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredRooms(filtered);
  };

  return (
    <main className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      <Header 
        onFilterChange={handleFilterChange} 
        filters={filters} 
        onOpenFilter={() => setIsFilterModalOpen(true)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          rooms={filteredRooms}
          onFilterChange={handleFilterChange} 
          filters={filters} 
          selectedRoom={selectedRoom}
          onRoomSelect={setSelectedRoom}
        />
        <section className="flex-1 relative">
          <MapComponent 
            rooms={filteredRooms} 
            selectedRoom={selectedRoom} 
            onRoomSelect={setSelectedRoom}
            center={mapCenter}
          />
          

        </section>
      </div>

      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilterChange}
        initialFilters={filters}
      />
    </main>
  );
}
