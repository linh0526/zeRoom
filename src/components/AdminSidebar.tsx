"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  AlertTriangle, 
  Settings, 
  LogOut,
  ShieldCheck,
  TrendingUp,
  MessageSquare
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Tổng quan", href: "/admin" },
  { icon: FileText, label: "Quản lý tin đăng", href: "/admin/posts" },
  { icon: MessageSquare, label: "Tin nhắn khách", href: "/admin/messages" },
  { icon: Users, label: "Người dùng", href: "/admin/users" },
  { icon: AlertTriangle, label: "Báo cáo vi phạm", href: "/admin/reports" },
  { icon: TrendingUp, label: "Thống kê", href: "/admin/analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-gray-900 min-h-screen flex flex-col fixed left-0 top-0 z-50 shadow-2xl">
      {/* Brand */}
      <div className="p-8 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">ZEROOM</span>
            <span className="block text-[10px] font-bold text-orange-500 tracking-[0.2em] uppercase">Admin Portal</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                isActive 
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-gray-400 group-hover:text-orange-400"}`} />
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/5 space-y-4">
        <button className="w-full flex items-center gap-4 px-5 py-4 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          <span className="font-bold text-sm tracking-wide">Cài đặt hệ thống</span>
        </button>
        <button className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:text-white hover:bg-red-600 rounded-2xl transition-all group shadow-red-500/10">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-wide">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
