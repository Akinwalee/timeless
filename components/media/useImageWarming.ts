"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ResolvedImage } from "@/lib/content";
import { productPreviewSizes, responsiveImageProps, type ImageRole } from "@/lib/images";
import { allowImageWarming, prepareImage, type ConnectionInfo } from "@/lib/image-loading";

function canWarm() {
  return allowImageWarming((navigator as Navigator & { connection?: ConnectionInfo }).connection);
}

export function preparePreview(image: ResolvedImage, sizes: string, intent = false, role: ImageRole = "preview") {
  const props = responsiveImageProps(image, sizes, role);
  const request = matchMedia("(max-width: 767px)").matches && props.mobile ? props.mobile : props.desktop;
  return prepareImage(request, intent);
}

export function useImageWarming(images: ResolvedImage[], sizes: string, productPreview = false, desktopOnly = false) {
  const ref = useRef<HTMLDivElement>(null);
  const warm = useCallback((image: ResolvedImage, intent = true) => {
    if (!canWarm()) return;
    void preparePreview(image, productPreview ? productPreviewSizes(image, sizes) : sizes, intent);
  }, [productPreview, sizes]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !canWarm() || desktopOnly && !matchMedia("(min-width: 768px)").matches) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      timer = setTimeout(() => { if (!cancelled) images.slice(0, 8).forEach((image) => warm(image, false)); }, 250);
    };
    const afterCritical = () => {
      if (document.readyState === "complete") schedule();
      else window.addEventListener("load", schedule, { once: true });
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { observer.disconnect(); afterCritical(); }
    }, { rootMargin: "350px" });
    observer.observe(node);
    return () => { cancelled = true; observer.disconnect(); clearTimeout(timer); window.removeEventListener("load", schedule); };
  }, [desktopOnly, images, warm]);

  return { ref, warm };
}
