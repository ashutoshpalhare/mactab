import { useEffect, useState } from "react";

const KEYS = [
  ["AC", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
] as const;

export default function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");

  const evalExpr = (e: string) => {
    const s = e.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
    try {
      // eslint-disable-next-line no-new-func
      const r = Function(`"use strict"; return (${s})`)();
      return String(Number(r.toFixed(10)));
    } catch {
      return "Error";
    }
  };

  const press = (k: string) => {
    if (k === "AC") { setDisplay("0"); setExpr(""); return; }
    if (k === "=") { const r = evalExpr(expr || display); setDisplay(r); setExpr(r === "Error" ? "" : r); return; }
    if (k === "±") { setDisplay(String(-Number(display))); return; }
    if (k === "%") { setDisplay(String(Number(display) / 100)); return; }
    if (/[+\-×÷−]/.test(k)) {
      setExpr((e) => (e || display) + k);
      setDisplay(k);
      return;
    }
    setDisplay((d) => (d === "0" || /[+\-×÷−]/.test(d) ? k : d + k));
    setExpr((e) => e + k);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, string> = { "*": "×", "/": "÷", "-": "−", Enter: "=", "=": "=", Backspace: "AC", Escape: "AC" };
      const k = map[e.key] ?? (/[\d.+]/.test(e.key) ? e.key : null);
      if (k) { e.preventDefault(); press(k); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="h-full p-3 flex flex-col gap-2 bg-black/40">
      <div className="flex-1 flex items-end justify-end pr-3 pb-2 text-white text-5xl font-light overflow-hidden">
        <span className="truncate">{display}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {KEYS.flat().map((k, i) => {
          const wide = k === "0";
          const op = /[+\-×÷−=]/.test(k);
          const fn = ["AC","±","%"].includes(k);
          return (
            <button
              key={i}
              onClick={() => press(k)}
              className={`h-14 rounded-full text-xl font-medium transition active:scale-95 ${wide ? "col-span-2 !rounded-full text-left pl-6" : ""} ${
                op ? "bg-orange-500 text-white" : fn ? "bg-white/30 text-black dark:text-white" : "bg-neutral-700 text-white"
              }`}
            >
              {k}
            </button>
          );
        })}
      </div>
    </div>
  );
}
