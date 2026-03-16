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
  Calendar,
  ShieldCheck,
  ShieldClose
} from "lucide-react";
import toast from "react-hot-toast";

type UserStatus = "active" | "warning" | "banned";


export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<UserStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      console.log("Fetched users data:", data);
      if (Array.isArray(data)) setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id: string, updateData: any) => {
    console.log("handleUpdateUser called with:", { id, updateData });
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updateData }),
      });
      if (res.ok) {
        // Small delay to ensure consistency
        setTimeout(async () => {
          await fetchUsers();
          toast.success("Đã cập nhật thông tin người dùng");
        }, 500);
      } else {
        const err = await res.json();
        toast.error(err.error || "Lỗi cập nhật");
      }
    } catch (error) {
      toast.error("Lỗi kết nối server");
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all w-80 shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
        </div>
      </div>

      {/* User Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
             <Users className="w-7 h-7 text-gray-600" />
           </div>
           <div>
             <p className="text-sm font-black text-gray-900">{users.length}</p>
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Tổng người dùng</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 border-l-4 border-l-blue-500">
           <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
             <ShieldCheck className="w-7 h-7 text-blue-600" />
           </div>
           <div>
             <p className="text-sm font-black text-gray-900">{users.filter(u => u.isVerified).length}</p>
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Đã xác minh</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 border-l-4 border-l-orange-500">
           <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
             <AlertTriangle className="w-7 h-7 text-orange-500" />
           </div>
           <div>
             <p className="text-sm font-black text-gray-900">{users.filter(u => u.status === 'warning').length}</p>
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Bị cảnh cáo</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 border-l-4 border-l-red-500">
           <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
             <Ban className="w-7 h-7 text-red-500" />
           </div>
           <div>
             <p className="text-sm font-black text-gray-900">{users.filter(u => u.status === 'banned').length}</p>
             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Đã khóa</p>
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
            ) : users
                .filter(u => filter === "all" || u.status === filter)
                .filter(u => 
                  u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (u.phone && u.phone.includes(searchTerm))
                )
                .length === 0 ? (
               <tr>
                 <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold tracking-widest uppercase">Không tìm thấy người dùng nào</td>
               </tr>
            ) : users
                .filter(u => filter === "all" || u.status === filter)
                .filter(u => 
                  u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (u.phone && u.phone.includes(searchTerm))
                )
                .map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-4 border-gray-50 overflow-hidden shrink-0">
                         <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
                      </div>
                      {user.isVerified && (
                        <div className="absolute -right-1 -bottom-1 bg-white rounded-full p-0.5 border border-blue-50">
                           <ShieldCheck className="w-4 h-4 text-blue-600 fill-blue-50" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{user.name}</h4>
                        {user.isVerified && (
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-tighter rounded border border-blue-100">Xác minh</span>
                        )}
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">ID: {user._id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-600 flex items-center gap-2"><Mail className="w-3 h-3 text-gray-400" /> {user.email}</p>
                    <p className="text-xs font-semibold text-gray-600 flex items-center gap-2"><Smartphone className="w-3 h-3 text-gray-400" /> {user.phone || <span className="text-gray-300 italic">Chưa cập nhật</span>}</p>
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
                       {/* Verification Toggle */}
                       {!user.isVerified ? (
                         <button 
                           onClick={() => handleUpdateUser(user._id, { isVerified: true })}
                           className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Xác minh tài khoản"
                         >
                            <ShieldCheck className="w-4 h-4" />
                         </button>
                       ) : (
                         <button 
                           onClick={() => handleUpdateUser(user._id, { isVerified: false })}
                           className="p-2.5 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 hover:text-gray-600 transition-all shadow-sm" title="Hủy xác minh"
                         >
                            <ShieldClose className="w-4 h-4" />
                         </button>
                       )}

                       {/* Status Toggle */}
                       <div className="flex items-center gap-1.5 border-l border-gray-100 ml-1 pl-2">
                         {user.status !== "warning" && (
                           <button 
                             onClick={() => handleUpdateUser(user._id, { status: "warning" })}
                             className="p-2.5 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm" title="Cảnh cáo"
                           >
                              <AlertTriangle className="w-4 h-4" />
                           </button>
                         )}

                         {user.status !== "banned" ? (
                           <button 
                             onClick={() => handleUpdateUser(user._id, { status: "banned" })}
                             className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Khóa tài khoản"
                           >
                              <Ban className="w-4 h-4" />
                           </button>
                         ) : (
                           <button 
                             onClick={() => handleUpdateUser(user._id, { status: "active" })}
                             className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Mở khóa"
                           >
                              <CheckCircle className="w-4 h-4" />
                           </button>
                         )}
                       </div>
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
