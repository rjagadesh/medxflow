import { getStore } from "@netlify/blobs";

// Public endpoint that serves an image uploaded for a Meta post, so Facebook
// and Instagram can fetch it by URL. Intentionally unauthenticated (the ids
// are random and unguessable) - Meta's servers hit this to pull the image.
export default async (req) => {
  const id = new URL(req.url).searchParams.get("id");
  if (!id || !/^img-[a-z0-9-]+$/i.test(id)) return new Response("bad id", { status: 400 });
  try {
    const store = getStore("meta-media");
    const res = await store.getWithMetadata(id, { type: "arrayBuffer" });
    if (!res || !res.data) return new Response("not found", { status: 404 });
    const ct = res.metadata?.contentType || "image/jpeg";
    return new Response(Buffer.from(res.data), {
      status: 200,
      headers: { "content-type": ct, "cache-control": "public, max-age=86400" },
    });
  } catch {
    return new Response("error", { status: 500 });
  }
};
