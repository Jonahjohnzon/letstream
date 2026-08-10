"use client";
import React, { useState, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import { useRouter } from "nextjs-toploader/app";
import Loading from "@/app/Loading";
import Apicore from "@/app/ApiCore";
import { History, saveToRecentlyWatched } from "@/app/history";
import { IoArrowBack } from "react-icons/io5";
import Popup from "@/app/Popup";

const Stream = ({ id, type, season, eps }) => {
  const api = new Apicore();
  const router = useRouter();

  const [selectedApi, setSelectedApi] = useState("SERVER");
  const [arr, setArry] = useState([]);
  const [name, setName] = useState();
  const [episodeLoading, setEpisodeLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);

  /* ================= HISTORY ================= */
  const GET = async () => {
    let Detail;
    if (type === "movie") {
      Detail = await api.get(`/3/movie/${id}?language=en-US`);
    } else {
      Detail = await api.get(`/3/tv/${id}?language=en-US`);
    }

    const historyBody = {
      id: Detail?.id,
      media_type: type,
      poster_path: Detail?.poster_path,
      name: Detail?.name,
      original_name: Detail?.original_name,
      title: Detail?.title,
      vote_average: Detail?.vote_average,
      season,
      episode: eps,
    };

    History(historyBody);
    saveToRecentlyWatched(historyBody);
  };

  /* ================= DOWNLOAD ================= */
  const Download = () => {
    if (type === "movie") {
      window.open(`https://db.screenopps.com/db/movie/${id}`, "_blank");
    } else {
      window.open(
        `https://db.screenopps.com/db/tv/${id}/${season}/${eps}`,
        "_blank"
      );
    }
  };

  /* ================= EPISODES ================= */
  const GetSeason = async () => {
    setEpisodeLoading(true);
    try {
      const currentDate = new Date();
      const response = await api.get(
        `https://api.themoviedb.org/3/tv/${id}/season/${season}?language=en-US`
      );

      const result = response?.episodes.filter((ep) => {
        const airDate = ep?.air_date ? new Date(ep.air_date) : null;
        return airDate && airDate < currentDate;
      });

      setArry(Array.from({ length: result.length }, (_, i) => i + 1));
      setName(response?.name);
    } catch (err) {
      console.log(err);
    } finally {
      setEpisodeLoading(false);
    }
  };

  /* ================= STREAM SERVERS ================= */
  const StreamApi = [
    {
      Name: "SERVER",
      scrMovie: `https://player.cinezo.live/embed/movie/${id}?autoplay=false&poster=true&chromecast=false&servericon=true&setting=false&pip=true&font=Roboto&fontcolor=6f63ff&fontsize=20&opacity=0.5&primarycolor=e8b86d&secondarycolor=0a0a12&iconcolor=ffffff`,
      scrSeries: `https://player.cinezo.live/embed/tv/${id}/${season}/${eps}?autoplay=false&poster=true&chromecast=false&servericon=true&setting=false&pip=true&font=Roboto&fontcolor=6f63ff&fontsize=20&opacity=0.5&primarycolor=e8b86d&secondarycolor=0a0a12&iconcolor=ffffff`,
      id: 0,
    },
    {
      Name: "SERVER 1",
      scrMovie: `https://vidfast.pro/movie/${id}`,
      scrSeries: `https://vidfast.pro/tv/${id}/${season}/${eps}`,
      id: 1,
    },
    {
      Name: "SERVER 2",
      scrMovie: `https://vidnest.fun/movie/${id}`,
      scrSeries: `https://vidnest.fun/tv/${id}/${season}/${eps}`,
      id: 2,
    },
    {
      Name: "SERVER 3",
      scrMovie: `https://vidlink.pro/movie/${id}`,
      scrSeries: `https://vidlink.pro/tv/${id}/${season}/${eps}`,
      id: 3,
    },
  ];

  const currentApi =
    StreamApi.find((api) => api.Name === selectedApi) || StreamApi[0];

  const iframeSrc =
    type === "tv" ? currentApi.scrSeries : currentApi.scrMovie;

  /* ================= EFFECTS ================= */
  useEffect(() => {
    GET();
    if (type === "tv") GetSeason();
    else setEpisodeLoading(false);

    const savedApi = localStorage.getItem("selectedApi");
    if (savedApi) setSelectedApi(savedApi);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedApi", selectedApi);
    setIframeLoading(true); // 🔥 SHOW LOADING WHEN SERVER CHANGES
  }, [selectedApi, eps, season]);

  /* ================= PAGE LOADING ================= */
  if (episodeLoading) return <Loading />;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <Popup words="IF VIDEO DOESN'T PLAY, TRY SWITCHING SERVER" />

      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between w-[90%] mx-auto mt-4 z-50">
        <div
          className="text-4xl cursor-pointer"
          onClick={() => {
            window.open("https://omg10.com/4/10438662");
            router.push(`/details/${type}/${id}/${season}`);
          }}
        >
          <IoArrowBack />
        </div>

        {name && <p className="hidden md:block text-xl font-bold">{name}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={Download}
            className="px-4 py-2 border border-white rounded-md"
          >
            DOWNLOAD
          </button>

          {type === "tv" && (
            <div className="relative">
              <button
                className="px-4 py-2 border border-white rounded-md flex items-center"
                onClick={() => {
                  document
                    .getElementById("episodeDropdown")
                    .classList.toggle("hidden");
                }}
              >
                EP {eps} <FaAngleDown className="ml-2" />
              </button>

              <div
                id="episodeDropdown"
                className="absolute hidden max-h-60 overflow-y-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-slate-700 bg-black border border-white mt-2 w-40"
              >
                {arr.map((ep) => (
                  <div
                    key={ep}
                    className={`px-4 py-2 cursor-pointer ${
                      ep === eps ? "bg-gray-700" : ""
                    }`}
                    onClick={() => {
                      window.open("https://omg10.com/4/10438662");
                      router.push(`/stream/tv/${id}/${season}/${ep}`);
                    }}
                  >
                    EPISODE {ep}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SERVER SELECT */}
          <div className="relative">
            <button
              className="px-4 py-2 border border-white rounded-md flex items-center"
              onClick={() => {
                document
                  .getElementById("serverDropdown")
                  .classList.toggle("hidden");
              }}
            >
              {selectedApi} <FaAngleDown className="ml-2" />
            </button>

            <div
              id="serverDropdown"
              className="absolute hidden max-h-60 overflow-y-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-slate-700 bg-black border border-white mt-2 w-40"
            >
              {StreamApi.map((api) => (
                <div
                  key={api.id}
                  className={`px-4 py-2 cursor-pointer ${
                    api.Name === selectedApi ? "bg-gray-700" : ""
                  }`}
                  onClick={() => {
                    setSelectedApi(api.Name);
                    document
                      .getElementById("serverDropdown")
                      .classList.add("hidden");
                  }}
                >
                  {api.Name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* IFRAME */}
      <div className="relative flex-1 w-full mt-4">


        <iframe
          src={iframeSrc}
          className="w-full h-full"
          allowFullScreen
          referrerPolicy="origin"
          onLoad={() => setIframeLoading(false)}
        />
      </div>
    </div>
  );
};

export default Stream;
