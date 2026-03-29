"use client";

import SafeImage from "./SafeImage";
import { MapPin, ShieldCheck } from "lucide-react";
import { getRelativeTime } from "@/lib/formatDate";
import { cleanAddress } from "@/lib/addressUtils";

interface RoomCardProps {
  room: any;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function RoomCard({ room, isSelected, onClick }: RoomCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`min-w-[280px] h-[100px] bg-white rounded-2xl flex gap-3 p-2.5 shadow-xl cursor-pointer transition-all border-2 
        ${isSelected ? "border-orange-500 scale-105" : "border-transparent hover:border-orange-200"}`}
    >
      <div className="w-24 h-full relative rounded-xl overflow-hidden shrink-0 shadow-inner bg-gray-50">
        <SafeImage 
          src={room.images?.[0]} 
          alt={room.title}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      
      <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
        <div className="space-y-1">
          <div className="flex items-center gap-1 min-w-0">
            <h4 className="text-xs font-bold text-gray-800 line-clamp-1 leading-tight flex-1">{room.title}</h4>
            <div className="flex items-center gap-0.5 shrink-0">
              {room.user?.isVerified && (
                <ShieldCheck className="w-4 h-4 text-orange-600 fill-orange-50" />
              )}
            </div>
          </div>
          <p className="text-[9px] text-gray-400 line-clamp-1 flex items-center gap-0.5 font-medium">
            <MapPin className="w-2.5 h-2.5 shrink-0 text-orange-500/70" />
            {cleanAddress(room.address).split(",")[0]}
          </p>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <p className="text-xs font-black text-orange-600">
              {room.price >= 1000000 ? `${(room.price / 1000000).toLocaleString("vi-VN")} Tr₫` : `${room.price.toLocaleString("vi-VN")}đ`}
            </p>
            <p className="text-[9px] text-gray-400 font-bold italic">
              {getRelativeTime(room.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
