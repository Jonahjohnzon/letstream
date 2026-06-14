import Apicore from "./ApiCore";

export const dynamic = "force-dynamic"; // 👈 add this line

export default async function sitemap() {
  const api = new Apicore();
  const url = "https://api.themoviedb.org/3/trending/movie/day?language=en-US";
  const url1 = "https://api.themoviedb.org/3/trending/tv/day?language=en-US";


  try {
    const res = await api.get(url);
    const sec = await api.get(url1);

    if (!res?.results || !sec?.results || !tel?.series) throw new Error();

    const post = res.results.map((pos) => ({
      url: `https://Screenopps.com/details/movie/${pos.id}/1`,
      lastModified: new Date(pos.release_date || Date.now()).toISOString(),
    }));

    const post2 = sec.results.map((pos) => ({
      url: `https://Screenopps.com/details/tv/${pos.id}/1`,
      lastModified: new Date(pos.first_air_date || Date.now()).toISOString(),
    }));



    return [
      { url: "https://Screenopps.com", lastModified: new Date().toISOString(), priority: 1 },
      ...post,
      ...post2
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [
      { url: "https://Screenopps.com", lastModified: new Date().toISOString(), priority: 1 },
    ];
  }
}
