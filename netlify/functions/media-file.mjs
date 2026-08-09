import { getStore } from "@netlify/blobs";

// Public endpoint serving a media-library file by id (unauthenticated; ids are
// random and unguessable). Used by copied URLs and by Facebook/Instagram fetch.
export default async (req) => {
  const id = new URL(req.url).searchParams.get("id");
  if (!id || !/^media-[a-z0-9-]+$/i.test(id)) return new Response("bad id", { status: 400 });
  try {
    const res = await getStore("media").getWithMetadata(id, { type: "arrayBuffer" });
    if (!res || !res.data) return new Response("not found", { status: 404 });
    const ct = res.metadata?.contentType || "application/octet-stream";
    return new Response(Buffer.from(res.data), {
      status: 200,
      headers: { "content-type": ct, "cache-control": "public, max-age=86400" },
    });
  } catch {
    return new Response("error", { status: 500 });
  }
};
