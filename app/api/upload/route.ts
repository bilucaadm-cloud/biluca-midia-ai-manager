import { randomUUID } from "node:crypto";
import { createServerSupabaseClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

export async function POST(req: Request) {
  if (!isSupabaseServerConfigured()) {
    return Response.json(
      {
        configured: false,
        error: "Supabase ainda nao configurado para upload real.",
      },
      { status: 200 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Arquivo nao enviado." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `design-requests/${randomUUID()}-${safeName}`;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.storage.from("post-artworks").upload(path, buffer, {
    cacheControl: "3600",
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    return Response.json(
      {
        configured: false,
        error:
          "Nao foi possivel enviar para o bucket post-artworks. Confirme se o bucket e as policies foram criados no Supabase.",
      },
      { status: 200 },
    );
  }

  const { data } = await supabase.storage
    .from("post-artworks")
    .createSignedUrl(path, 60 * 60 * 12);

  return Response.json({
    configured: true,
    path,
    url: data?.signedUrl ?? null,
    fileName: file.name,
  });
}
