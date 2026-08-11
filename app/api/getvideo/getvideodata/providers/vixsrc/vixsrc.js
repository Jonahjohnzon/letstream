import { getCurrentWorker } from '../proxy';

const BASE_URL = 'https://vixsrc.to';
const WORKER_URL = "https://steam-proxy.hadezanubiz.workers.dev";
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150 Safari/537.36',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: BASE_URL,
    Origin: BASE_URL
};


function proxyUrl(url) {
  const worker = getCurrentWorker();
  return `${worker}/proxy?path=${encodeURIComponent(url)}`;
}

export const vixSrcProvider = async (media) => {
    return getSources(media);
}

function parseVariants(content) {
    const variants = [];
    const regex = /#EXT-X-STREAM-INF:[^\n]*RESOLUTION=\d+x(\d+)[^\n]*\n([^\n]+)/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        variants.push({
            resolution: parseInt(match[1], 10),
            url: match[2].trim()
        });
    }

    // sort highest to lowest
    return variants.sort((a, b) => b.resolution - a.resolution);
}

function parsePlaylist(content, masterUrl) {
    const variants = parseVariants(content);
    if (variants.length === 0) return emptyResult('No streams found in playlist');
    return {
        sources: [{
            url: masterUrl,
            type: 'hls',
            quality: 'auto',
            provider: { id: vixSrcProvider.id, name: vixSrcProvider.name }
        }],
        subtitles: [], // 👈 empty — HLS.js reads them from master m3u8 automatically
        diagnostics: []
    };
}



async function getSources(media) {
    try {
        const pageUrl = buildPageUrl(media);

        const sublink = await fetchApi(pageUrl);
        
        if (!sublink) return emptyResult('Failed to fetch api');
        const html = await fetchPage(sublink.src);
       
        if (!html) return emptyResult('Failed to fetch second embed page');
       
        const tokenData = extractTokenData(html);
        
        if (!tokenData) return emptyResult('Invalid or expired token');

        const masterUrl = buildMasterUrl(tokenData);
        const playlistContent = await fetchPlaylist(masterUrl, pageUrl);
        if (!playlistContent) return emptyResult('Failed to fetch playlist');

        return parsePlaylist(playlistContent, masterUrl, pageUrl);
    } catch (error) {
        return emptyResult(
            error instanceof Error ? error.message : 'Unknown provider error'
        );
    }
}

function buildPageUrl(media) {
    if (media.Type === 'movie') {
        return `${BASE_URL}/api/movie/${media.Tmdb_Id}`;
    }
    return `${BASE_URL}/api/tv/${media.Tmdb_Id}/${media.Season}/${media.Episode}`;
}

async function fetchApi(url) {
    try {
        const response = await fetch(url,{ headers: HEADERS });
        if (response.status !== 200) return null;
        return await response.json();
    } catch (err) {
        console.error('[fetchApi] error:', err.message);
        return null;
    }
}

async function fetchPage(suburl) {
    try {
        const response = await fetch(BASE_URL + suburl, { headers: HEADERS });
        
        if (response.status !== 200) return null; 
        return await response.text(); 
    } catch {
        return null;
    }
}

function extractTokenData(html) {
    const token = html.match(/token["']\s*:\s*["']([^"']+)/)?.[1];
    const expires = html.match(/expires["']\s*:\s*["']([^"']+)/)?.[1];
    const playlist = html.match(/url\s*:\s*["']([^"']+)/)?.[1];

    if (!token || !expires || !playlist) return null;
    if (isTokenExpired(expires)) return null;

    return { token, expires, playlist };
}

function isTokenExpired(expires) {
    return parseInt(expires, 10) * 1000 - 60_000 < Date.now();
}

function buildMasterUrl({ token, expires, playlist }) {
    const separator = playlist.includes('?') ? '&' : '?';
    return `${playlist}${separator}token=${token}&expires=${expires}&h=1`;
}

async function fetchPlaylist(url, referer) {
    try {
        const response = await fetch(url, {
            headers: { ...HEADERS, Referer: referer }
        });
        if (response.status !== 200) return null;
        return await response.text();
    } catch {
        return null;
    }
}




function emptyResult(message) {
    return {
        sources: [],
        subtitles: [],
        diagnostics: [{
            code: 'PROVIDER_ERROR',
            message: `VixSrc: ${message}`,
            field: '',
            severity: 'error'
        }]
    };
}

export async function healthCheck() {
    try {
        const response = await fetch(BASE_URL, {
            method: 'HEAD',
            headers: HEADERS
        });
        return response.status === 200;
    } catch {
        return false;
    }
}