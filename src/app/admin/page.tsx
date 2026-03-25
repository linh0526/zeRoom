"use client";

import { 
  TrendingUp, 
  Users, 
  FileText, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Eye,
  MapPin
} from "lucide-react";

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const stats = data ? [
    { 
      label: "Tin đang chờ duyệt", 
      value: data.stats.pendingPosts.toString(), 
      icon: Clock, 
      color: "text-orange-500", 
      bg: "bg-orange-50", 
      trend: `+${data.stats.newPosts24h} tin mới`, 
      trendUp: data.stats.newPosts24h > 0 
    },
    { 
      label: "Tổng tin hiển thị", 
      value: data.stats.totalApproved.toLocaleString(), 
      icon: FileText, 
      color: "text-orange-500", 
      bg: "bg-orange-50", 
      trend: "Hoạt động", 
      trendUp: true 
    },
    { 
      label: "Tổng số người dùng", 
      value: data.stats.totalUsers.toLocaleString(), 
      icon: Users, 
      color: "text-green-500", 
      bg: "bg-green-50", 
      trend: `+${data.stats.newUsers24h} user/24h`, 
      trendUp: data.stats.newUsers24h > 0 
    },
    { 
      label: "Báo cáo cần xử lý", 
      value: data.stats.pendingReports.toString().padStart(2, '0'), 
      icon: AlertTriangle, 
      color: "text-red-500", 
      bg: "bg-red-50", 
      trend: data.stats.pendingReports > 0 ? "Cần kiểm tra" : "An toàn", 
      trendUp: data.stats.pendingReports === 0 
    },
  ] : [];

  const hotAreas = data?.hotAreas || [];
  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 animate-pulse h-48" />
          ))
        ) : stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.trendUp ? 'text-green-500' : 'text-red-500'} bg-gray-50 px-2 py-1 rounded-lg`}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-4xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section placeholder */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900">Hoạt động hệ thống</h3>
              <p className="text-xs font-semibold text-gray-400 mt-1">Dữ liệu cập nhật theo thời gian thực</p>
            </div>
            <select className="bg-gray-50 border-none outline-none text-xs font-bold px-4 py-2 rounded-xl text-gray-600 cursor-pointer">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end gap-3 justify-between px-4">
            {[40, 65, 45, 90, 55, 75, 85].map((val, i) => (
              <div key={i} className="flex-1 space-y-3 flex flex-col items-center group">
                <div 
                  className="w-full bg-orange-50 rounded-full relative overflow-hidden transition-all group-hover:bg-orange-100" 
                  style={{ height: `${val}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-600 to-orange-400 opacity-80" />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">T{i+2}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hot Areas */}
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 leading-none">Khu vực "Hot"</h3>
          </div>

          <div className="space-y-6">
            {hotAreas.map((area: { name: string; count: number; views: number }, idx: number) => (
              <div key={idx} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                     0{idx+1}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{area.name}</p>
                     <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <FileText className="w-3 h-3" /> {area.count} tin
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <Eye className="w-3 h-3" /> {area.views} lượt xem
                        </span>
                     </div>
                   </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
              </div>
            ))}
          </div>

          <button className="w-full mt-10 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-900 hover:text-white transition-all uppercase tracking-widest">
            Xem báo cáo chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
