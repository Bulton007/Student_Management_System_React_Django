import { useTheme } from "../../context/ThemeContext";

const StatsCard = ({ title, value, icon }) => {
  const { dark } = useTheme();

  return (
    <div
      className={`
        rounded-2xl border shadow-sm p-5 transition duration-200
        ${dark
          ? "bg-slate-900 text-white border-slate-700"
          : "bg-white text-slate-900 border-gray-200"}
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p
            className={`text-sm font-medium ${
              dark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </p>

          <h2 className="text-3xl font-black mt-1">{value}</h2>
        </div>

        <div
          className={`
            w-12 h-12 flex items-center justify-center rounded-2xl
            ${dark ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900"}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
