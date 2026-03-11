"use client";

import { 
  Phone, 
  Mail, 
  Facebook, 
  ChevronRight 
} from "lucide-react";

export default function ContactSection() {
  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Left Side: Info & FAQ */}
        <div className="space-y-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-semibold text-blue-600 tracking-[0.1em] uppercase mb-4">Thông tin liên hệ</h2>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                    <Facebook className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">facebook</p>
                    <a href="https://www.facebook.com/nguyen.hoai.linh.96331" className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors">Nguyen Hoai Linh</a>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <a href="mailto:linhngyn0526@gmail.com" className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors">linhngyn0526@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-sm font-semibold text-blue-600 tracking-[0.1em] uppercase mb-4">Câu hỏi thường gặp</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Làm sao để đăng tin cho thuê?",
                  a: "Đăng ký tài khoản và chọn \"Đăng tin cho thuê\" trên thanh menu. Hiện tại Zeroom đang miễn phí hoàn toàn."
                },
                {
                  q: "Chi phí đăng tin như thế nào?",
                  a: "🎉 Miễn phí 100% với nhiều tính năng nổi bật."
                },
                {
                  q: "Tôi có thể chỉnh sửa tin đã đăng không?",
                  a: "Có, bạn có thể chỉnh sửa thông tin bài đăng bất kỳ lúc nào trong trang quản lý của mình."
                },
                {
                  q: "Có giới hạn số lượng tin đăng không?",
                  a: "Trong thời gian này, bạn có thể đăng không giới hạn số lượng tin."
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-50 transition-all group">
                  <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-start gap-3">
                    <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold italic">Q</span>
                    {item.q}
                  </h4>
                  <p className="text-sm font-normal text-gray-500 pl-8 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="lg:sticky lg:top-10 h-fit">
          <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-2xl shadow-blue-100/30 space-y-8">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">Gửi tin nhắn cho tôi</h3>
              <p className="text-sm font-normal text-gray-400">Điền thông tin bên dưới và tôi sẽ phản hồi sớm nhất có thể</p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="text" placeholder="Nhập họ và tên của bạn" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none transition-all" />
                <input type="tel" placeholder="0912 345 678" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <input type="email" placeholder="email@example.com" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none transition-all" />
              <input type="text" placeholder="Chủ đề bạn muốn trao đổi" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none transition-all" />
              <textarea placeholder="Mô tả chi tiết vấn đề bạn gặp phải hoặc câu hỏi cần hỗ trợ..." rows={4} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-3xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-none transition-all resize-none"></textarea>
              
              <button className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] shadow-lg shadow-blue-100 flex items-center justify-center gap-3 group">
                Gửi tin nhắn
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
