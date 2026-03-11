"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Users, 
  MapPin, 
  AlertTriangle, 
  Ban, 
  CheckCircle,
  MoreVertical,
  Mail,
  Smartphone,
  Calendar
} from "lucide-react";

type UserStatus = "active" | "warning" | "banned";


export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<UserStatus | "all">("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: UserStatus) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      alert("Lỗi cập nhật");
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "active":
        return <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider">Hoạt động</span>;
      case "warning":
        return <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Cảnh cáo</span>;
      case "banned":
        return <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><Ban className="w-3 h-3" /> Đã chặn</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý người dùng</h1>
          <p className="text-sm font-semibold text-gray-400 mt-1">Quản lý danh tính và bảo vệ cộng đồng khỏi lừa đảo</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm theo tên, email, SDT..." 
            className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all w-80 shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
        </div>
      </div>

      {/* User Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
             <Users className="w-7 h-7 text-blue-600" />
           </div>
           <div>
             <p className="text-sm font-black text-gray-900">1,420</p>
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Tổng người dùng</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 border-l-4 border-l-orange-500">
           <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
             <AlertTriangle className="w-7 h-7 text-orange-500" />
           </div>
           <div>
             <p className="text-sm font-black text-gray-900">42</p>
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Bị cảnh cáo</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 border-l-4 border-l-red-500">
           <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
             <Ban className="w-7 h-7 text-red-500" />
           </div>
           <div>
             <p className="text-sm font-black text-gray-900">18</p>
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Tài khoản bị khóa</p>
           </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Người đăng</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Liên hệ</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Hoạt động</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Trạng thái</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
               <tr>
                 <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold tracking-widest uppercase">Đang tải dữ liệu...</td>
               </tr>
            ) : users.length === 0 ? (
               <tr>
                 <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold tracking-widest uppercase">Chưa có người dùng nào</td>
               </tr>
            ) : users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-4 border-gray-50 overflow-hidden shrink-0">
                       <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{user.name}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">ID: {user._id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-600 flex items-center gap-2"><Mail className="w-3 h-3 text-gray-400" /> {user.email}</p>
                    <p className="text-xs font-semibold text-gray-600 flex items-center gap-2"><Smartphone className="w-3 h-3 text-gray-400" /> {user.phone}</p>
                  </div>
                </td>
                <td className="px-8 py-6 text-[13px]">
                   <div className="flex flex-col gap-1">
                      <span className={`font-black ${user.postsCount > 50 ? 'text-red-600' : 'text-gray-900'}`}>{user.postsCount || 0} tin đăng</span>
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-widest"><Calendar className="w-3 h-3" /> Gia nhập: {new Date(user.joinedAt).toLocaleDateString("vi-VN")}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                     <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-sm" title="Chi tiết">
                        <MoreVertical className="w-4 h-4" />
                     </button>
                     {user.status !== "banned" ? (
                       <button 
                         onClick={() => handleUpdateStatus(user._id, "banned")}
                         className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Khóa tài khoản"
                       >
                          <Ban className="w-4 h-4" />
                       </button>
                     ) : (
                       <button 
                         onClick={() => handleUpdateStatus(user._id, "active")}
                         className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Mở khóa"
                       >
                          <CheckCircle className="w-4 h-4" />
                       </button>
                     )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note for Admin */}
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
         <div className="w-10 h-10 bg-blue-100 rounded-xl shrink-0 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
         </div>
         <p className="text-xs font-medium text-blue-700 leading-relaxed">
           <strong>Mẹo bảo mật:</strong> Hãy lưu ý những tài khoản có <strong>số lượng tin đăng lớn bất thường</strong> (thanh màu đỏ ở cột Hoạt động) ở nhiều khu vực khác nhau. Đây thường là các tài khoản môi giới hoặc spam tin rác. Hãy kiểm tra nội dung trước khi phê duyệt!
         </p>
      </div>
    </div>
  );
}
