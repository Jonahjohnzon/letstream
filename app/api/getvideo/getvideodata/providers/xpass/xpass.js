import * as cheerio from 'cheerio'
const BASE_URL = 'https://play.xpass.top';



 function buildUrl(media) {
    let itemId;
    if (media.Type === 'tv') {
        itemId = `${media.Tmdb_Id}/${media.Season}/${media.Episode}`;
    } else {
        itemId = `${media.Tmdb_Id}`;
    }
;
    return `${BASE_URL}/e/${media.Type}/${itemId}?autostart=false`;
}



function extractBackups(html) {
  const $ = cheerio.load(html);

  for (const script of $("script").toArray()) {
    const content = $(script).html() || "";

    const match = content.match(
      /var\s+backups\s*=\s*(\[[\s\S]*?\])\s*;?/,
    );

    if (!match) continue;

    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("JSON parse failed:", e);
    }
  }

  return [];
}

const FetchUrl = async (url) =>{
    try{
        const res = await fetch(`${BASE_URL}${url}`)
        if (res.status !== 200) return [];
        const result = await res.json()
        return result.playlist
        
    }
    catch(err){
        return []
    }
}


function detectType(url) {
  if (url.includes(".mp4")) return "mp4";
  if (url.includes(".m3u8") || url.includes(".txt")) return "hls";
  return "hls";
}


const getSources = async (media) =>{
    try{
    const url = buildUrl(media)
    const html = await fetch(url)
    const resHtml = await html.text()
    const list = extractBackups(resHtml)
   

    //extract m3u8 links and subtitle
    const TIK = list[0].url
    const M3u8Sources = await FetchUrl(TIK)

    let sourcesArr = []
   M3u8Sources[0].sources.forEach((stream) => {
  const url = stream.file;
  
  sourcesArr.push({
    url:  url,
    type: detectType(url),
    quality: "auto",
    label: stream.label || "Unknown",
    audioTracks: [
      {
        language: "eng",
        label: "Unknown",
      },
    ],
    provider: {
      id: "dove",
      name: "dove",
    },
  });
});



return { sources: sourcesArr, subtitles: [], diagnostics: [] };
    }
    catch(err){
        console.log(err)
          return { sources: [], subtitles: [], diagnostics: [  {
                code: 'PROVIDER_ERROR',
                message: `dove: Failed to fetch page`,
                field: '',
                severity: 'error'
            }] };
    }

}

export function xpassProvider (media){
   return getSources(media)
}