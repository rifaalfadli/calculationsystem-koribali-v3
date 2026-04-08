import { RotateCcw, ChevronRight, Calculator } from "lucide-react";

export function RTypeInput({
  opRType,
  onUpdate,
  errors,
  onCalculate,
  onNext,
  isCalculated,
  buttonLabel,
}) {
  // Reset all Opening Box Type fields
  const handleReset = () => {
    onUpdate({
      opWidth: "",
      opSurfaceHeight: "",
      opLength: "",
    });
  };

  // Function to helper class input
  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-lg outline-none transition-all text-sm border
    ${
      hasError
        ? "border border-red-500 bg-[#fff5f5] ring-1 ring-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-200"
        : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
    } hp:py-2 hp:px-3 hp:rounded-md hp:text-xs`;

  // Function to helper text error
  const ErrorText = ({ show, text }) =>
    show ? (
      <div className="absolute left-0 -bottom-5 flex items-center gap-1 text-[11px] text-red-500 hp:text-[9px] hp:-bottom-4">
        <span>*{text}</span>
      </div>
    ) : null;

  return (
    <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 hp:rounded-b-xl">
      <div className="p-6 shadow-sm space-y-6 hp:space-y-4 hp:p-4">
        {/* GRID 2 KOLOM */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* ================= LEFT : INPUT ================= */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 hp:px-4 hp:py-5 hp:rounded-lg">
            {/* STACK INPUT (VERTICAL) */}
            <div className="flex flex-col gap-5">
              {/* Opening Width */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Opening Width (b)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={opRType.opWidth}
                    onChange={(e) => onUpdate({ opWidth: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.opWidth)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm hp:text-xs">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.opWidth} text="Required field" />
              </div>

              {/* Opening Surface Height */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Opening Surface Height (HOp)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={opRType.opSurfaceHeight}
                    onChange={(e) =>
                      onUpdate({ opSurfaceHeight: e.target.value })
                    }
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.opSurfaceHeight)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm hp:text-xs">
                    mm
                  </span>
                </div>
                <ErrorText
                  show={errors.opSurfaceHeight}
                  text="Required field"
                />
              </div>

              {/* Opening Length */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Opening Length (LOp)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={opRType.opLength}
                    onChange={(e) => onUpdate({ opLength: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.opLength)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm hp:text-xs">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.opLength} text="Required field" />
              </div>
            </div>
          </div>

          {/* ================= IMAGE (1 ROW) ================= */}
          <div className="flex flex-col justify-center gap-6">
            {/* TOP VIEW */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center justify-center min-h-[218px] hover:shadow-sm transition">
              <img
                src="/images/opR-top-view.png"
                alt="Top View"
                className="h-44 object-contain"
              />
            </div>

            {/* SIDE VIEW */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center justify-center min-h-[218px] hover:shadow-sm transition">
              <img
                src="/images/op-side-view.png"
                alt="Side View"
                className="h-44 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* FOOTER */}
        <div className="flex justify-between items-center pt-4">
          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-7 py-2.5 bg-[#eef2f6] text-[#0d3b66] text-sm
            border-2 border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium hp:text-xs hp:px-[22px] hp:py-[10px]"
          >
            <RotateCcw className="w-5 h-5 hp:w-4 hp:h-4" />
            Reset
          </button>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* CALCULATE */}
            <button
              onClick={onCalculate}
              className="flex items-center gap-2 px-7 py-2.5
              border border-[#cbd5e1] text-[#0d3b66]
              rounded-lg text-sm hover:bg-[#f1f5f9] transition-all font-medium"
            >
              <Calculator className="w-5 h-5 hp:w-4 hp:h-4" />
              Calculate
            </button>

            {/* FINISH / MAKE REPORT */}
            <button
              onClick={onNext}
              disabled={!isCalculated}
              className={`
                flex items-center gap-2 px-7 py-2.5 rounded-lg text-sm font-medium
                transition-all

                ${
                  !isCalculated
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm"
                }
              `}
            >
              {buttonLabel}
              <ChevronRight className="w-5 h-5 hp:w-4 hp:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
