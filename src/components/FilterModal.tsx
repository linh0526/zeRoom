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
      <div className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Bộ lọc nâng cao</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Tùy chỉnh tìm kiếm của bạn</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left Column */}
            <div className="space-y-10">
              {/* Category */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                  <Home className="w-3 h-3" /> Loại hình thuê
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "Tất cả" },
                    { id: "Thuê trọ", label: "Phòng trọ" },
                    { id: "Căn hộ / Dịch vụ", label: "Căn hộ / Dịch vụ" },
                    { id: "Nhà nguyên căn", label: "Nhà nguyên căn" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFilters({ ...filters, category: item.id })}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border ${filters.category === item.id ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest">Ngân sách (VNĐ)</h3>
                  <span className="text-xs text-orange-600 font-black">
                    {filters.minPrice.toLocaleString("vi-VN")} — {filters.maxPrice.toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="space-y-4">
                  <input 
                      type="range" 
                      min="0" 
                      max="15000000" 
                      step="500000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Tối thiểu</label>
                        <input 
                          type="number" 
                          value={filters.minPrice}
                          onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-orange-500 transition-all font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Tối đa</label>
                        <input 
                          type="number" 
                          value={filters.maxPrice}
                          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-orange-500 transition-all font-mono"
                        />
                      </div>
                    </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-10">
              {/* Area Range */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest">Diện tích phù hợp</h3>
                  <span className="text-xs text-orange-600 font-bold">
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
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>0 m²</span>
                  <span>100+ m²</span>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest">Số phòng ngủ</h3>
                <div className="flex gap-2">
                  {["all", "1", "2", "3", "4+"].map((num) => (
                    <button
                      key={num}
                      onClick={() => setFilters({ ...filters, bedrooms: num })}
                      className={`flex-1 py-3 rounded-2xl text-[11px] font-bold transition-all border ${filters.bedrooms === num ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-200'}`}
                    >
                      {num === "all" ? "Tất cả" : num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest">Sắp xếp hiển thị</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: "newest", label: "Mới nhất" },
                    { id: "price-asc", label: "Giá thấp -> cao" },
                    { id: "price-desc", label: "Giá cao -> thấp" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFilters({ ...filters, sortBy: item.id })}
                      className={`py-3 px-4 rounded-2xl text-[10px] font-bold transition-all border ${filters.sortBy === item.id ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex gap-4">
          <button 
            onClick={handleReset}
            className="flex-1 py-4 bg-white border border-gray-100 text-gray-500 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-sm"
          >
            Thiết lập lại
          </button>
          <button 
            onClick={handleApply}
            className="flex-[2] py-4 bg-orange-500 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}
