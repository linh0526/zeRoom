"use client";

import { X, SlidersHorizontal, Home } from "lucide-react";
import { useState, useEffect } from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters: any;
}

export default function FilterModal({ isOpen, onClose, onApply, initialFilters }: FilterModalProps) {
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters = {
      minPrice: 0,
      maxPrice: 15000000,
      minArea: 0,
      category: "all",
      sortBy: "newest",
      bedrooms: "all",
    };
    setFilters(defaultFilters);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-xl max-h-[90vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <SlidersHorizontal className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 tracking-tight">Bộ lọc</h2>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Tùy chỉnh tìm kiếm</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 gap-6">
            
            {/* Row 1: Category */}
            <div className="space-y-2.5">
              <h3 className="text-[9px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                <Home className="w-3 h-3" /> Loại hình
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "Tất cả" },
                  { id: "Thuê trọ", label: "Phòng trọ" },
                  { id: "Căn hộ / Dịch vụ", label: "Căn hộ" },
                  { id: "Nhà nguyên căn", label: "Nhà nguyên căn" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFilters({ ...filters, category: item.id })}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${filters.category === item.id ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Bedrooms */}
            <div className="space-y-2.5">
              <h3 className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Số phòng ngủ</h3>
              <div className="flex gap-1.5">
                {["all", "1", "2", "3", "4+"].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFilters({ ...filters, bedrooms: num })}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all border ${filters.bedrooms === num ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-200'}`}
                  >
                    {num === "all" ? "Tất cả" : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Price Range */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Ngân sách (VNĐ)</h3>
                <span className="text-[10px] text-orange-600 font-black">
                  {filters.maxPrice.toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="space-y-3">
                <input 
                    type="range" 
                    min="0" 
                    max="15000000" 
                    step="500000"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number" 
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                      placeholder="Từ"
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none focus:border-orange-500 font-mono"
                    />
                    <input 
                      type="number" 
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                      placeholder="Đến"
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
              </div>
            </div>

            {/* Row 4: Area Range */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Diện tích m²</h3>
                <span className="text-[10px] text-orange-600 font-bold">
                  Từ {filters.minArea} m²
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={filters.minArea}
                onChange={(e) => setFilters({ ...filters, minArea: Number(e.target.value) })}
                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>

            {/* Row 5: Sort */}
            <div className="space-y-2.5">
              <h3 className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Sắp xếp</h3>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "newest", label: "Mới nhất" },
                  { id: "price-asc", label: "Giá tăng" },
                  { id: "price-desc", label: "Giá giảm" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFilters({ ...filters, sortBy: item.id })}
                    className={`py-1.5 px-3 rounded-lg text-[9px] font-bold transition-all border ${filters.sortBy === item.id ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex gap-3 shrink-0">
          <button 
            onClick={handleReset}
            className="px-4 py-2.5 bg-white border border-gray-100 text-gray-500 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
          >
            Đặt lại
          </button>
          <button 
            onClick={handleApply}
            className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/10 active:scale-95"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
