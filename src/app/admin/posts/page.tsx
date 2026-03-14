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
  ShieldAlert,
  Calendar,
  AlertTriangle,
  Trash2,
  Edit3,
  Plus,
  X,
  Settings,
  ShieldCheck,
  RotateCcw
} from "lucide-react";

import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getRelativeTime } from "@/lib/formatDate";

type PostStatus = "pending" | "approved" | "rejected" | "expired";

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PostStatus | "all">("all");
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [adminConfig, setAdminConfig] = useState({
    requireApprovalNew: true,
    requireApprovalEdit: true
  });
  const [isConfigSaving, setIsConfigSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setAdminConfig(data);
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
    }
  };

  const updateSettings = async (newConfig: any) => {
    setIsConfigSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      });
      if (res.ok) {
        setAdminConfig(prev => ({ ...prev, ...newConfig }));
        toast.success("Đã cập nhật cấu hình hệ thống");
      }
    } catch (error) {
      toast.error("Lỗi cập nhật cấu hình");
    } finally {
      setIsConfigSaving(false);
    }
  };

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
        toast.success("Đã cập nhật trạng thái bài đăng");
      }
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.")) return;
    try {
      const res = await fetch("/api/admin/posts", {
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
  };

  const handleAdminUpdate = async (id: string, updateData: any) => {
    try {
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updateData }),
      });
      if (res.ok) {
        setShowEditModal(false);
        fetchPosts();
        toast.success("Đã cập nhật thông tin bài đăng");
      }
    } catch (error) {
      toast.error("Lỗi cập nhật tin đăng");
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
          <button 
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-2 px-5 py-3.5 bg-white border border-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <Settings className="w-4 h-4" />
            Cấu hình
          </button>
          <Link 
            href="/post"
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tạo tin mới
          </Link>
          <div className="relative hidden lg:block">
            <input 
              type="text" 
              placeholder="Tìm tin đăng, ID..." 
              className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all w-72 shadow-sm"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
          </div>
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
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Thông tin</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Người đăng</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Giá / Khu vực</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Hết hạn</th>
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
                        <Clock className="w-3 h-3" /> {getRelativeTime(post.createdAt)}
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
                  {post.expiresAt ? (
                    <div className="flex flex-col gap-1">
                      <p className={`text-xs font-bold flex items-center gap-1 ${
                        new Date(post.expiresAt) < new Date() ? 'text-red-500' : 'text-gray-700'
                      }`}>
                        <Calendar className="w-3 h-3" />
                        {new Date(post.expiresAt).toLocaleDateString("vi-VN")}
                      </p>
                      {new Date(post.expiresAt) < new Date() ? (
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-tighter bg-red-50 px-1.5 py-0.5 rounded-md self-start">Quá hạn</span>
                      ) : (
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                          Còn {Math.ceil((new Date(post.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} ngày
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-gray-300 italic">N/A</span>
                  )}
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
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(post._id, "rejected")}
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Từ chối"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => {
                          setEditingPost(post);
                          setShowEditModal(true);
                        }}
                        className="p-2.5 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm flex items-center justify-center" title="Chỉnh sửa nhanh (Trạng thái/Hạn)"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    )}
                    
                    <Link 
                      href={`/post?edit=${post._id}`}
                      className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-sm flex items-center justify-center" title="Sửa nội dung"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    
                    <button 
                      onClick={() => handleDelete(post._id)}
                      className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Xem">
                      <ExternalLink className="w-4 h-4" />
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
      {/* Quick Edit Modal */}
      {showEditModal && editingPost && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="bg-white rounded-[32px] w-full max-w-md relative z-10 shadow-2xl border border-gray-100 p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">QUẢN LÝ TIN ĐĂNG</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAdminUpdate(editingPost._id, {
                status: formData.get("status"),
                expiresAt: formData.get("expiresAt")
              });
            }} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Trạng thái</label>
                <select 
                  name="status"
                  defaultValue={editingPost.status}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                >
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Duyệt hiển thị</option>
                  <option value="rejected">Từ chối</option>
                  <option value="expired">Hết hạn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Ngày hết hạn</label>
                <input 
                  type="date" 
                  name="expiresAt"
                  defaultValue={editingPost.expiresAt ? new Date(editingPost.expiresAt).toISOString().split('T')[0] : ""}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Global Settings Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowConfigModal(false)} />
          <div className="bg-white rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl border border-gray-100 p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">CẤU HÌNH HỆ THỐNG</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Thiết lập quy trình kiểm duyệt</p>
              </div>
              <button 
                onClick={() => setShowConfigModal(false)}
                className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-blue-900 text-sm">Duyệt bài đăng mới</h4>
                  <p className="text-[10px] font-bold text-blue-600/70 uppercase tracking-tight mt-0.5">Yêu cầu admin phê duyệt tin mới</p>
                </div>
                <button 
                  disabled={isConfigSaving}
                  onClick={() => updateSettings({ requireApprovalNew: !adminConfig.requireApprovalNew })}
                  className={`w-14 h-8 rounded-full transition-all duration-300 relative ${adminConfig.requireApprovalNew ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                   <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 shadow-sm ${
                     adminConfig.requireApprovalNew ? 'right-1' : 'left-1'
                   }`} />
                </button>
              </div>

              <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-orange-900 text-sm">Duyệt lại khi chỉnh sửa</h4>
                  <p className="text-[10px] font-bold text-orange-600/70 uppercase tracking-tight mt-0.5">Tự động ẩn tin đã duyệt khi có thay đổi</p>
                </div>
                <button 
                  disabled={isConfigSaving}
                  onClick={() => updateSettings({ requireApprovalEdit: !adminConfig.requireApprovalEdit })}
                  className={`w-14 h-8 rounded-full transition-all duration-300 relative ${adminConfig.requireApprovalEdit ? 'bg-orange-500' : 'bg-gray-200'}`}
                >
                   <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 shadow-sm ${
                     adminConfig.requireApprovalEdit ? 'right-1' : 'left-1'
                   }`} />
                </button>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
               <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-tighter">
                    Lưu ý: Các thay đổi sẽ có hiệu lực ngay lập tức cho tất cả người dùng. 
                    Việc tắt yêu cầu duyệt bài có thể dẫn đến rủi ro về nội dung rác.
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
