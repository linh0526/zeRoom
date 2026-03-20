import AdminSidebar from "@/components/AdminSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions) as any;

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />
      <main className="ml-72 min-h-screen">
        {/* Top Header Placeholder (Can be a component later) */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Dashboard</h2>
            <p className="text-xs font-semibold text-gray-400 mt-1">Chào mừng Admin quay trở lại</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-sm font-black text-gray-900 leading-none mb-1">{session.user?.name}</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Super Admin</span>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-gray-900 border-4 border-white shadow-lg overflow-hidden shrink-0">
               <img src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=0D0D0D&color=fff`} alt="Admin" className="w-full h-full object-cover" />
             </div>
          </div>
        </header>
        
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
