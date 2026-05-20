import { getNumericError } from "../../utils/pole-analyzer";

// IMPORT 3 IMAGE
const onGlImg = "/images/on-gl.svg";
const upperGlImg = "/images/upper-gl.svg";
const underGlImg = "/images/under-gl.svg";

const GROUND_OPTIONS = [
  { id: "onGL", label: "On GL", img: onGlImg },
  { id: "upperGL", label: "Upper GL", img: upperGlImg },
  { id: "underGL", label: "Under GL", img: underGlImg },
];

export function StructuralDesign({ structuralDesign, onUpdate, errors }) {
  const { lowestStep, lowestStepMode, overDesign } = structuralDesign;

  // =========================
  // HELPER STYLE
  // =========================
  const inputClass = (hasError, disabled) =>
    `w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm outline-none transition-all border min-h-[42px]
  ${
    disabled
      ? "bg-gray-100 border-gray-200 text-gray-400"
      : hasError
        ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
        : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  } hp:pl-2 hp:py-2 hp:rounded-md hp:text-xs`;

  const ErrorText = ({ show, text }) =>
    show ? (
      <div className="absolute left-0 -bottom-5 flex items-center gap-1 text-[11px] text-red-500 hp:text-[9px] hp:-bottom-4">
        *{text}
      </div>
    ) : null;

  // =========================
  // HANDLER
  // =========================
  const handleModeChange = (mode) => {
    onUpdate({
      lowestStepMode: mode,
      lowestStep: mode === "onGL" ? "0" : "",
    });
  };

  // =========================
  // UI
  // =========================
  return (
    <div>
      <div className="bg-white border border-gray-200 p-5 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-6">
          {/* ── Ground Position Cards ── */}
          <div>
            <label className="block text-xs md:text-sm text-gray-700 mb-3">
              Select Ground Position
            </label>

            <div className="grid grid-cols-3 gap-3">
              {GROUND_OPTIONS.map((opt) => {
                const isActive = lowestStepMode === opt.id;
                const isOnGL = opt.id === "onGL";
                const disabled = isOnGL || !isActive;

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleModeChange(opt.id)}
                    className={`flex flex-col gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all
                      ${
                        isActive
                          ? "border-[#3399cc] bg-[#f0f8ff]"
                          : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    {/* Label */}
                    <p
                      className={`text-xs md:text-sm font-semibold
                        ${isActive ? "text-[#0d3b66]" : "text-gray-400"}`}
                    >
                      {opt.label}
                    </p>

                    {/* Diagram */}
                    <div className="h-44 md:h-52 flex items-center justify-center">
                      <img
                        src={opt.img}
                        alt={opt.label}
                        className={`h-full object-contain transition-all
                          ${!isActive ? "opacity-40" : ""}`}
                      />
                    </div>

                    {/* Lowest Height input */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <label
                        className={`block text-xs md:text-sm mb-1 md:mb-2
                          ${isActive ? "text-gray-700" : "text-gray-300"}`}
                      >
                        Lowest Height
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={isOnGL ? "0" : isActive ? lowestStep : ""}
                          disabled={disabled}
                          placeholder={
                            isActive && !isOnGL ? "Input height" : "—"
                          }
                          onChange={(e) =>
                            !disabled &&
                            onUpdate({ lowestStep: e.target.value })
                          }
                          onWheel={(e) => e.target.blur()}
                          className={`${inputClass(errors.lowestStep && isActive, disabled)} pr-7`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-400">
                          mm
                        </span>
                      </div>
                      {isActive && errors.lowestStep && (
                        <p className="text-[10px] text-red-500 mt-1">
                          *{getNumericError(lowestStep)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Overdesign Factor ── */}
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
              className={`${inputClass(errors.overDesign, false)} w-full`}
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
