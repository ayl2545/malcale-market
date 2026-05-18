"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[color:var(--muted)]">
        <Image
          src={main}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border-2 ${
                i === active
                  ? "border-[color:var(--primary)]"
                  : "border-transparent"
              }`}
              aria-label={`Image ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
