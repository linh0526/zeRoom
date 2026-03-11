"use client";

import { MapPin, User, Bell, Menu, PhoneCall, X, Plus } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="h-16 border-b border-gray-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-between px-6 z-30 relative">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl italic">z</span>
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-gray-900">
            ze<span className="text-blue-600">Room</span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/post" 
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng tin cho thuê</span>
        </Link>
        <div className="h-8 w-px bg-gray-200 mx-1"></div>
        <Link 
          href="/contact"
          className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all group outline-none"
        >
          <PhoneCall className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-wider">Liên hệ</span>
        </Link>
        <button className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-all shadow-sm">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-xs font-bold text-gray-700">Đăng nhập</span>
        </button>
      </div>
    </header>
  );
}
