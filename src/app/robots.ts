import { MetadataRoute } from "next";

const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_BASE_URL || "https://zeroom.vercel.app";
  if (!url.startsWith("http")) url = `https://${url}`;
  return url;
};

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/manage/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
