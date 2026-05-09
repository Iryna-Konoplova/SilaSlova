import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(_req: NextRequest) {
  return new ImageResponse(<div>OG Image</div>, { width: 1200, height: 630 });
}
