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
  Eye
} from "lucide-react";
import Link from "next/link";

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
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
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
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all border border-gray-100">
              <Filter className="w-4 h-4" />
              Bộ lọc
            </button>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Tiêu đề</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Loại dịch vụ</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Trạng thái</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Ngày hết hạn</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Thao tác</th>
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
                        <Link href="/post" className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline mt-2">Đăng tin ngay</Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shrink-0 shadow-sm border border-white">
                             <img src={post.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2340&auto=format&fit=crop'} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{post.title}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{post.areaSize} m² • {post.price.toLocaleString("vi-VN")} đ</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100/50">
                          {post.category || "Thuê phòng"}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${post.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'}`}></div>
                          <span className={`text-[11px] font-black uppercase tracking-widest ${post.status === 'active' ? 'text-green-600' : 'text-orange-600'}`}>
                            {post.status === 'active' ? 'Đã duyệt' : 'Chờ duyệt'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs font-bold text-gray-700 mb-0.5">12/04/2026</p>
                        <button className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors">
                          <RefreshCw className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase">Gia hạn</span>
                        </button>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-all shadow-sm">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm">
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                  <select className="bg-white border border-gray-200 rounded-lg text-xs font-bold px-3 py-1.5 outline-none focus:border-blue-500 transition-all">
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
                  <button key={i} className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${i === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>
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
