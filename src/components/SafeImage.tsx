"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | undefined | null;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2340&auto=format&fit=crop";

export default function SafeImage({ src, fallbackSrc = DEFAULT_FALLBACK, alt, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  // If the src prop changes externally, reset the internal state
  const handleSrc = src || fallbackSrc;

  return (
    <Image
      {...props}
      src={hasError ? fallbackSrc : handleSrc}
      alt={alt || "Property Image"}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
      unoptimized={props.unoptimized || handleSrc.includes("pt123.cdn.static123.com") || handleSrc.includes("scontent")}
    />
  );
}
