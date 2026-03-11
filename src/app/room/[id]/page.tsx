import Header from "@/components/Header";
import ImageGallery from "@/components/ImageGallery";
import { 
  Calendar, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Home as HomeIcon, 
  Bed, 
  Maximize2
} from "lucide-react";
import { notFound } from "next/navigation";
import MiniMapClient from "@/components/MiniMapClient";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import mongoose from "mongoose";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await dbConnect();
  const room = await Post.findById(id).lean();

  if (!room) {
    notFound();
  }

  // Format date
  const readyDate = room.availableDate 
    ? new Date(room.availableDate).toLocaleDateString("vi-VN") 
    : "Đang cập nhật";

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        
        {/* Main Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {/* Title Header */}
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
                {room.title}
              </h1>
              <p className="flex items-center gap-1.5 text-gray-500 text-sm">
                <MapPin className="w-4 h-4 text-blue-500" />
                {room.address}
              </p>
            </div>
            
            <div className="md:text-right">
              <div className="text-2xl font-bold text-blue-600">
                {room.price.toLocaleString("vi-VN")}
              </div>
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-0.5">VNĐ / THÁNG</div>
            </div>
          </div>

          {/* Gallery & Map Section */}
          <div className="mb-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <ImageGallery images={room.images || []} title={room.title} />
            </div>
            
            <div className="lg:col-span-1 border border-gray-100 rounded-3xl shadow-sm relative overflow-hidden min-h-[300px]">
              <MiniMapClient 
                lat={room.location?.lat ?? 10.762622} 
                lng={room.location?.lng ?? 106.660172} 
                address={room.address} 
              />
            </div>
          </div>

          {/* Quick Info Grid */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl mb-8">
                <div className="flex flex-col items-center gap-1 border-r border-gray-200">
                  <Maximize2 className="w-5 h-5 text-gray-400" />
                  <span className="text-xs font-bold text-gray-800">{room.areaSize || 0} m²</span>
                  <span className="text-[10px] text-gray-400 uppercase">Diện tích</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-r border-gray-200">
                  <Bed className="w-5 h-5 text-gray-400" />
                  <span className="text-xs font-bold text-gray-800">{room.bedrooms || 1} PN</span>
                  <span className="text-[10px] text-gray-400 uppercase">Phòng ngủ</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <HomeIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-xs font-bold text-gray-800">{room.category || "Thuê trọ"}</span>
                  <span className="text-[10px] text-gray-400 uppercase">Loại hình</span>
                </div>
              </div>

              {/* Ready Date & Phone */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-3 px-5 py-3 bg-green-50 rounded-2xl border border-green-100/50">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-[10px] text-green-600 font-semibold uppercase tracking-tight">Ngày sẵn sàng</p>
                    <p className="text-sm font-bold text-green-800">{readyDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-blue-50 rounded-2xl border border-blue-100/50 flex-1">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-tight">Số điện thoại</p>
                    <p className="text-sm font-bold text-blue-800">{room.phone}</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  Tiện ghi & Đặc điểm nổi bật
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  {room.amenities && room.amenities.length > 0 ? (
                    room.amenities.map((item: string) => (
                      <div key={item} className="flex items-center gap-3 group">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">Không có thông tin tiện nghi</p>
                  )}
                </div>
              </div>

              {/* Rejection Note (If any, for internal or user awareness) */}
              {room.status === "rejected" && (
                <div className="mt-10 pt-8 border-t border-red-100">
                  <h2 className="text-xl font-bold text-red-600 mb-4">Lý do từ chối</h2>
                  <p className="text-red-600 leading-relaxed text-sm p-4 bg-red-50 rounded-2xl italic">
                    "{room.rejectionReason}"
                  </p>
                </div>
              )}
        </div>
      </div>
    </main>
  );
}
