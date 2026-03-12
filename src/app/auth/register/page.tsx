"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Chrome, Mail, Lock, ChevronRight, ArrowLeft, Loader2, User } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Đang đăng ký...");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Đăng ký không thành công", { id: loadingToast });
      } else {
        toast.success("Đăng ký thành công! Đang đăng nhập...", { id: loadingToast });
        
        // Auto sign in after register
        const result = await signIn("credentials", { 
          email, 
          password, 
          redirect: false 
        });

        if (!result?.error) {
          router.push("/");
          router.refresh();
        } else {
          router.push("/auth/signin");
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10 -ml-44 -mb-44 animate-pulse"></div>
        
        <div className="relative z-10 space-y-8">
          <Link href="/" className="inline-flex items-center gap-4 group">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
              <span className="text-blue-600 font-bold text-4xl italic">z</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white">zeRoom</h1>
          </Link>
          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl font-black text-white leading-tight">Gia nhập cộng đồng tìm trọ thông minh.</h2>
            <p className="text-blue-100 font-medium leading-relaxed">
              Trải nghiệm cách tìm phòng trọ hoàn toàn mới với bản đồ và tiện ích hiện đại.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 relative overflow-hidden">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold uppercase tracking-widest text-[10px] transition-all hover:-translate-x-1">
          <ArrowLeft className="w-4 h-4" />
          Trở về trang chủ
        </Link>

        <div className="w-full max-w-sm space-y-8 animate-slide-up">
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Đăng ký mới</h2>
            <p className="text-gray-500 font-medium italic">Vui lòng điền thông tin để tạo tài khoản</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-4 py-4 bg-white border-2 border-gray-100 rounded-[24px] font-black uppercase tracking-widest text-[11px] text-gray-700 hover:border-blue-100 hover:bg-blue-50/30 transition-all active:scale-[0.98] shadow-sm group"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Tiếp tục với Google</span>
            </button>
            
            <div className="flex items-center gap-4 py-1 opacity-50">
              <div className="h-px bg-gray-100 flex-1"></div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">hoặc dùng Email</span>
              <div className="h-px bg-gray-100 flex-1"></div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 group-focus-within:text-blue-500 transition-colors">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[24px] text-sm text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm focus:shadow-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 group-focus-within:text-blue-500 transition-colors">Địa chỉ Email</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[24px] text-sm text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm focus:shadow-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 group">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 group-focus-within:text-blue-500 transition-colors">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="********"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[24px] text-sm text-gray-900 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm focus:shadow-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-all active:scale-[0.98] shadow-xl hover:shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Đăng ký tài khoản
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">
            Trở lại <Link href="/auth/signin" className="text-blue-600 hover:underline cursor-pointer transition-all hover:tracking-[0.15em]">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
