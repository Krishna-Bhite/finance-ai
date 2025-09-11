"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? "/placeholder.jpg" : src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      priority
    />
  );
}