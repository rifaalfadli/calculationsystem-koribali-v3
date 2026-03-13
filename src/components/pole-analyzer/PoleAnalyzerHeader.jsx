import { ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeaderCalculationPage({ onResetAll }) {
  const navigate = useNavigate();

  return (
    <div
      className="
        bg-gradient-to-r from-[#0d3b66] to-[#0d3b66]
        shadow-lg
        sticky top-[64px] z-30 
        px-12 py-[18px]
        hp:px-4 hp:py-3 hp:top-[64px]
      "
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 hp:gap-2">
          <button
            onClick={() => navigate("/calculation")}
            className="
              flex items-center gap-2
              bg-none
              text-white
              px-5 py-2.5
              hp:px-4 hp:py-2
              rounded-lg hp:rounded-md
              font-semibold
              text-sm hp:text-xs
              shadow-sm
              border border-white/20
              hover:bg-white/10 hover:shadow-md active:scale-95 
              transition-all duration-200 ease-out
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Calculation
          </button>
        </div>

        <button
          onClick={onResetAll}
          className="
            flex items-center gap-2
            bg-gray-200 text-[#0d3b66]
            px-7 py-3
            hp:px-4 hp:py-2.5
            rounded-lg hp:rounded-md
            font-semibold
            text-sm hp:text-xs
            shadow-sm
            hover:bg-gray-300 hover:shadow-md
            active:scale-95
            transition-all duration-200 ease-out
          "
        >
          <RotateCcw className="w-5 h-5 hp:w-4 hp:h-4" />

          <span className="hp:hidden">Reset All</span>
          <span className="hidden hp:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}
