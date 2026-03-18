"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from "react-leaflet";
import { ChevronLeft, ChevronRight } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useEffect, useRef, useState } from "react";
import { getRelativeTime } from "@/lib/formatDate";
import Image from "next/image";

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

const createPriceIcon = (price: number, isSelected: boolean) => {
  const priceText = price >= 1000000 
    ? `${(price / 1000000).toLocaleString("vi-VN")} Tr` 
    : `${(price / 1000).toLocaleString("vi-VN")}k`;

  return L.divIcon({
    className: "bg-transparent border-none",
    html: `<div class="px-3 py-1.5 rounded-2xl font-bold text-sm shadow-md border-2 transition-all duration-300 flex items-center justify-center whitespace-nowrap gap-1.5
      ${isSelected ? 'bg-blue-600 text-white border-white scale-110 shadow-blue-500/50 z-[1000]' : 'bg-white text-gray-800 border-transparent hover:scale-105'}">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-80"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      ${priceText}
    </div>`,
    iconSize: [80, 32],
    iconAnchor: [40, 16],
  });
};

function MapController({ selectedRoom }: { selectedRoom: any }) {
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
  return null;
}

const RoomMarker = ({ room, isSelected, onRoomSelect }: { room: any, isSelected: boolean, onRoomSelect: any }) => {
  const lat = room.location?.lat ?? room.lat;
  const lng = room.location?.lng ?? room.lng;

  if (lat === undefined || lng === undefined) return null;

  return (
    <Marker 
      position={[lat, lng]}
      icon={createPriceIcon(room.price, isSelected)}
      eventHandlers={{
        click: () => {
          if (onRoomSelect) {
            onRoomSelect(room);
          }
        }
      }}
    >
      <Tooltip direction="top" offset={[0, -15]} opacity={1} className={`custom-tooltip shadow-2xl p-0 border-none rounded-xl overflow-hidden bg-transparent ${isSelected ? 'hidden' : ''}`}>
        <div className="flex flex-col w-[200px] bg-white rounded-xl overflow-hidden shadow-2xl">
          <div className="w-full h-28 relative">
            <Image 
              src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2340&auto=format&fit=crop'} 
              alt={room.title} 
              fill
              sizes="200px"
              className={`object-cover ${!room.images?.[0] ? 'bg-gray-100' : ''}`}
            />
            {!room.images?.[0] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-bold text-xs text-gray-800 line-clamp-1 mb-1">{room.title}</h3>
            <div className="flex justify-between items-center mt-1">
              <p className="text-blue-600 font-bold text-sm">
                {room.price >= 1000000 ? `${(room.price / 1000000).toLocaleString("vi-VN")} Tr₫` : `${room.price.toLocaleString("vi-VN")}đ`}
              </p>
              <p className="text-[10px] text-gray-500 font-bold italic">
                {getRelativeTime(room.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
};

export default function MapComponent({ rooms, center = [10.762622, 106.660172], selectedRoom, onRoomSelect }: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <MapController selectedRoom={selectedRoom} />
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
