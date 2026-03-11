"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useState, useEffect } from "react";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  lat: number;
  lng: number;
  searchCounter: number;
}

function MapCenterUpdater({ lat, lng, searchCounter }: { lat: number, lng: number, searchCounter: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 16, { animate: true });
    }
  }, [lat, lng, map, searchCounter]); 

  return null;
}

function LocationMarker({ onLocationSelect, lat, lng }: { onLocationSelect: any, lat: number, lng: number }) {
  const [position, setPosition] = useState<L.LatLng | null>(L.latLng(lat, lng));

  useEffect(() => {
    setPosition(L.latLng(lat, lng));
  }, [lat, lng]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await response.json();
      return data.display_name || "";
    } catch (error) {
      console.error("Geocoding error:", error);
      return "";
    }
  };

  useMapEvents({
    click: async (e) => {
      setPosition(e.latlng);
      const address = await reverseGeocode(e.latlng.lat, e.latlng.lng);
      onLocationSelect(e.latlng.lat, e.latlng.lng, address);
    },
  });

  return position === null ? null : (
    <Marker 
      position={position} 
      icon={L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      })}
    />
  );
}

export default function MapPicker({ onLocationSelect, lat, lng, searchCounter }: MapPickerProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCenterUpdater lat={lat} lng={lng} searchCounter={searchCounter} />
      <LocationMarker onLocationSelect={onLocationSelect} lat={lat} lng={lng} />
    </MapContainer>
  );
}


