"use server"
const { NextResponse } = await import('next/server')
const { utill } = await import('./getvideodata/utill/utill')

export const fetchTMDB = async (Tmdb_Id, Type, Season, Episode) => {
    try {
        const TMDB_API_KEY = process.env.DB_BEARER;
        const base = `https://api.themoviedb.org/3/${Type}/${Tmdb_Id}`;
        const headers = {
            Authorization: `Bearer ${TMDB_API_KEY}`,
            'Content-Type': 'application/json'
        };

        const [mainRes, externalRes] = await Promise.all([
            fetch(base, { headers }),
            fetch(`${base}/external_ids`, { headers })
        ]);

        const data = await mainRes.json();
        const external = await externalRes.json();
        // tv uses 'name', movie uses 'title'
        const title = data.title || data.name || 'Unknown';
        const poster = data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : null;
        const backdrop = data.backdrop_path
            ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
            : null;
        const overview = data.overview || '';
        const imdb_id = external.imdb_id || null;

        // for tv episodes get episode title and still
        let episode_title = null;
        let episode_still = null;
        if (Type === 'tv' && Season && Episode) {
            const epRes = await fetch(
                `${base}/season/${Season}/episode/${Episode}`,
                { headers }
            );
            const epData = await epRes.json();
            episode_title = epData.name || null;
            episode_still = epData.still_path
                ? `https://image.tmdb.org/t/p/w500${epData.still_path}`
                : null;
        }

        return { title, poster, backdrop, overview, imdb_id, episode_title, episode_still };
    } catch {
        return { title: 'Unknown', poster: null, backdrop: null, overview: '', imdb_id: null };
    }
};

export const GET = async (req) => {
    
    try {
        const Url = new URL(req.url)
        const Tmdb_Id = Url.searchParams.get('Tmdb_Id')
        const Type = Url.searchParams.get('Type')
        const Season = Url.searchParams.get('Season')
        const Episode = Url.searchParams.get('Episode')
        const Server = Url.searchParams.get('Server')

        if (!Tmdb_Id || !Type || !Server) {
            return NextResponse.json({ error: 'Missing required query parameters.' }, { status: 400 })
        }

        if (Type === 'tv' && (!Season || !Episode)) {
            return NextResponse.json({ error: 'Missing Season/Episode parameters for TV type.' }, { status: 400 })
        }

        // fetch stream sources and TMDB info in parallel
        const [result, tmdb] = await Promise.all([
            utill(Tmdb_Id, Type, Season, Episode, Server),
            fetchTMDB(Tmdb_Id, Type, Season, Episode)
        ]);
        return NextResponse.json({ ...result, ...tmdb })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'An error occurred while fetching data.' }, { status: 500 })
    }
}