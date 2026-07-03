import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

const SERVICES = [
  { name: "Spotify", url: "https://open.spotify.com", color: "#1DB954" },
  { name: "YouTube Music", url: "https://music.youtube.com", color: "#ff0000" },
  { name: "Apple Music", url: "https://music.apple.com", color: "#fa2f4a" },
  { name: "SoundCloud", url: "https://soundcloud.com", color: "#ff5500" },
];

export default function MusicApp() {
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(70);
  return (
    <div className="h-full p-6 flex flex-col items-center">
      <div className="w-52 h-52 rounded-2xl shadow-2xl mb-4"
        style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899,#f97316)" }} />
      <div className="text-lg font-semibold">Now Playing</div>
      <div className="text-sm opacity-60 mb-4">Connect a service below</div>
      <div className="flex items-center gap-4 mb-4">
        <button className="opacity-80 hover:opacity-100"><SkipBack className="w-6 h-6" /></button>
        <button onClick={()=>setPlaying(p=>!p)} className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          {playing?<Pause className="w-6 h-6" />:<Play className="w-6 h-6 ml-0.5" />}
        </button>
        <button className="opacity-80 hover:opacity-100"><SkipForward className="w-6 h-6" /></button>
      </div>
      <div className="flex items-center gap-2 w-64 mb-6">
        <Volume2 className="w-4 h-4 opacity-70" />
        <input type="range" min={0} max={100} value={vol} onChange={(e)=>setVol(+e.target.value)} className="flex-1" />
      </div>
      <div className="grid grid-cols-2 gap-2 w-full">
        {SERVICES.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noreferrer"
            className="p-3 rounded-xl text-white text-sm font-medium text-center hover:scale-105 transition"
            style={{ background: s.color }}>{s.name}</a>
        ))}
      </div>
    </div>
  );
}
