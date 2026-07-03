const GOOGLE_APPS = [
  { name: "Gmail", url: "https://mail.google.com", color: "#ea4335" },
  { name: "Search", url: "https://google.com", color: "#4285f4" },
  { name: "Drive", url: "https://drive.google.com", color: "#0f9d58" },
  { name: "Docs", url: "https://docs.google.com", color: "#4285f4" },
  { name: "Sheets", url: "https://sheets.google.com", color: "#0f9d58" },
  { name: "Slides", url: "https://slides.google.com", color: "#f4b400" },
  { name: "Keep", url: "https://keep.google.com", color: "#fbbc04" },
  { name: "Calendar", url: "https://calendar.google.com", color: "#4285f4" },
  { name: "Tasks", url: "https://tasks.google.com", color: "#1a73e8" },
  { name: "Maps", url: "https://maps.google.com", color: "#34a853" },
  { name: "Photos", url: "https://photos.google.com", color: "#4285f4" },
  { name: "YouTube", url: "https://youtube.com", color: "#ff0000" },
  { name: "Translate", url: "https://translate.google.com", color: "#4285f4" },
  { name: "Meet", url: "https://meet.google.com", color: "#00897b" },
  { name: "Contacts", url: "https://contacts.google.com", color: "#4285f4" },
  { name: "News", url: "https://news.google.com", color: "#1a73e8" },
  { name: "Finance", url: "https://google.com/finance", color: "#0f9d58" },
  { name: "Earth", url: "https://earth.google.com", color: "#1a73e8" },
];

export default function GoogleAppsApp() {
  return (
    <div className="h-full overflow-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Google</h1>
      <p className="text-sm opacity-60 mb-5">All your Google apps in one place</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {GOOGLE_APPS.map((a) => (
          <a key={a.name} href={a.url} target="_blank" rel="noreferrer"
            className="aspect-square rounded-2xl flex flex-col items-center justify-center text-white text-xs font-semibold text-center p-2 hover:scale-105 transition shadow-lg"
            style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}bb)` }}>
            <div className="w-9 h-9 rounded-xl bg-white/20 mb-1.5 flex items-center justify-center text-base font-bold">{a.name[0]}</div>
            {a.name}
          </a>
        ))}
      </div>
    </div>
  );
}
