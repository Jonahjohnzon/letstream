import {getCurrentWorker2} from '../proxy';

const BASE_URL = 'https://streams.icefy.top';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150 Safari/537.36',
  Accept: 'application/json, text/javascript, */*; q=0.01',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: BASE_URL,
  Origin: BASE_URL,
};

async function fetchPage(url) {
    try {
        const response = await fetch(url, {
            headers: { ...headers, Referer: BASE_URL },
            referrer: BASE_URL
        });
        
        const data = await response.json();
        return data.stream || null;
    } catch {
        return null;
    }
}


async function buildUrl(media) {
    let itemId;
    if (media.Type === 'tv') {
        itemId = `tv/${media.Tmdb_Id}/${media.Season}/${media.Episode}`;
    } else {
        itemId = `movie/${media.Tmdb_Id}`;
    }

    
    return `${BASE_URL}/${itemId}`;
}

function proxyUrl(url) {
      const worker = getCurrentWorker2();
      return `${worker}/proxy?path=${encodeURIComponent(url)}`;
    }

const getSource = async (media) => {
    try{
    const pageUrl = await buildUrl(media);
    
    const data = await fetchPage(pageUrl);
    if (!data) {
        return { sources: [], subtitles: [], diagnostics: [  {
                code: 'PROVIDER_ERROR',
                message: `Icefy: Failed to fetch page`,
                field: '',
                severity: 'error'
            }] };
    }
    const proxy = proxyUrl(data)
    
    const sources = [];

        sources.push({
                url: proxy,
                type: "hls",
                quality: 'auto',
                label: 'Icefy',
                audioTracks: [{
                    language:  'eng',
                    label: 'english'
                }],
                provider: { id: "icefy", name: "icefy" }
            });
    return { sources, subtitles: [], diagnostics: [] };
        }
        catch{
              
        return { sources: [], subtitles: [], diagnostics: [  {
                code: 'PROVIDER_ERROR',
                message: `Icefy: Failed to fetch page`,
                field: '',
                severity: 'error'
            }] };
        }
}

export const icefySourcerer = (media)=>{
    return getSource(media)
}