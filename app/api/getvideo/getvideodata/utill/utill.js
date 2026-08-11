const cache = new Map();

const getCacheKey = (Tmdb_Id, Type, Season, Episode, Server) => {
    if (Type === 'tv') return `${Server}-${Type}-${Tmdb_Id}-${Season}-${Episode}`;
    return `${Server}-${Type}-${Tmdb_Id}`;
};

const CACHE_TTL = {
    Vixsrc:  1000 * 60 * 30,           // 30 min
    Vidrock: 1000 * 60 * 60 * 24 * 10, // 10 days — override default if needed
    default: 1000 * 60 * 60 * 24 * 10  // 10 days for everything else
};

const getTTL = (Server) => CACHE_TTL[Server] ?? CACHE_TTL.default;

export const utill = async (Tmdb_Id, Type, Season, Episode, Server) => {
    try {
        const key = getCacheKey(Tmdb_Id, Type, Season, Episode, Server);
        const ttl = getTTL(Server);

      if (Server !== "Dove" && cache.has(key)) {
        const { data, timestamp } = cache.get(key);

        if (Date.now() - timestamp < ttl) {
            return data;
        }

        cache.delete(key);
    }



        const media = { Tmdb_Id, Type, Season, Episode, Server };
        let data;

        switch (Server) {
            case 'Viper':
                const { vidRockProvider } = await import('../providers/vidrock/vidrock');
                data = await vidRockProvider(media);
                break;
            case 'Eagle':
                const { novaProvider } = await import('../providers/nova/nova.js');
                data = await novaProvider(media);
                break;
            case 'Lion':
                const { icefySourcerer } = await import('../providers/icefy/icefy.js');
                data = await icefySourcerer(media);
                break;
            case 'Dove':
                const {xpassProvider} = await import('../providers/xpass/xpass.js')
                data = await xpassProvider(media)
                break;
            case 'Spider':
                const {VidNestProvider} = await import('../providers/vidnest/vidnest.js')
                data = await VidNestProvider(media)
                break;

            default:
                return { error: 'Unsupported server.' };
        }

        if (data?.sources?.length > 0 && Server !== "Dove") {
            cache.set(key, { data, timestamp: Date.now() });
        }

        return data;
    } catch (error) {
        console.error(error);
        return { error: 'An error occurred while fetching data.' };
    }
};