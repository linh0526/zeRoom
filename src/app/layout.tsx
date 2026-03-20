import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

// Safe fallback function cho metadataBase phòng trường hợp Vercel Env bị set sai định dạng
const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_BASE_URL || "https://zeroom.vercel.app";
  if (!url.startsWith("http")) url = `https://${url}`;
  return new URL(url);
};

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  title: {
    default: "zeRoom - Tìm kiếm Phòng trọ & Căn hộ cho thuê toàn quốc",
    template: "%s | zeRoom",
  },
  description: "Nền tảng tìm kiếm phòng trọ, căn hộ, nhà nguyên căn thân thiện với bản đồ thông minh. Hàng ngàn phòng trọ giá tốt, chính chủ, cập nhật mỗi ngày. Khám phá và liên hệ ngay!",
  applicationName: "zeRoom",
  keywords: ["thuê trọ", "tìm phòng trọ", "cho thuê căn hộ mini", "nhà nguyên căn", "phòng trọ hà nội", "phòng trọ hcm", "trọ sinh viên", "tiện nghi"],
  authors: [{ name: "zeRoom Team" }],
  creator: "zeRoom",
  publisher: "zeRoom",
  openGraph: {
    title: "zeRoom - Tìm kiếm Phòng trọ & Căn hộ cho thuê toàn quốc",
    description: "Tìm kiếm chỗ ở dễ dàng hơn bao giờ hết với zeRoom. Bản đồ trực quan, ảnh thật, giá tốt từ chính chủ.",
    url: "/", // Dùng relative path để tự nhận diện từ metadataBase
    siteName: "zeRoom",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "zeRoom - Tìm kiếm Phòng trọ thông minh",
    description: "Tìm phòng trọ qua bản đồ tương tác với zeRoom. Dễ dàng, tin cậy.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "iTMDpBLk814FLgdy8pmCddV-gaFGGTmw_O3dEWdomeg",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Toaster position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
