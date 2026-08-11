import { getCurrentWorker3 } from "../proxy";

const VIDNEST_ALPHA = "RB0fpH8ZEyVLkv7c2i6MAJ5u3IKFDxlS1NTsnGaqmXYdUrtzjwObCgQP94hoeW+/=";

const BASE_URL = "https://new.vidnest.fun";

const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    "Origin": "https://vidnest.fun",
    "Referer": "https://vidnest.fun/",
};

function proxyUrl(url) {
  const worker = getCurrentWorker3();
  return `${worker}/proxy?path=${encodeURIComponent(url)}`;
}

function decodeVidnest(data) {
    const alpha = VIDNEST_ALPHA;
    const table = {};
    for (let idx = 0; idx < alpha.length; idx++) {
        table[alpha[idx]] = idx;
    }

    const result = [];
    let i = 0;

    while (i < data.length) {
        let chunk = data.slice(i, i + 4);
        while (chunk.length < 4) {
            chunk += "=";
        }
        i += 4;

        const indices = chunk.split("").map((c) => (table[c] !== undefined ? table[c] : 64));
        const [l0, l1, l2, l3] = indices;

        result.push((l0 << 2) | (l1 >> 4));
        if (l2 !== 64) {
            result.push(((l1 & 15) << 4) | (l2 >> 2));
        }
        if (l3 !== 64) {
            result.push(((l2 & 3) << 6) | l3);
        }
    }

    return Buffer.from(result).toString("utf-8");
}

async function fetchVidnest(url) {
    const res = await fetch(url, { headers: HEADERS });
    
    if (!res.ok) {
        if (res.status === 404) {
            throw new Error("VidNest: Resource not found (Invalid ID or missing content)");
        }
        throw new Error(`VidNest Upstream Error: ${res.status}`);
    }

    const raw = await res.text();
    
    let payload;
    try {
        payload = JSON.parse(raw);
    } catch {
        throw new Error("VidNest returned non-JSON response");
    }

    if (payload.encrypted) {
        const encData = payload.data;
        if (typeof encData !== "string") {
            throw new Error("VidNest: Missing encrypted data field");
        }
        const decryptedStr = decodeVidnest(encData);
        try {
            return JSON.parse(decryptedStr);
        } catch {
            return { raw: decryptedStr };
        }
    }

    return payload;
}

export async function VidNestProvider({ Tmdb_Id, Type, Season, Episode }) {
    const sources = [];
    try {
        let url;
        if (Type === "movie") {
            url = `${BASE_URL}/vidxyz/movie/${Tmdb_Id}`;
        } else if (Type === "tv") {
            url = `${BASE_URL}/vidxyz/tv/${Tmdb_Id}/${Season}/${Episode}`;
        } else {
            throw new Error("mediaType must be 'movie' or 'tv'");
        }
        const data = await fetchVidnest(url);

        // TODO: map `data` fields into actual stream entries
        sources.push({
            url: data?.url || data?.source || "",
            type: "hls",
            quality: "auto",
            label: "Ghost",
            audioTracks: [{
                language: "eng",
                label: "english"
            }],
            provider: { id: "Ghost", name: "Ghost" }
        });

        const sub = await getVidNestSubtitles({Tmdb_Id, Type, Season, Episode})
        
        
        return { sources, subtitles: sub, diagnostics: [] };
    } catch (err) {
        return {
            sources: [],
            subtitles: [],
            diagnostics: [{
                code: "PROVIDER_ERROR",
                message: `VidNest: ${err.message || "Failed to fetch page"}`,
                field: "",
                severity: "error"
            }]
        };
    }
}

async function getVidNestAnime({ anilistId, episode = "1", type = "sub", provider = "hianime" }) {
    const sources = [];
    try {
        if (!["sub", "dub"].includes(type)) {
            throw new Error("type must be 'sub' or 'dub'");
        }
        if (!["hianime", "animepahe"].includes(provider)) {
            throw new Error("provider must be 'hianime' or 'animepahe'");
        }

        const url = `${BASE_URL}/${provider}/${anilistId}/${episode}/1/${type}`;
        const data = await fetchVidnest(url);

        // TODO: map `data` fields into actual stream entries
        sources.push({
            url: data?.url || data?.source || "",
            type: "hls",
            quality: "auto",
            label: "VidNest",
            audioTracks: [{
                language: type === "dub" ? "eng" : "jpn",
                label: type === "dub" ? "english" : "japanese"
            }],
            provider: { id: "vidnest", name: "VidNest" }
        });

        return { sources, subtitles: [], diagnostics: [] };
    } catch (err) {
        return {
            sources: [],
            subtitles: [],
            diagnostics: [{
                code: "PROVIDER_ERROR",
                message: `VidNest: ${err.message || "Failed to fetch page"}`,
                field: "",
                severity: "error"
            }]
        };
    }
}

async function getVidNestSubtitles({ Tmdb_Id, Type, Season, Episode}) {
    try {
        let url;
        if (Type == "movie") {
            url = `${BASE_URL}/subtitles/${Tmdb_Id}`;
        } else if (Type == "tv") {
            url = `${BASE_URL}/subtitles/${Tmdb_Id}/${Season}/${Episode}`;
        } else {
            throw new Error("mediaType must be 'movie' or 'tv'");
        }

        const data = await fetchVidnest(url);

        return data
    } catch  {
        return [];
    }
}

