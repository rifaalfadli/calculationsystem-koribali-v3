import { getNumericError } from "../../utils/pole-analyzer";

// IMPORT 3 IMAGE
const onGlImg = "/images/on-gl.svg";
const upperGlImg = "/images/upper-gl.svg";
const underGlImg = "/images/under-gl.svg";

export function StructuralDesign({ structuralDesign, onUpdate, errors }) {
  const { lowestStep, lowestStepMode, overDesign } = structuralDesign;

  // =========================
  // HELPER STYLE
  // =========================
  const inputClass = (hasError) =>
    `px-4 py-2.5 rounded-lg outline-none transition-all text-sm border min-h-[42px]
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  } hp:pl-2 hp:py-2  hp:rounded-md hp:text-xs`;

  const ErrorText = ({ show, text }) =>
    show ? (
      <div className="absolute left-0 -bottom-5 flex items-center gap-1 text-[11px] text-red-500 hp:text-[9px] hp:-bottom-4">
        *{text}
      </div>
    ) : null;

  // =========================
  // IMAGE MAPPING
  // =========================
  const imageMap = {
    onGL: onGlImg,
    upperGL: upperGlImg,
    underGL: underGlImg,
  };

  const currentImage = imageMap[lowestStepMode] || onGlImg;

  // =========================
  // HANDLER
  // =========================
  const handleModeChange = (mode) => {
    onUpdate({
      lowestStepMode: mode,
    });
  };

  const isOnGL = lowestStepMode === "onGL";

  // =========================
  // UI
  // =========================
  return (
    <div>
      <div className="bg-white border border-gray-200 p-5 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* ================= LEFT: VISUAL ================= */}
          <div>
            <label className="block text-sm text-gray-700 mb-3">
              Select Ground Position
            </label>

            {/* RADIO BUTTON STYLE */}
            <div className="flex gap-3 mb-4">
              {[
                { id: "onGL", label: "On GL" },
                { id: "upperGL", label: "Upper GL" },
                { id: "underGL", label: "Under GL" },
              ].map((opt) => {
                const active = lowestStepMode === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleModeChange(opt.id)}
                    className={`w-48 cursor-pointer text-sm rounded-lg border px-4 py-2.5 transition-all flex items-center gap-3
                        ${
                          active
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${active ? "border-blue-500" : "border-gray-400"}
                        `}
                    >
                      {active && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* IMAGE AREA */}
            <div className="flex justify-center gap-5 items-center bg-gray-50 border rounded-lg p-4 h-72 2040:h-80 overflow-hidden">
              {/* FLOATING INPUT (SEMUA MODE) */}
              {lowestStepMode && (
                <div className="flex flex-col justify-end pb-6 h-full">
                  <div
                    className="
                    flex flex-col
                  "
                  >
                    {/* LABEL */}
                    <span className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                      Lowest Height
                    </span>

                    {/* INPUT */}
                    <div className="relative">
                      <input
                        type="number"
                        value={lowestStep}
                        placeholder="Input Lowest Height"
                        disabled={isOnGL}
                        onChange={(e) =>
                          !isOnGL && onUpdate({ lowestStep: e.target.value })
                        }
                        onWheel={(e) => e.target.blur()}
                        className={`${inputClass(errors.lowestStep)} w-[200px] pr-7 ${
                          isOnGL ? "bg-gray-100 text-gray-400" : ""
                        }`}
                      />

                      {/* UNIT */}
                      <span className="absolute right-4 text-sm top-1/2 -translate-y-1/2 text-black-400 hp:text-xs">
                        m
                      </span>
                    </div>
                    <ErrorText
                      show={errors.lowestStep}
                      text={getNumericError(lowestStep)}
                    />
                  </div>
                </div>
              )}
              {/* IMAGE */}
              <img
                key={currentImage}
                src={currentImage}
                alt="pole"
                className="h-full object-contain transition-all duration-300"
              />
            </div>
          </div>

          {/* ================= RIGHT: OVERDESIGN ================= */}
          <div className="relative">
            <label className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
              Overdesign Factor
            </label>

            <input
              type="number"
              min={0}
              value={overDesign}
              onChange={(e) => onUpdate({ overDesign: e.target.value })}
              onWheel={(e) => e.target.blur()}
              className={`${inputClass(errors.overDesign)} w-full`}
            />

            <ErrorText
              show={errors.overDesign}
              text={getNumericError(overDesign)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
