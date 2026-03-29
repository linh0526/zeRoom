import Header from "@/components/Header";
import ImageGallery from "@/components/ImageGallery";
import { 
  Calendar, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Home as HomeIcon, 
  Bed, 
  Maximize2,
  ShieldCheck
} from "lucide-react";
import { notFound } from "next/navigation";
import MiniMapClient from "@/components/MiniMapClient";
import ViewTracker from "@/components/ViewTracker";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import mongoose from "mongoose";
import { cache } from "react";
import { Metadata } from "next";
import { cleanAddress } from "@/lib/addressUtils";

export const revalidate = 3600; // Revalidate every 1 hour

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  await dbConnect();
  // Fetch basic info for Metadata including 1 image if available
  let roomSEO: any = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    roomSEO = await Post.findById(id).select("title slug address price areaSize images category").lean();
  } else {
    roomSEO = await Post.findOne({ slug: id }).select("title slug address price areaSize images category").lean();
  }
  
  if (!roomSEO) return {};

  const roomSlug = roomSEO.slug || id;

  const title = `${roomSEO.title} - ${cleanAddress(roomSEO.address)}`;
  const description = `Cho thuê ${roomSEO.category || "Phòng trọ"}: ${roomSEO.title} tại ${cleanAddress(roomSEO.address)}. Giá tham khảo: ${roomSEO.price?.toLocaleString("vi-VN")}đ/tháng. Diện tích: ${roomSEO.areaSize || 0}m².`;
  
  const ogImages = roomSEO.images?.[0] ? [{ url: roomSEO.images[0] }] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: roomSEO.images?.[0] ? [roomSEO.images[0]] : [],
    },
    alternates: {
      canonical: `/room/${roomSlug}`,
    }
  };
}

const getRoom = cache(async (idOrSlug: string) => {
  await dbConnect();
  
  let query;
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    query = Post.findById(idOrSlug);
  } else {
    query = Post.findOne({ slug: idOrSlug });
  }

  // Exclude images for faster initial load, populate user verification info
  const room: any = await query
    .select("-images")
    .populate("user", "name isVerified status createdAt")
    .lean();

  if (room && room.user) {
    // Get total posts count for this user
    const postCount = await Post.countDocuments({ user: room.user._id, status: "approved" });
    room.userPostCount = postCount;
  }

  return room;
});

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <RoomDetailContent id={id} />
  );
}

