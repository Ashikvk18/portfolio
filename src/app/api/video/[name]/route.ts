import { NextRequest, NextResponse } from "next/server";

const GITHUB_RELEASE =
  "https://github.com/Ashikvk18/portfolio/releases/download/v1.0.0";

const ALLOWED_FILES = ["scene1.mp4", "scene2.mov", "scene3.mp4", "scene4.mp4"];

const MIME_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska",
};

function getMime(name: string) {
  const ext = name.substring(name.lastIndexOf("."));
  return MIME_TYPES[ext] || "video/mp4";
}

export async function HEAD(
  _request: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;
  if (!ALLOWED_FILES.includes(name)) {
    return new NextResponse(null, { status: 404 });
  }
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Content-Type": getMime(name),
      "Accept-Ranges": "bytes",
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;

  if (!ALLOWED_FILES.includes(name)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = `${GITHUB_RELEASE}/${name}`;

  // Support range requests for video seeking/streaming
  const rangeHeader = request.headers.get("range");
  const fetchHeaders: Record<string, string> = {};
  if (rangeHeader) {
    fetchHeaders["Range"] = rangeHeader;
  }

  try {
    const res = await fetch(url, {
      headers: fetchHeaders,
      redirect: "follow",
    });

    if (!res.ok && res.status !== 206) {
      return NextResponse.json(
        { error: "Failed to fetch video" },
        { status: res.status }
      );
    }

    const contentLength = res.headers.get("content-length");
    const contentRange = res.headers.get("content-range");
    const acceptRanges = res.headers.get("accept-ranges");

    const responseHeaders: Record<string, string> = {
      "Content-Type": getMime(name),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Accept-Ranges": "bytes",
    };

    if (contentLength) responseHeaders["Content-Length"] = contentLength;
    if (contentRange) responseHeaders["Content-Range"] = contentRange;
    if (acceptRanges) responseHeaders["Accept-Ranges"] = acceptRanges;

    return new NextResponse(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Proxy fetch failed" },
      { status: 502 }
    );
  }
}
