"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, redirect } from "next/navigation";
import Header from "@/components/Header";
import { 
  Upload, 
  MapPin, 
  Calendar, 
  Phone, 
  CheckCircle,
  ChevronRight,
  Info,
  X,
  ScrollText,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import NextImage from "next/image";

// Import Map components dynamically
const MapPicker = dynamic(() => import("./components/MapPicker"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">Đang tải bản đồ...</div>
});

export default function PostRentalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Đang tải...</div>}>
      <PostRentalContent />
    </Suspense>
  );
}

function PostRentalContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    title: "",
    category: "Thuê trọ",
    address: "",
    displayAddress: "",
    areaInfo: "",
    selectedDistrict: "",
    price: "",
    areaSize: "",
    availableDate: today,
    phone: "",
    lat: 10.762622,
    lng: 106.660172,
    searchCounter: 0,
    locationSelected: false,
    bedrooms: "1",
    images: [] as string[],
    amenities: [] as string[],
    note: ""
  });

  const AMENITIES = [
    { label: "Wifi / Internet"},
    { label: "Máy lạnh"},
    { label: "Máy giặt"},
    { label: "Tủ lạnh"},
    { label: "Giờ giấc tự do"},
    { label: "Không chung chủ"},
    { label: "Chỗ để xe"},
    { label: "An ninh / Camera"},
    { label: "Đầy đủ nội thất"},
    { label: "Có thang máy"},
    { label: "Có ban công"},
    { label: "Gần chợ/siêu thị"},
  ];

  const toggleAmenity = (label: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(label)
        ? prev.amenities.filter(a => a !== label)
        : [...prev.amenities, label]
    }));
  };

  const DANANG_DISTRICTS = [
    "Liên Chiểu",
    "Thanh Khê",
    "Hải Châu",
    "Sơn Trà",
    "Ngũ Hành Sơn",
    "Cẩm Lệ",
    "Hòa Vang"
  ];

  const { data: session, status } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin?callbackUrl=/post");
    }
  }, [status]);

  useEffect(() => {
    if (editId) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/posts/${editId}`);
          if (res.ok) {
            const post = await res.json();
            setFormData(prev => ({
              ...prev,
              title: post.title || "",
              category: post.category || "Thuê trọ",
              address: post.address || "",
              displayAddress: post.displayAddress || "",
              areaInfo: post.areaInfo || "",
              price: post.price?.toString() || "",
              areaSize: post.areaSize?.toString() || "",
              phone: post.phone || "",
              lat: post.location?.lat || 10.762622,
              lng: post.location?.lng || 106.660172,
              bedrooms: post.bedrooms?.toString() || "1",
              images: post.images || [],
              amenities: post.amenities || [],
              note: post.note || "",
              availableDate: post.availableDate ? new Date(post.availableDate).toISOString().split('T')[0] : "2026-03-12",
              searchCounter: 1
            }));
          }
        } catch (error) {
          console.error("Fetch post error:", error);
        }
      };
      fetchPost();
    }
  }, [editId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }


  const handleSubmit = async () => {
    if (!formData.locationSelected) {
      toast.error("Vui lòng chọn vị trí trên bản đồ bằng cách nhấp vào bản đồ hoặc tìm kiếm địa chỉ");
      return;
    }

    if (!formData.displayAddress || !formData.selectedDistrict || !formData.price || !formData.phone) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Vui lòng thêm ít nhất một hình ảnh cho bài đăng");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editId ? `/api/posts/${editId}` : "/api/posts";
      const method = editId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editId ? "Cập nhật bài đăng thành công!" : "Đăng bài thành công! Tin của bạn đang chờ quản trị viên phê duyệt.");
        setTimeout(() => {
          window.location.href = editId ? "/manage" : "/"; 
        }, 1500);
      } else {
        const error = await response.json();
        toast.error(`Lỗi: ${error.error || "Không thể xử lý bài đăng"}`);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // toggleAmenity removed


  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const max_size = 1200; // Max dimension

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7)); // Compress to 70% quality JPEG
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const uploadToast = toast.loading("Đang tải ảnh lên...");

    try {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} quá lớn (tối đa 10MB)`);
          continue;
        }
        
        try {
          // 1. Resize/Compress image
          const compressedImage = await resizeImage(file);
          
          // 2. Upload to Cloudinary via our API
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: compressedImage }),
          });

          if (response.ok) {
            const data = await response.json();
            setFormData(prev => ({ 
              ...prev, 
              images: [...prev.images, data.url] 
            }));
          } else {
            toast.error(`Không thể tải ảnh ${file.name} lên`);
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast.error(`Lỗi khi xử lý ảnh ${file.name}`);
        }
      }
      toast.success("Tải ảnh hoàn tất", { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };


  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    const parts = address.split(",").map(p => p.trim());
    const mainAddress = parts[0] || "";
    
    // Lọc bỏ mã bưu chính (chỉ chứa số) và "Việt Nam"
    const filteredAreaParts = parts.slice(1).filter(part => {
      const isPostcode = /^\d+$/.test(part);
      const isCountry = part.toLowerCase() === "việt nam" || part.toLowerCase() === "vietnam";
      return !isPostcode && !isCountry;
    });

    const area = filteredAreaParts.join(", ");
    // Tạo địa chỉ sạch: Địa chỉ chính + khu vực đã lọc
    const cleanAddress = mainAddress + (area ? ", " + area : "");
    
    // Tìm quận huyện và tỉnh thành từ kết quả tìm kiếm
    // Lấy 2 phần cuối của địa chỉ đã lọc làm Khu vực (Ví dụ: "Phường Đạo Thạnh - Tỉnh Đồng Tháp")
    let detectedDistrict = "";
    if (filteredAreaParts.length >= 2) {
      detectedDistrict = filteredAreaParts.slice(-2).join(" - ");
    } else if (filteredAreaParts.length === 1) {
      detectedDistrict = filteredAreaParts[0];
    }

    // Nếu vẫn không tìm thấy, thử tìm trong danh sách mặc định của Đà Nẵng
    if (!detectedDistrict) {
      const matchedDanang = DANANG_DISTRICTS.find(d => 
        address.toLowerCase().includes(d.toLowerCase())
      );
      if (matchedDanang) detectedDistrict = matchedDanang;
    }

    setFormData(prev => {
      const newDistrict = detectedDistrict || prev.selectedDistrict;
      return {
        ...prev,
        lat,
        lng,
        address: cleanAddress,
        displayAddress: mainAddress || prev.displayAddress,
        areaInfo: area || prev.areaInfo,
        selectedDistrict: newDistrict,
        // Tự động gán tiêu đề: [Địa chỉ] - [Khu vực]
        title: mainAddress ? (newDistrict ? `${mainAddress} - ${newDistrict}` : mainAddress) : prev.title,
        searchCounter: prev.searchCounter + 1,
        locationSelected: true
      };
    });
  };

  return (
    <main className="min-h-screen bg-white flex flex-col pb-32 font-sans selection:bg-orange-100">
      <Header />
      
      <div className="max-w-[1240px] mx-auto w-full pt-10 px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-gray-50 pb-4 inline-block tracking-tight text-transform: uppercase">
          {editId ? "CHỈNH SỬA TIN ĐĂNG" : "ĐĂNG TIN CHO THUÊ"}
        </h1>

        <div className="space-y-12">
          {/* Main Form Content */}
          <div className="space-y-12">
            
            {/* 1. Hình ảnh */}
            <section className="space-y-3">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-1">
                <span className="text-red-500">*</span> Hình ảnh 
              </label>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple 
                accept="image/*"
                className="hidden"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 shadow-sm">
                    <NextImage src={img} alt={`Preview ${idx + 1}`} fill sizes="200px" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(idx)}
                      type="button"
                      aria-label={`Xóa ảnh ${idx + 1}`}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <button 
                  type="button"
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  aria-label="Tải ảnh lên từ thiết bị"
                  className={`aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-orange-300 transition-all cursor-pointer group shadow-sm ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                >
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  ) : (
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-orange-500 mb-2" />
                  )}
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
                    {isUploading ? "Đang tải..." : "Thêm ảnh"}
                  </span>
                </button>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Tối đa 10MB mỗi file. Khuyên dùng ít nhất 3 ảnh thật của phòng.</p>

            </section>

            {/* 2. Địa chỉ & Bản đồ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="addressSearch" className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">
                      <span className="text-red-500">*</span> Chọn vị trí trên bản đồ (bắt buộc)
                    </label>
                    {formData.selectedDistrict && (
                      <div className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-black border border-green-100 flex items-center gap-1 animate-in fade-in zoom-in duration-300">
                        <CheckCircle className="w-3 h-3" />
                        KHU VỰC: {formData.selectedDistrict.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="addressSearch"
                      readOnly
                      placeholder="Nhấp vào bản đồ bên phải để chọn vị trí..."
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 outline-none cursor-not-allowed shadow-sm italic font-medium"
                      value={formData.address}
                    />
                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-orange-500" />
                  </div>
                </section>

                <section className="space-y-2">
                  <label htmlFor="displayAddress" className="text-[13px] font-bold text-gray-800">
                    <span className="text-red-500">*</span> Địa chỉ hiển thị (Số nhà, tên đường)
                  </label>
                  <input 
                    type="text" 
                    id="displayAddress"
                    placeholder="Ví dụ: Nguyễn Thị Thập p10"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-orange-500 transition-all shadow-sm font-medium"
                    value={formData.displayAddress}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData, 
                        displayAddress: val,
                        title: formData.selectedDistrict ? `${val} - ${formData.selectedDistrict}` : val
                      });
                    }}
                  />
                </section>
                <p className="text-[11px] text-orange-600 font-bold cursor-pointer hover:underline flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  (Địa chỉ hiển thị và Quận/Huyện sẽ được dùng để tạo tiêu đề tin đăng)
                </p>

                <section className="space-y-2">
                   <label htmlFor="postTitle" className="text-[13px] font-bold text-gray-800">
                    <span className="text-red-500">*</span> Tên hiển thị (Tiêu đề bài viết)
                  </label>
                  <input 
                    type="text" 
                    id="postTitle"
                    placeholder="Ví dụ: 126 Hàm Nghi - Thạc Gián"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 outline-none focus:border-orange-500 transition-all shadow-sm font-semibold italic"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                  <p className="text-[11px] text-orange-400 italic font-bold">(Tiêu đề này được tạo tự động để thống nhất, bạn vẫn có thể chỉnh sửa nếu cần)</p>
                </section>

                <section className="space-y-4">
                   <label className="text-[13px] font-bold text-gray-800">
                    <span className="text-red-500">*</span> Loại hình
                  </label>
                  <div className="flex flex-wrap items-center gap-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          id="category_rental" 
                          name="type" 
                          checked={formData.category === "Thuê trọ"} 
                          onChange={() => setFormData({...formData, category: "Thuê trọ"})}
                          className="peer appearance-none w-6 h-6 border-2 border-gray-200 rounded-full checked:border-orange-600 checked:border-[6px] transition-all" 
                        />
                      </div>
                      <span className="text-[13px] font-bold text-gray-600 peer-checked:text-orange-600 transition-colors">Phòng trọ</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          id="category_house" 
                          name="type" 
                          checked={formData.category === "Nhà nguyên căn"} 
                          onChange={() => setFormData({...formData, category: "Nhà nguyên căn"})}
                          className="peer appearance-none w-6 h-6 border-2 border-gray-200 rounded-full checked:border-orange-600 checked:border-[6px] transition-all" 
                        />
                      </div>
                      <span className="text-[13px] font-bold text-gray-600 peer-checked:text-orange-600 transition-colors">Nhà nguyên căn</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          id="category_apartment" 
                          name="type" 
                          checked={formData.category === "Căn hộ / Dịch vụ"} 
                          onChange={() => setFormData({...formData, category: "Căn hộ / Dịch vụ"})}
                          className="peer appearance-none w-6 h-6 border-2 border-gray-200 rounded-full checked:border-orange-600 checked:border-[6px] transition-all" 
                        />
                      </div>
                      <span className="text-[13px] font-bold text-gray-600 peer-checked:text-orange-600 transition-colors">Căn hộ</span>
                    </label>
                  </div>
                </section>
              </div>

              {/* Map Picker */}
              <div className="space-y-2 h-full">
                <div className="h-[460px] rounded-3xl overflow-hidden border border-gray-200 shadow-2xl relative ring-8 ring-gray-50/50">
                  <MapPicker 
                    onLocationSelect={(lat, lng, addr) => handleLocationSelect(lat, lng, addr)} 
                    lat={formData.lat} 
                    lng={formData.lng} 
                    searchCounter={formData.searchCounter}
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-[10px] font-semibold flex items-center gap-2 pointer-events-none whitespace-nowrap">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    Nhấp vào bản đồ để chọn vị trí chính xác
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Tiện nghi / Đặc điểm */}
            <section className="space-y-6 pt-4 border-t border-gray-50 mt-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Tiện ích</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {AMENITIES.map((item) => {
                  const isSelected = formData.amenities.includes(item.label);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleAmenity(item.label)}
                      className={`flex items-center gap-3 p-3 rounded-2xl text-[12px] font-bold border transition-all ${
                        isSelected
                          ? "bg-orange-50 border-orange-100 text-orange-600 shadow-sm"
                          : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                      }`}
                    >
                      <div className="relative flex items-center justify-center shrink-0">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          readOnly
                          className={`appearance-none w-5 h-5 border-2 rounded-md transition-all cursor-pointer ${
                            isSelected ? "bg-orange-600 border-orange-600" : "bg-white border-gray-200"
                          }`}
                        />
                        {isSelected && <CheckCircle className="absolute w-3.5 h-3.5 text-white pointer-events-none" />}
                      </div>
                      <span className={isSelected ? "text-orange-600" : "text-gray-500"}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex items-center gap-3 shrink-0">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked
                      readOnly
                      className="peer appearance-none w-5 h-5 border-2 border-orange-600 bg-orange-600 rounded-md transition-all cursor-default"
                    />
                    <CheckCircle className="absolute w-3.5 h-3.5 text-white pointer-events-none" />
                  </div>
                  <label htmlFor="bedrooms" className="text-[13px] font-bold text-gray-800 flex items-center gap-1 uppercase">
                    <span className="text-red-500">*</span> Số phòng ngủ
                  </label>
                </div>
                
                <div className="relative max-w-[150px] w-full">
                  <input 
                    type="number" 
                    id="bedrooms"
                    min="1"
                    placeholder="1"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 font-bold outline-none focus:border-orange-500 transition-all shadow-sm"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                  />
                  <span className="absolute right-4 top-2 text-[11px] text-gray-400 font-bold">PN</span>
                </div>
              </div>
            </section>

            {/* Price & Details Cluster */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
              <section className="space-y-2">
                <label htmlFor="price" className="text-[13px] font-bold text-gray-800">
                  <span className="text-red-500">*</span> Giá thuê (VNĐ)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    id="price"
                    placeholder="Nhập giá..."
                    className="w-full pl-4 pr-14 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 font-bold outline-none focus:border-orange-500 transition-all shadow-sm"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                  <span className="absolute right-4 top-3.5 text-[11px] text-gray-400 font-bold uppercase tracking-tighter">/tháng</span>
                </div>
                {formData.price && (
                  <p className="text-[11px] text-orange-600 font-bold mt-1 pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    Số tiền: {Number(formData.price).toLocaleString("vi-VN")} VNĐ/ tháng
                  </p>
                )}
              </section>
              <section className="space-y-2">
                <label htmlFor="areaSize" className="text-[13px] font-bold text-gray-800">Diện tích (m²)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    id="areaSize"
                    placeholder="Ví dụ: 25"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 font-bold outline-none focus:border-orange-500 transition-all shadow-sm"
                    value={formData.areaSize}
                    onChange={(e) => setFormData({...formData, areaSize: e.target.value})}
                  />
                  <span className="absolute right-4 top-3.5 text-[11px] text-gray-400 font-bold">m²</span>
                </div>
              </section>
              <section className="space-y-2">
                <label htmlFor="availableDate" className="text-[13px] font-bold text-gray-800">
                   <span className="text-red-500">*</span> Ngày sẵn sàng
                </label>
                <div className="relative">
                  <input 
                    type="date" 
                    id="availableDate"
                    value={formData.availableDate}
                    className="w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 font-bold outline-none focus:border-orange-500 transition-all shadow-sm appearance-none"
                    onChange={(e) => setFormData({...formData, availableDate: e.target.value})}
                  />
                  <Calendar className="absolute right-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </section>
              <section className="space-y-2">
                <label htmlFor="phone" className="text-[13px] font-bold text-gray-800">
                  <span className="text-red-500">*</span> Số điện thoại
                </label>
                <div className="relative">
                  <input 
                    type="tel" 
                    id="phone"
                    placeholder="0353..."
                    className="w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 font-bold outline-none focus:border-orange-500 transition-all shadow-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <Phone className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </section>
            </div>
            
            <section className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="note" className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-orange-600 rounded-full"></div>
                  Ghi chú khác
                </label>
                <button 
                  type="button"
                  onClick={() => {
                    const template = `- Giá điện: \n- Giá nước: \n- Phí dịch vụ: \n- Tiền cọc: \n- Thời hạn thuê tối thiểu: \n- Giờ giấc: \n- Nội quy: `;
                    setFormData({...formData, note: template});
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-100 transition-all border border-orange-100"
                >
                  <ScrollText className="w-4 h-4" />
                  Sử dụng mẫu
                </button>
              </div>
              <textarea 
                id="note"
                placeholder="Nhập các thông tin về giá điện, nước, phí dịch vụ (quản lý, vệ sinh), điều khoản hợp đồng (tiền cọc, chính sách hoàn cọc), thời hạn thuê tối thiểu, giờ giấc sinh hoạt (giờ đóng/mở cửa), quy định sử dụng (nuôi thú cưng, nấu ăn, tổ chức tiệc) và các lưu ý quan trọng khác."
                className="w-full p-6 bg-white border border-gray-200 rounded-3xl text-sm text-gray-900 outline-none focus:border-orange-500 transition-all shadow-sm min-h-[150px] leading-relaxed"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
              />
            </section>

            {/* Bottom Action Section */}
            <div className="mt-16 bg-gray-50 border border-gray-100 rounded-[40px] p-10 shadow-inner">
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <CheckCircle className="w-7 h-7 text-green-500" />
                      Đăng bài
                    </h3>
                    <div className="flex flex-col gap-1 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-[13px] font-bold text-gray-600 mb-1">Chọn thời gian đăng:</p>
                      <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                        <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                        Đăng tin miễn phí
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-white/50">
                    <Info className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                    <p className="text-sm font-medium text-gray-500 leading-relaxed">
                      Tin của bạn sẽ được duyệt trong vòng sớm thôi. Vui lòng đảm bảo thông tin liên hệ là chính xác để người thuê có thể kết nối ngay lập tức.
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full md:px-16 py-5 bg-gray-900 text-white rounded-[24px] font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-gray-200 flex items-center justify-center gap-3 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black hover:shadow-2xl hover:shadow-gray-300'}`}
                  >
                    {isSubmitting ? 'Đang xử lý...' : (editId ? 'Xác nhận chỉnh sửa' : 'Xác nhận đăng bài')}
                    {!isSubmitting && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </div>
            </div>
                  
          </div>
        </div>
      </div>
    </main>
  );
}
