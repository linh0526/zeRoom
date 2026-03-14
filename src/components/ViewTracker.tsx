"use client";

import { useEffect } from "react";

export default function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    // Gọi API để tăng lượt xem khi component được mount (chỉ một lần)
    const trackView = async () => {
      try {
        await fetch(`/api/posts/${postId}/view`, { method: "POST" });
      } catch (error) {
        console.error("Failed to track view:", error);
      }
    };

    trackView();
  }, [postId]);

  return null; // Component này không hiển thị gì cả
}
