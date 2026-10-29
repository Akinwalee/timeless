import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Timeless — Style Without Limit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const font = await readFile(join(process.cwd(), "public/fonts/host-grotesk-medium.ttf"));
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "64px", background: "#000", color: "#fff", fontFamily: "Host Grotesk", fontWeight: 500 }}>
      <div style={{ display: "flex", fontSize: 28, letterSpacing: 6 }}>TIMELESS · NIGERIA</div>
      <div style={{ display: "flex", maxWidth: 950, fontSize: 112, lineHeight: 1, letterSpacing: -6 }}>Style Without Limit.</div>
      <div style={{ display: "flex", fontSize: 24 }}>Independent clothing. Unrestricted expression.</div>
    </div>, { ...size, fonts: [{ name: "Host Grotesk", data: font, weight: 500 }] },
  );
}
