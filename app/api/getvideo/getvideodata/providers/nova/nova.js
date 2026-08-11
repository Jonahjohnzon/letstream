const BASE_URL = "https://trendimovies.com/"
const HEADERS = {
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150 Safari/537.36',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: BASE_URL,
    Origin: BASE_URL
};

const buildUrl = (media) =>{
       let itemId;
    if (media.Type === 'tv') {
        itemId = `${BASE_URL}/${media.Type}/${media.Tmdb_Id}`;
    } else {
        itemId = `${BASE_URL}/${media.Type}/${media.Tmdb_Id}`;
    }

    return itemId
}


const getType = (url) => {
  if (url.includes(".srt")) return "subtitle";
  if (url.includes(".mp4")) return "video";
  return "unknown";
};

const getFinalLinks = async (url) => {
  const res = await fetch(url, { headers: HEADERS });
  const text = await res.text();

  return text;
};

const extractMediaLinks = (text) => {
  const mp4 = [...text.matchAll(/https?:\/\/[^"' ]+\.mp4[^"' ]*/g)].map(m => m[0]);
  const srt = [...text.matchAll(/https?:\/\/[^"' ]+\.srt[^"' ]*/g)].map(m => m[0]);

  return { mp4, srt };
};



function parseTrendiSources(rawArray) {
  const fullText = rawArray.join('');
  const decoded = fullText.replace(/&quot;/g, '"').replace(/&amp;/g, '&');

  const urlPattern = /https:\/\/trendimovies\.com\/tgstream\/stream\/\d+/g;
  const urls = [...decoded.matchAll(urlPattern)].map(m => m[0]);

  const qualityMatches  = [...decoded.matchAll(/"quality":\[0,"([^"]+)"/g)];
  const fileSizeMatches = [...decoded.matchAll(/"file_size":\[0,"([\d.]+)\s*(GB|MB|KB)?/g)];
  const variantMatches  = [...decoded.matchAll(/"variant":\[0,(?:"([^"]+)"|null)\]/g)];
  const fileNameMatches = [...decoded.matchAll(/"file_name":\[0,"([^"]+)"/g)];

  const sources = qualityMatches.map((qm, i) => {
    const num = fileSizeMatches[i]?.[1];
    const unit = fileSizeMatches[i]?.[2] || (num ? (parseFloat(num) < 10 ? 'GB' : 'MB') : null);
    const size = num ? `${num}${unit ? ' ' + unit : ''}` : null;

    return {
      url:     urls[i] || null,
      quality: qm[1],
      size,
      variant: variantMatches[i]?.[1] || null,
    };
  });

  const subtitleUrl = fileNameMatches.length > 0 ? urls[urls.length - 1] : null;

  return { sources, subtitleUrl };
}

// ─── Map to your source format ───────────────────────────────────────────────





const getSource = async  (media) =>{
    try{
    const url = buildUrl(media)
    
    const res = await fetch(url,{
        headers:HEADERS
    })
   
    const html = await res.text()
    const matches =
  html.match(/https:\/\/trendimovies\.com\/tgstream\/stream[^\s"'<>]+/g) || [];
   const trendiProvider = { id: 'trendi', name: 'TrendiMovies' };

const { sources: parsed, subtitleUrl } = parseTrendiSources(matches);

const sources = parsed.map(s => ({
  url:     s.url,
  type:    'mp4',
  quality: s.quality,   // "720p", "2160p", "hdrip" etc.
  label:   s.size ? `${s.quality} · ${s.size}` : s.quality,
  audioTracks: [{ language: 'eng', label: 'English' }],
  provider: { id: trendiProvider.id, name: trendiProvider.name },
}));

const subtitles = subtitleUrl
  ? [{ url: subtitleUrl, language: 'en', label: 'English' }]
  : await fetchSubtitles(media);  // fallback to your existing fetcher

return { sources, subtitles, diagnostics: [] };
    
    }catch(err){
    console.log(err)
  }
}

export const novaProvider = (media) =>{
   return getSource(media)
}