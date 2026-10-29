"use client";

import { useEffect, useMemo, useState } from "react";
import type { ResolvedImage } from "@/lib/content";
import { createLatestImageSelection } from "@/lib/image-loading";
import { type ImageRole } from "@/lib/images";
import { ResponsiveImage } from "./ResponsiveImage";
import { preparePreview } from "./useImageWarming";

export function SwitchableImage({ image, sizes, selection, priority = false, role = "preview", className = "" }: {
  image: ResolvedImage; sizes: string; selection: string; priority?: boolean; role?: ImageRole; className?: string;
}) {
  const [frame, setFrame] = useState({ image, sizes });
  const displayed = frame.image;
  const [failed, setFailed] = useState<ResolvedImage | null>(null);
  const [initial] = useState(image);
  const requests = useMemo(() => createLatestImageSelection<{ image: ResolvedImage; sizes: string }>(setFrame, (value) => setFailed(value.image)), []);
  const pending = displayed.src !== image.src || displayed.mobileSrc !== image.mobileSrc;
  const error = pending && failed === image;

  useEffect(() => {
    if (pending) requests.select({ image, sizes }, preparePreview(image, sizes, true, role));
    return () => requests.cancel();
  }, [image, pending, requests, role, sizes]);

  return (
    <div className={`absolute inset-0 ${!pending && displayed !== initial ? "variant-image-enter" : ""}`} aria-busy={pending && !error} data-image-selection={selection} data-image-ready={!pending}>
      <ResponsiveImage image={displayed} sizes={frame.sizes} priority={priority} role={role} className={className} />
      {pending && <span role="status" className="absolute bottom-3 left-3 right-3 bg-white/90 px-3 py-2 text-[.65rem] text-black">
        {error ? `The ${selection} photograph could not load. The previous photograph is still shown.` : `Loading ${selection} photograph…`}
      </span>}
    </div>
  );
}
