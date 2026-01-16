import { Moon, Sun } from "lucide-react";

const ThemeToggle = ({ dark, setDark }) => {
  return (
    <button
      onClick={() => setDark(!dark)}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold transition
        ${dark
          ? "bg-white text-slate-900 border-white/30 hover:bg-slate-100"
          : "bg-slate-900 text-white border-slate-800 hover:bg-slate-800"}
      `}
    >
      {dark ? (
        <>
          <Sun size={16} className="text-yellow-500" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon size={16} className="text-sky-400" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