async function RoomDetailContent({ id }: { id: string }) {

  await dbConnect();
  const room: any = await getRoom(id);

  if (!room) {
    notFound();
  }

  // Format date
  const readyDate = room.availableDate 
    ? new Date(room.availableDate).toLocaleDateString("vi-VN") 
    : "Đang cập nhật";

  // Format participation date
  const joinDate = room.user?.createdAt 
    ? new Date(room.user.createdAt).toLocaleDateString("vi-VN") 
    : "Đang cập nhật";

  const getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_BASE_URL || "https://zeroom.vercel.app";
    if (!url.startsWith("http")) url = `https://${url}`;
    return url;
  };

  const baseUrl = getBaseUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "name": room.title,
    "description": room.note || `Cho thuê ${room.category || "phòng trọ"} ${room.title}`,
    "url": `${baseUrl}/room/${id}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": room.address,
      "addressCountry": "VN"
    },
    "numberOfRooms": room.bedrooms || 1,
    "offers": {
      "@type": "Offer",
      "price": room.price,
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock",
      "url": `${baseUrl}/room/${id}`
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <ViewTracker postId={id} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        
        {/* Main Content Card */}
        <div className="bg-white rounded-[40px] p-6 sm:p-10 shadow-sm border border-gray-100">
          
          {/* Title Header */}
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                  {room.title}
                </h1>
                <div className="flex items-center gap-2">
                  {room.isVerified && (
                    <div className="group relative">
                      <ShieldCheck className="w-8 h-8 text-blue-600 fill-blue-50" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-20">
                        Tin đăng đã xác thực
                      </div>
                    </div>
                  )}
                  {room.user?.isVerified && (
                    <div className="group relative">
                      <ShieldCheck className="w-8 h-8 text-orange-600 fill-orange-50" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-20">
                        Người đăng uy tín
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="flex items-center gap-2 text-gray-500 font-medium">
                <MapPin className="w-5 h-5 text-orange-500" />
                {cleanAddress(room.address)}
              </p>
            </div>
            
            <div className="md:text-right bg-orange-50 px-8 py-4 rounded-[32px] border border-orange-100/50">
              <div className="text-3xl font-black text-orange-600">
                {room.price.toLocaleString("vi-VN")}
              </div>
              <div className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">VNĐ / THÁNG</div>
            </div>
          </div>

          {/* Gallery & Map Section */}
          <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ImageGallery roomId={id} title={room.title} />
            </div>
            
            <div className="lg:col-span-1 border border-gray-100 rounded-[32px] shadow-sm relative overflow-hidden min-h-[400px] lg:min-h-full">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="flex items-center gap-4 px-6 py-4 bg-green-50 rounded-[24px] border border-green-100/50 transition-all hover:bg-green-100/30">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.1em] mb-0.5">Ngày sẵn sàng</p>
                <p className="text-base font-black text-green-900 tracking-tight">{readyDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-6 py-4 bg-orange-50 rounded-[24px] border border-orange-100/50 transition-all hover:bg-orange-100/30">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Phone className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.1em] mb-0.5">Số điện thoại / Zalo</p>
                <p className="text-base font-black text-gray-900 tracking-wide">{room.phone}</p>
                <p className="text-[10px] text-orange-400 font-medium mt-0.5 italic">"Đừng quên bảo bạn tìm thấy tin từ zeRoom nhé! ✨"</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-6 mb-12">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-orange-600 rounded-full"></div>
              Tiện ghi & Đặc điểm nổi bật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 bg-gray-50/50 p-8 rounded-[32px] border border-gray-100">
              {room.amenities && room.amenities.length > 0 ? (
                room.amenities.map((item: string) => (
                  <div key={item} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">Không có thông tin tiện nghi</p>
              )}
            </div>
          </div>
          
          {/* Additional Description (Note) */}
          {room.note && (
            <div className="mt-12 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-orange-600 rounded-full"></div>
                Ghi chú khác
              </h2>
              <div className="bg-orange-50/30 border border-orange-100/50 rounded-[32px] p-8">
                <p className="text-sm text-gray-700 leading-8 whitespace-pre-wrap font-medium">
                  {room.note}
                </p>
              </div>
            </div>
          )}

              {/* Rejection Note (If any, for internal or user awareness) */}
              {room.status === "rejected" && (
                <div className="mt-10 pt-8 border-t border-red-100">
                  <h2 className="text-xl font-bold text-red-600 mb-4">Lý do từ chối</h2>
                  <p className="text-red-600 leading-relaxed text-sm p-4 bg-red-50 rounded-2xl italic">
                    "{room.rejectionReason}"
                  </p>
                </div>
              )}

          {/* Contact & Safety Note */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Card */}
            <div className="lg:col-span-1 bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-orange-600 rounded-full"></div>
                    Thông tin liên hệ
                </h3>
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 relative drop-shadow-sm">
                        <span className="text-2xl font-black text-orange-600">
                          {(room.user?.name || "??").substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="flex flex-col items-center mb-4">
                        <h4 className="text-xl font-black text-gray-900 mb-0.5">{room.user?.name || "Người đăng tin"}</h4>
                        {room.user?.isVerified ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">
                             <ShieldCheck className="w-3.5 h-3.5 text-orange-600 fill-orange-50" />
                             <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">Đã xác thực</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                             <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Chưa xác thực</span>
                          </div>
                        )}
                    </div>

                    <p className="text-[12px] text-gray-500 font-bold mb-6 italic bg-gray-50/50 px-4 py-2 rounded-xl">
                      {room.userPostCount || 0} tin đăng • Tham gia từ: {joinDate}
                    </p>
                    <button className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                        <Phone className="w-5 h-5" />
                        {room.phone}
                    </button>
                    <p className="text-[10px] text-gray-400 mt-4 text-center">Liên hệ qua Zalo hoặc gọi trực tiếp</p>
                </div>
            </div>

            {/* Safety Note */}
            <div className="lg:col-span-2 bg-[#0F172A] rounded-[40px] p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <ShieldCheck className="w-32 h-32 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
                    <CheckCircle2 className="w-6 h-6 text-orange-500" />
                    Lưu ý
                </h3>
                <div className="space-y-6 relative z-10">
                    <div className="p-6 bg-white/5 rounded-[24px] border border-white/10 backdrop-blur-sm">
                        <p className="text-gray-200 text-sm leading-8">
                            <span className="text-orange-400 font-black uppercase tracking-wider text-xs block mb-2">⚠️ Cảnh báo đặt cọc:</span>
                            Chỉ đặt cọc khi xác định được chủ nhà và có thỏa thuận biên nhận rõ ràng. Kiểm tra mọi điều khoản và yêu cầu liệt kê tất cả chi phí hàng tháng vào hợp đồng.
                        </p>
                    </div>
                    <div className="p-6">
                        <p className="text-red-400 text-xs leading-relaxed italic border-l-2 border-orange-500/30 pl-4">
                            Mọi thông tin liên quan đến tin đăng này trên zeRoom chỉ mang tính chất tham khảo. Nếu bạn thấy rằng tin đăng này không đúng hoặc có dấu hiệu lừa đảo, hãy phản ánh ngay với chúng tôi bằng cách nhấp vào nút báo cáo để được hỗ trợ kịp thời.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
