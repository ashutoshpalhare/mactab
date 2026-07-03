const AI_APPS = [
  { name: "ChatGPT", url: "https://chat.openai.com", color: "#10a37f" },
  { name: "Gemini", url: "https://gemini.google.com", color: "#4285f4" },
  { name: "Claude", url: "https://claude.ai", color: "#c96442" },
  { name: "Perplexity", url: "https://perplexity.ai", color: "#20808d" },
  { name: "Grok", url: "https://grok.x.ai", color: "#000000" },
  { name: "Copilot", url: "https://copilot.microsoft.com", color: "#0078d4" },
  { name: "DeepSeek", url: "https://chat.deepseek.com", color: "#4d6bff" },
  { name: "NotebookLM", url: "https://notebooklm.google.com", color: "#1a73e8" },
  { name: "AI Studio", url: "https://aistudio.google.com", color: "#a142f4" },
  { name: "Mistral", url: "https://chat.mistral.ai", color: "#ff7000" },
  { name: "Poe", url: "https://poe.com", color: "#5436da" },
  { name: "You.com", url: "https://you.com", color: "#5f2eea" },
];

export default function AIHubApp() {
  return (
    <div className="h-full overflow-auto p-6">
      <h1 className="text-2xl font-bold mb-1">AI Hub</h1>
      <p className="text-sm opacity-60 mb-5">Launch your favourite AI assistants</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {AI_APPS.map((a) => (
          <a key={a.name} href={a.url} target="_blank" rel="noreferrer"
            className="group aspect-square rounded-2xl flex flex-col items-center justify-center text-white text-sm font-semibold text-center p-3 hover:scale-105 transition shadow-lg"
            style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}bb)` }}>
            <div className="w-10 h-10 rounded-xl bg-white/20 mb-2 flex items-center justify-center text-lg font-bold">
              {a.name[0]}
            </div>
            {a.name}
          </a>
        ))}
      </div>
    </div>
  );
}
