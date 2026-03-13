import { RotateCcw, ChevronDown } from "lucide-react";

export function ConditionInput({
  projectType,
  condition,
  onUpdate,
  onNext,
  errors,
}) {
  // Reset all condition fields
  const handleReset = () => {
    onUpdate({
      designStandard: "",
      windSpeed: "",
    });
  };

  const designStandardOptions = {
    acemast: [
      { value: "act", label: "Standard Acts. (Law)" },
      { value: "v60", label: "V60" },
      { value: "tower", label: "Tower Standard" },
      { value: "haiden", label: "Haiden" },
    ],

    "lighting-pole": [
      { value: "v60", label: "V60" },
      { value: "jil", label: "JIL" },
      { value: "haiden", label: "Haiden" },
    ],

    signboard: [
      { value: "v60", label: "V60" },
      { value: "signboard", label: "Signboard" },
    ],

    multiple: [
      { value: "v60", label: "V60" },
      { value: "jil", label: "JIL" },
      { value: "haiden", label: "Haiden" },
    ],
  };
  // Function to helper class input
  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-lg outline-none transition-all border text-sm pr-12
  ${
    hasError
      ? "border border-red-500 bg-[#fff5f5] ring-1 ring-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  } hp:py-2 hp:pl-2 hp:pr-10 hp:rounded-md hp:text-xs`;

  // Function to helper text error
  const ErrorText = ({ show, text }) =>
    show ? (
      <div className="absolute left-0 -bottom-5 flex items-center gap-1 text-[11px] text-red-500 hp:text-[9px] hp:-bottom-4">
        <span>*{text}</span>
      </div>
    ) : null;

  return (
    <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 hp:rounded-b-xl">
      {/* FORM CARD WRAPPER */}
      <div className="p-6 shadow-sm hp:p-4">
        {/* 2-Column Grid (Responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 hp:gap-y-6">
          {/* FIELD : Design Standard Dropdown */}
          <div className="relative">
            <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
              Design Standard
            </label>
            <select
              value={condition.designStandard}
              onChange={(e) => onUpdate({ designStandard: e.target.value })}
              className={`${inputClass(errors.designStandard)} min-h-[42px]`}
            >
              <option value="" disabled>
                Select Design Standard
              </option>

              {(designStandardOptions[projectType] || []).map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <ErrorText show={errors.designStandard} text="Required field" />
          </div>

          {/* FIELD : Design Wind Speed Input */}
          <div className="relative">
            <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
              Design Wind Speed
            </label>
            <div className="relative">
              <input
                type="number"
                value={condition.windSpeed}
                onChange={(e) => onUpdate({ windSpeed: e.target.value })}
                onWheel={(e) => e.target.blur()}
                className={`${inputClass(errors.windSpeed)} hp:px-3`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black-400 hp:text-xs">
                m/s
              </span>
            </div>
            <ErrorText show={errors.windSpeed} text="Required field" />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 border-t border-gray-200"></div>

        {/* FOOTER: LEFT (Reset Button) & RIGHT (Next Input) */}
        <div className="flex justify-between items-center pt-6 hp:pt-4">
          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-7 py-2.5 bg-[#eef2f6] text-[#0d3b66] text-sm
            border-2 border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium hp:text-xs hp:px-[22px] hp:py-[10px]"
          >
            <RotateCcw className="w-5 h-5 hp:w-4 hp:h-4" />
            Reset
          </button>

          {/* Next Input Button */}
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-7 py-2.5
            bg-gradient-to-r from-[#0d3b66] to-[#3399cc]
            text-white rounded-lg text-sm
            hover:brightness-110 transition-all shadow-sm font-medium hp:text-xs hp:px-[22px] hp:py-[10px]"
          >
            Next Input
            <ChevronDown className="w-5 h-5 hp:w-4 hp:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
