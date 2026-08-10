const API_URL = "https://www.freetogame.com/api/games";

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/json",
        "User-Agent": "HappyGameHub/1.0",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return Response.json(
        { error: "A FreeToGame não respondeu corretamente." },
        { status: response.status },
      );
    }

    const games = await response.json();

    return Response.json(games, {
      headers: {
        "Cache-Control":
          "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return Response.json(
      { error: "Não foi possível consultar a FreeToGame." },
      { status: 502 },
    );
  }
}
