"use client";

import { MapPin, User, Bell, Menu, PhoneCall, X, Plus, LogOut, LayoutDashboard, FileText } from "lucide-react";
import Link from "next/link";
import { useSession, signOut, signIn } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-[1001] sticky top-0">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-2xl italic">z</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-gray-900 hidden sm:block">
            ze<span className="text-blue-600">Room</span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          href="/post" 
          className="flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-blue-600 text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:block">Đăng tin ngay</span>
          <span className="block sm:hidden">Đăng tin</span>
        </Link>

        {session && (
          <Link 
            href="/manage"
            className="hidden md:flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Quản lý bài đăng</span>
          </Link>
        )}

        <Link href="/contact" className="hidden lg:flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors">
          <PhoneCall className="w-4 h-4" />
          <span>Liên hệ</span>
        </Link>

        <div className="hidden sm:block h-8 w-px bg-gray-100"></div>

        {!session ? (
          <button 
            onClick={() => signIn()}
            className="flex items-center gap-3 px-5 py-2.5 bg-gray-900 text-white rounded-[20px] hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-black uppercase tracking-wider">Đăng nhập</span>
          </button>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-[20px] hover:bg-gray-100 transition-all group shadow-sm active:scale-95"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{session.user?.name}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {session.user?.role === 'admin' && (
                  <>
                    <Link 
                      href="/admin"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-xl transition-colors text-xs font-bold text-blue-600 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <LayoutDashboard className="w-4 h-4" />
                      </div>
                      <span>Trang quản trị</span>
                    </Link>
                    <div className="h-px bg-gray-50 my-1 mx-2" />
                  </>
                )}

                <button 
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-xs font-bold text-red-600 group"
                >
                   <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LogOut className="w-4 h-4" />
                  </div>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
