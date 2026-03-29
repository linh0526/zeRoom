"use client";

import { MapContainer, TileLayer, Marker, useMap, Tooltip, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useEffect, useRef } from "react";
import { getRelativeTime } from "@/lib/formatDate";
import SafeImage from "./SafeImage";

interface Room {
  _id: string;
  id?: number;
  title: string;
  price: number;
  lat?: number;
  lng?: number;
  location?: {
    lat: number;
    lng: number;
  };
  area?: number;
  address: string;
  images: string[];
  createdAt: string | Date;
}

interface MapProps {
  rooms: Room[];
  center?: [number, number];
  selectedRoom?: any;
  onRoomSelect?: (room: any) => void;
}

const createPriceIcon = (price: number, isSelected: boolean, isUserVerified: boolean) => {
  const priceText = price >= 1000000 
    ? `${(price / 1000000).toLocaleString("vi-VN")} Tr` 
    : `${(price / 1000).toLocaleString("vi-VN")}k`;

  return L.divIcon({
    className: "bg-transparent border-none",
    html: `<div class="px-3 py-1.5 rounded-2xl font-bold text-sm shadow-md border-2 transition-all duration-300 flex items-center gap-0.5 justify-center whitespace-nowrap
      ${isSelected ? 'bg-orange-600 text-white border-white scale-110 shadow-orange-500/50 z-[1000]' : 'bg-white text-gray-800 border-transparent hover:scale-105'}">
      ${isUserVerified ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500 shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>' : ''}
      <span class="ml-0.5">${priceText}</span>
    </div>`,
    iconSize: [isUserVerified ? 100 : 80, 32],
    iconAnchor: [isUserVerified ? 50 : 40, 16],
  });
};

function MapController({ selectedRoom, center }: { selectedRoom: any, center?: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedRoom) {
      const lat = selectedRoom.location?.lat ?? selectedRoom.lat;
      const lng = selectedRoom.location?.lng ?? selectedRoom.lng;
      if (lat !== undefined && lng !== undefined) {
        map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
      }
    }
  }, [selectedRoom, map]);

  useEffect(() => {
    if (center && !selectedRoom) {
      map.flyTo(center, 13, { animate: true, duration: 1.5 });
    }
  }, [center, map, selectedRoom]);

  return null;
}

const RoomMarker = ({ room, isSelected, onRoomSelect }: { room: any, isSelected: boolean, onRoomSelect: any }) => {
  const markerRef = useRef<L.Marker>(null);
  const lat = room.location?.lat ?? room.lat;
  const lng = room.location?.lng ?? room.lng;

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  if (lat === undefined || lng === undefined) return null;

  return (
    <Marker 
      ref={markerRef}
      position={[lat, lng]}
      icon={createPriceIcon(room.price, isSelected, !!room.user?.isVerified)}
      eventHandlers={{
        click: () => {
          if (onRoomSelect) {
            onRoomSelect(room);
          }
        },
        mouseover: (e) => {
          e.target.openPopup();
        },
        mouseout: (e) => {
          // Chỉ đóng nếu không phải là phòng đang được chọn để xem chi tiết
          if (!isSelected) {
            e.target.closePopup();
          }
        }
      }}
    >
      <Popup closeButton={false} className="custom-room-popup" offset={[0, -5]}>
        <div className="flex flex-col w-[240px] bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300">
          <div className="w-full h-32 relative group">
            <SafeImage 
              src={room.images?.[0]} 
              alt={room.title} 
              fill
              sizes="240px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-2 right-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
              {room.area}m²
            </div>
          </div>
          <div className="p-3 bg-white">
            <div className="flex items-start gap-1 mb-2">
              <h3 className="font-bold text-[13px] text-gray-800 line-clamp-2 leading-tight flex-1 hover:text-orange-600 transition-colors cursor-pointer">
                {room.title}
              </h3>
              <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
                {room.user?.isVerified && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600 fill-orange-50"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                )}
              </div>
            </div>
            <div className="flex justify-between items-end gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Giá thuê</span>
                <p className="text-orange-600 font-black text-lg leading-none">
                  {room.price >= 1000000 ? `${(room.price / 1000000).toLocaleString("vi-VN")} Tr₫` : `${room.price.toLocaleString("vi-VN")}đ`}
                  <span className="text-xs font-normal text-gray-400 ml-0.5">/tháng</span>
                </p>
              </div>
              <p className="text-[10px] text-gray-400 font-bold italic mb-0.5">
                {getRelativeTime(room.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default function MapComponent({ rooms, center = [10.86750471385017, 106.61996028967714], selectedRoom, onRoomSelect }: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <MapController selectedRoom={selectedRoom} center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {rooms.map((room) => (
        <RoomMarker 
          key={room._id}
          room={room}
          isSelected={selectedRoom?._id === room._id}
          onRoomSelect={onRoomSelect}
        />
      ))}
    </MapContainer>
  );
}
