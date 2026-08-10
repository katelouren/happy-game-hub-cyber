const ALLOWED_HOST = "www.freetogame.com";
const THUMBNAIL_PATH = /^\/g\/\d+\/thumbnail\.jpg$/;

export async function GET(request) {
  const source = request.nextUrl.searchParams.get("url");

  if (!source) {
    return new Response("URL da imagem não informada.", { status: 400 });
  }

  let imageUrl;

  try {
    imageUrl = new URL(source);
  } catch {
    return new Response("URL da imagem inválida.", { status: 400 });
  }

  if (
    imageUrl.protocol !== "https:" ||
    imageUrl.hostname !== ALLOWED_HOST ||
    !THUMBNAIL_PATH.test(imageUrl.pathname)
  ) {
    return new Response("Origem da imagem não permitida.", { status: 403 });
  }

  try {
    const imageResponse = await fetch(imageUrl, {
      headers: {
        Accept: "image/avif,image/webp,image/*,*/*",
        "User-Agent": "HappyGameHub/1.0",
      },
      next: { revalidate: 86400 },
    });

    if (!imageResponse.ok) {
      return new Response("Capa não encontrada.", { status: 404 });
    }

    return new Response(imageResponse.body, {
      headers: {
        "Content-Type":
          imageResponse.headers.get("content-type") || "image/jpeg",
        "Cache-Control":
          "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response("Não foi possível carregar a capa.", { status: 502 });
  }
}
