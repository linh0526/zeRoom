"use client";

import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  _id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "resolved";
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error("Lỗi khi tải tin nhắn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setMessages(messages.map(m => m._id === id ? { ...m, status: status as any } : m));
        toast.success("Đã cập nhật trạng thái");
      }
    } catch (error) {
      toast.error("Lỗi kĩ thuật");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin nhắn này?")) return;
    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setMessages(messages.filter(m => m._id !== id));
        toast.success("Đã xóa tin nhắn");
      }
    } catch (error) {
      toast.error("Lỗi xóa tin nhắn");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <MessageSquare className="w-8 h-8 text-orange-600" />
             TIN NHẮN KHÁCH HÀNG
          </h1>
          <p className="text-sm font-semibold text-gray-400 mt-1 uppercase tracking-widest">Quản lý phản hồi và yêu cầu hỗ trợ từ người dùng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {messages.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center border border-gray-100 shadow-sm">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                <MessageSquare className="w-10 h-10" />
             </div>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Chưa có tin nhắn nào</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg._id} 
              className={`bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all group relative overflow-hidden ${
                msg.status === "unread" ? "border-l-8 border-l-orange-600" : ""
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* User Info */}
                <div className="lg:w-1/4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Họ và tên</p>
                      <p className="text-sm font-black text-gray-900 truncate">{msg.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-bold">{msg.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold truncate">{msg.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">
                      {new Date(msg.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-2/4 space-y-3">
                   <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        msg.status === "unread" ? "bg-orange-100 text-orange-600" : 
                        msg.status === "read" ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-600"
                      }`}>
                        {msg.status === "unread" ? "Chưa đọc" : msg.status === "read" ? "Đã xem" : "Đã xử lý"}
                      </span>
                      <h3 className="text-base font-black text-gray-900">
                        {msg.subject || "Không có chủ đề"}
                      </h3>
                   </div>
                   <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                        {msg.message}
                      </p>
                   </div>
                </div>

                {/* Actions */}
                <div className="lg:w-1/4 flex lg:flex-col justify-end lg:justify-start gap-3">
                  {msg.status !== "resolved" && (
                    <button 
                      onClick={() => updateStatus(msg._id, "resolved")}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all font-bold text-[11px] uppercase tracking-widest"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Xong
                    </button>
                  )}
                  {msg.status === "unread" && (
                    <button 
                      onClick={() => updateStatus(msg._id, "read")}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-600 hover:text-white transition-all font-bold text-[11px] uppercase tracking-widest"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Đã xem
                    </button>
                  )}
                  <button 
                    onClick={() => deleteMessage(msg._id)}
                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
