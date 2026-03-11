"use client";

import dynamic from "next/dynamic";

const MiniMap = dynamic(() => import("@/components/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse rounded-3xl flex items-center justify-center min-h-[250px]">
      <span className="text-gray-400 font-medium text-xs">Đang tải bản đồ...</span>
    </div>
  ),
});

interface MiniMapClientProps {
  lat: number;
  lng: number;
  address: string;
}

export default function MiniMapClient({ lat, lng, address }: MiniMapClientProps) {
  return <MiniMap lat={lat} lng={lng} address={address} />;
}
