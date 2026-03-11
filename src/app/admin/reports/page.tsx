"use client";

import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  Search, 
  Trash2, 
  MessageSquare, 
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  UserCheck
} from "lucide-react";

export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
      const data = await res.json();
      if (Array.isArray(data)) setReports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hệ thống báo cáo vi phạm</h1>
          <p className="text-sm font-semibold text-gray-400 mt-1">"Tai mắt" của cộng đồng giúp duy trì môi trường tin thật</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm theo tin, nội dung..." 
            className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all w-80 shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="bg-white rounded-[40px] p-20 border border-gray-100 text-center text-gray-400 font-bold uppercase tracking-widest">
            Đang tải dữ liệu...
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 border border-gray-100 text-center text-gray-400 font-bold uppercase tracking-widest">
            Chưa có báo cáo nào
          </div>
        ) : reports.map((report) => (
          <div key={report._id} className={`bg-white rounded-[40px] p-8 border shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/50 flex flex-col md:flex-row gap-8 ${report.urgent ? 'border-red-100 bg-red-50/10' : 'border-gray-100'}`}>
            {/* Left: Indicator & Info */}
            <div className="md:w-64 shrink-0 space-y-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${report.urgent ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                 <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Lý do báo cáo</p>
                 <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tight ${report.urgent ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-700'}`}>
                   {report.reason}
                 </span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Người báo cáo</p>
                 <p className="text-sm font-bold text-gray-900">{report.reporterName}</p>
                 <p className="text-[11px] font-semibold text-gray-400 mt-0.5 uppercase tracking-tighter">{new Date(report.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>

            {/* Middle: Content */}
            <div className="flex-1 space-y-4 pt-1">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Tin bị báo cáo</p>
                <h3 className="text-xl font-black text-gray-900 leading-tight flex items-center gap-3">
                  {report.post?.title || "Tin không tồn tại hoặc đã bị xóa"}
                  <ExternalLink className="w-4 h-4 text-gray-300 cursor-pointer hover:text-blue-500 transition-colors" />
                </h3>
              </div>
              <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-100 relative">
                 <MessageSquare className="absolute -left-3 -top-3 w-8 h-8 text-gray-200 fill-gray-100" />
                 <p className="text-sm font-medium text-gray-600 italic leading-relaxed">
                   "{report.description}"
                 </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="md:w-56 shrink-0 flex flex-col justify-center gap-3">
               <button className="w-full flex items-center justify-center gap-2 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                  <Trash2 className="w-4 h-4" /> Gỡ tin lập tức
               </button>
               <button className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-blue-600 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all">
                  <UserCheck className="w-4 h-4" /> Liên hệ xác minh
               </button>
               <button className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 hover:text-gray-700 transition-all">
                  <CheckCircle2 className="w-4 h-4" /> Báo cáo sai
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Footer placeholder */}
      <div className="mt-12 p-8 bg-gray-900 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 text-white overflow-hidden relative">
         <AlertTriangle className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5 rotate-12" />
         <div className="relative z-10">
            <h4 className="text-xl font-black mb-2 tracking-tight">Cần giúp đỡ trong quản lý cộng đồng?</h4>
            <p className="text-sm font-medium text-gray-400 max-w-md">Hãy nhớ rằng chính những người dùng tích cực report là yếu tố quan trọng nhất để ZEROOM luôn là website cho thuê tin tưởng nhất.</p>
         </div>
         <button className="relative z-10 px-10 py-5 bg-blue-600 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Xem quy tắc xử lý
         </button>
      </div>
    </div>
  );
}
