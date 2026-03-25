"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ManagePostsPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }

    if (session?.user) {
      fetchUserPosts();
    }
  }, [session, status]);

  async function fetchUserPosts() {
    try {
      const res = await fetch("/api/user/posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRenew(postId: string) {
    try {
      const res = await fetch("/api/user/posts/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        fetchUserPosts();
        toast.success("Gia hạn thành công thêm 60 ngày!");
      } else {
        toast.error(data.error || "Không thể gia hạn bài đăng");
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi gia hạn");
    }
  }

  async function handleToggleVisibility(postId: string) {
    try {
      const res = await fetch("/api/user/posts/visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        fetchUserPosts();
        toast.success(data.status === "hidden" ? "Đã ẩn bài đăng" : "Đã hiện bài đăng");
      } else {
        toast.error(data.error || "Không thể thay đổi trạng thái bài đăng");
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi thay đổi trạng thái");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa bài đăng này?")) return;
    try {
      const res = await fetch("/api/admin/posts", { // Reuse admin delete API
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPosts(posts.filter(p => p._id !== id));
        toast.success("Đã xóa bài đăng thành công");
      } else {
        toast.error("Lỗi khi xóa bài đăng");
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi xóa");
    }
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý bài đăng</h1>
            <p className="text-gray-500 font-medium mt-1">Quản lý và cập nhật các tin đăng cho thuê của bạn</p>
          </div>
          <Link 
            href="/post"
            className="flex items-center gap-2 px-6 py-3.5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-orange-500/20 hover:bg-orange-700 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tạo tin mới
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm thông tin bài đăng..."
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-orange-500 outline-none transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Tiêu đề</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Loại dịch vụ</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 text-center">Trạng thái</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Ngày hết hạn</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-10">
                        <div className="h-6 bg-gray-100 rounded-lg w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                          <Search className="w-10 h-10 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Không có kết quả nào</p>
                        <Link href="/post" className="text-orange-600 font-black text-sm uppercase tracking-widest hover:underline mt-2">Đăng tin ngay</Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shrink-0 shadow-sm border border-white relative">
                             <Image src={post.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2340&auto=format&fit=crop'} alt="" fill sizes="56px" className="object-cover" unoptimized={post.images?.[0]?.includes("scontent") || false} />
                          </div>
                          <div className="max-w-[200px] sm:max-w-xs md:max-w-sm">
                            <p className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">{post.title}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{post.areaSize} m² • {post.price.toLocaleString("vi-VN")} đ</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-orange-100/50">
                          {post.category || "Thuê phòng"}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            post.status === 'approved' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 
                            post.status === 'pending' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 
                            post.status === 'hidden' ? 'bg-gray-400' :
                            'bg-red-500'
                          }`} />
                          <span className={`text-[11px] font-black uppercase tracking-widest ${
                            post.status === 'approved' ? 'text-green-600' : 
                            post.status === 'pending' ? 'text-orange-600' : 
                            post.status === 'hidden' ? 'text-gray-500' :
                            'text-red-600'
                          }`}>
                            {post.status === 'approved' ? 'Đã duyệt' : 
                             post.status === 'pending' ? 'Chờ duyệt' : 
                             post.status === 'rejected' ? 'Bị từ chối' : 
                             post.status === 'hidden' ? 'Đang ẩn' : 'Hết hạn'}
                          </span>
                        </div>
                        {post.status === 'rejected' && post.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1 duration-300">
                             <p className="text-[10px] text-red-600 font-bold leading-tight text-left italic">
                                Lý do: {post.rejectionReason}
                             </p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6 font-medium">
                        <p className={`text-xs font-bold mb-0.5 ${new Date(post.expiresAt) < new Date() ? 'text-red-500' : 'text-gray-900'}`}>
                           {post.expiresAt ? new Date(post.expiresAt).toLocaleDateString("vi-VN") : "N/A"}
                        </p>
                        <button 
                          onClick={() => handleRenew(post._id)}
                          className="flex items-center gap-1 text-orange-600 hover:text-orange-800 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase tracking-tighter">Gia hạn (+60 ngày)</span>
                        </button>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          {/* View Button */}
                          <div className="relative group/tooltip">
                            <Link 
                              href={`/room/${post.slug || post._id}`}
                              className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-all shadow-sm flex items-center justify-center"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Xem chi tiết
                            </span>
                          </div>

                          {/* Visibility Toggle Button */}
                          {(post.status === 'approved' || post.status === 'hidden') && (
                            <div className="relative group/tooltip">
                              <button 
                                onClick={() => handleToggleVisibility(post._id)}
                                className={`p-2.5 border rounded-xl transition-all shadow-sm flex items-center justify-center ${
                                  post.status === 'hidden' 
                                    ? 'bg-green-50 border-green-100 text-green-600 hover:bg-green-100' 
                                    : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                {post.status === 'hidden' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {post.status === 'hidden' ? 'Hiện bài đăng' : 'Tạm ẩn bài đăng'}
                              </span>
                            </div>
                          )}

                          {/* Edit Button */}
                          <div className="relative group/tooltip">
                            <Link 
                              href={`/post?edit=${post._id}`}
                              className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-all shadow-sm flex items-center justify-center"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Chỉnh sửa
                            </span>
                          </div>

                          {/* Delete Button */}
                          <div className="relative group/tooltip">
                            <button 
                              onClick={() => handleDelete(post._id)}
                              className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm flex items-center justify-center"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Xóa bài
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Số hàng/trang:</span>
                  <select className="bg-white border border-gray-200 rounded-lg text-xs font-bold px-3 py-1.5 outline-none focus:border-orange-500 transition-all">
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                  </select>
               </div>
               <p className="text-xs font-bold text-gray-500">
                 1-10 trên {posts.length}
               </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-100 transition-all shadow-sm disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1 mx-2">
                {[1].map((i) => (
                  <button key={i} className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${i === 1 ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>
                    {i}
                  </button>
                ))}
              </div>
              <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-100 transition-all shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
