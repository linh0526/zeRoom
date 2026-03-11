"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  Clock,
  Eye,
  MapPin,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

import { useEffect } from "react";

type PostStatus = "pending" | "approved" | "rejected" | "expired";

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PostStatus | "all">("all");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: PostStatus) => {
    try {
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchPosts(); // Refresh list
      }
    } catch (error) {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case "pending":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-wider"><Clock className="w-3 h-3" /> Chờ duyệt</span>;
      case "approved":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Đang hiển thị</span>;
      case "rejected":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider"><XCircle className="w-3 h-3" /> Đã từ chối</span>;
      case "expired":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-wider">Hết hạn</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý tin đăng</h1>
          <p className="text-sm font-semibold text-gray-400 mt-1">Phê duyệt và kiểm soát chất lượng dữ liệu "Tin thật"</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm tin đăng, ID..." 
              className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all w-72 shadow-sm"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
          </div>
          <button className="p-3.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {["all", "pending", "approved", "rejected", "expired"].map((s) => (
          <button 
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === s 
                ? "bg-gray-900 text-white shadow-xl shadow-gray-200" 
                : "bg-white text-gray-400 hover:text-gray-900 shadow-sm border border-gray-50"
            }`}
          >
            {s === "all" ? "Tất cả" : s === "pending" ? `Hàng đợi (${posts.filter(p => p.status === 'pending').length})` : s === "approved" ? "Hiển thị" : s === "rejected" ? "Từ chối" : "Hết hạn"}
          </button>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Thông tin tin đăng</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Người đăng</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Giá / Khu vực</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Trạng thái</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 text-gray-400">
                    <Clock className="w-10 h-10 animate-spin" />
                    <p className="font-bold text-sm uppercase tracking-widest">Đang tải dữ liệu...</p>
                  </div>
                </td>
              </tr>
            ) : posts.filter(p => filter === "all" || p.status === filter).length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                  Không có tin đăng nào
                </td>
              </tr>
            ) : posts.filter(p => filter === "all" || p.status === filter).map((post) => (
              <tr key={post._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
                      {post.images?.[0] ? (
                        <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <MapPin className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{post.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 font-bold">
                        <Clock className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        ID: #{post._id.slice(-6).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-gray-700">{post.phone}</span>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <p className="text-sm font-black text-blue-600">{(post.price / 1000000).toFixed(1)}TR</p>
                    <p className="text-xs font-semibold text-gray-400 mt-0.5 flex items-center gap-1 line-clamp-1 max-w-[200px]">
                      <MapPin className="w-3 h-3 shrink-0" /> {post.displayAddress || post.address}
                    </p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {getStatusBadge(post.status)}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    {post.status === "pending" ? (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(post._id, "approved")}
                          className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Duyệt"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(post._id, "rejected")}
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Từ chối"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    )}
                    <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Spam Control Tool Box */}
      <div className="bg-orange-50/50 border border-orange-100 rounded-[40px] p-8 mt-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
             <ShieldAlert className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Công cụ chống Spam & Nội dung rác</h3>
            <p className="text-xs font-semibold text-gray-500">Tự động nhận diện tin đăng trùng lặp hoặc chứa từ khóa cấm</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-5 rounded-2xl border border-orange-100 flex flex-col justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Từ khóa nhạy cảm</span>
              <p className="text-sm font-bold text-gray-900 mt-2">12 từ khóa đang được chặn</p>
              <button className="mt-4 text-[11px] font-black text-blue-600 uppercase hover:underline">Quản lý danh sách</button>
           </div>
           <div className="bg-white p-5 rounded-2xl border border-orange-100 flex flex-col justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Phone Blacklist</span>
              <p className="text-sm font-bold text-gray-900 mt-2">38 số điện thoại bị chặn</p>
              <button className="mt-4 text-[11px] font-black text-blue-600 uppercase hover:underline">Thêm số mới</button>
           </div>
           <div className="bg-white p-5 rounded-2xl border border-orange-100 flex flex-col justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Tự động xóa rác</span>
              <p className="text-sm font-bold text-gray-900 mt-2">Ẩn tin quá 60 ngày</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-4 bg-green-500 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                </div>
                <span className="text-[11px] font-bold text-green-600">Đang hoạt động</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
