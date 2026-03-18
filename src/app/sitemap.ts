import { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_BASE_URL || "https://zeroom.vercel.app";
  if (!url.startsWith("http")) url = `https://${url}`;
  return url;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  try {
    await dbConnect();
    // Fetch active/approved posts
    const posts = await Post.find({ status: "approved" }).select("_id updatedAt createdAt").lean() as any[];

    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/room/${post._id}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.createdAt || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/post`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      },
      ...postEntries,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      }
    ];
  }
}
