import {
  RotateCcw,
  ChevronRight,
  FileText,
  Settings,
  Circle,
  DoorOpen,
  CheckCircle,
  CircleDashed,
  Square,
  Layers,
} from "lucide-react";

export function ConditionInput({
  projectType,
  condition,
  onUpdate,
  onNext,
  errors,
}) {
  // OPTIONS: Pole input method (standard or custom)
  const options = [
    {
      id: "standard",
      title: "Standard Input",
      desc: "Predefined configurations for common pole types",
      icon: FileText,
    },
    {
      id: "custom",
      title: "Custom Input",
      desc: "Advanced configuration with detailed specifications",
      icon: Settings,
    },
  ];

  // OPTIONS: Available design standards based on selected project type
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

  // Reset all condition fields
  const handleReset = () => {
    onUpdate({
      designStandard: "",
      windSpeed: "",
      method: "",
      openingEnabled: false,
      baseplateEnabled: false,
      foundationEnabled: false,
    });
  };

  // Function to helper class input
  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-lg outline-none transition-all border text-sm
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
      <div className="p-6 shadow-sm space-y-6 hp:space-y-4 hp:p-4">
        {/* STANDARD AND CONDITION */}
        <div>
          <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-sm font-medium hp:text-xs hp:gap-1">
            <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4"></div>
            Standard and Condition
          </h3>
          <div className="bg-white p-5 rounded-xl border border-gray-200 hp:px-4 hp:py-5 hp:rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8 hp:gap-y-6">
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
                    className={`${inputClass(errors.windSpeed)} pr-12 hp:px-3`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black-400 hp:text-xs">
                    m/s
                  </span>
                </div>
                <ErrorText show={errors.windSpeed} text="Required field" />
              </div>

              {/* FIELD : Air Density Input */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                  Air Density
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={condition.airDensity}
                    onChange={(e) => onUpdate({ airDensity: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.airDensity)} hp:px-3`}
                  />
                </div>
                <ErrorText show={errors.airDensity} text="Required field" />
              </div>
            </div>
          </div>
        </div>

        {/* POLE INPUT TYPE */}
        <div>
          <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-sm font-medium hp:text-xs hp:gap-1">
            <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4"></div>
            Pole Input Type
          </h3>
          <div className="bg-white p-5 rounded-xl border border-gray-200 hp:px-4 hp:py-5 hp:rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option) => {
                const Icon = option.icon;
                const isActive = condition.method === option.id;

                return (
                  <div
                    key={option.id}
                    onClick={() =>
                      onUpdate({
                        method: option.id,
                      })
                    }
                    className={`
                relative cursor-pointer rounded-lg border p-4
                transition-all duration-200
                ${
                  isActive
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }
              `}
                  >
                    {/* Circle Indicator */}
                    <div className="absolute top-4 right-4">
                      {isActive ? (
                        <CheckCircle size={21} className="text-blue-600" />
                      ) : (
                        <Circle size={21} className="text-slate-400" />
                      )}
                    </div>

                    <div className="flex items-start gap-4">
                      <div
                        className={`
                    p-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "bg-slate-100 text-slate-500"
                    }
                  `}
                      >
                        <Icon size={18} />
                      </div>

                      <div>
                        <p className="font-semibold text-[14px] text-slate-800">
                          {option.title}
                        </p>
                        <p className="text-[12px] text-slate-500 mt-1">
                          {option.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ADDITIONAL COMPONENT */}
        <div>
          <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-sm font-medium">
            <div className="w-1 h-5 bg-[#3399cc] rounded-full"></div>
            Additional Component
          </h3>

          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="grid md:grid-cols-3 gap-6">
              {/* OPENING */}
              <div
                onClick={() =>
                  onUpdate({
                    openingEnabled: !condition.openingEnabled,
                  })
                }
                className={`cursor-pointer relative overflow-hidden rounded-xl border-2 p-5 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]
                ${
                  condition.openingEnabled
                    ? "border-blue-500 bg-white shadow-sm ring-1 ring-blue-50"
                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${condition.openingEnabled ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"}`}
                    >
                      <DoorOpen size={16} />
                    </div>

                    <div>
                      <p
                        className={`text-sm font-medium ${condition.openingEnabled ? "text-slate-900" : "text-slate-500"}`}
                      >
                        Opening Part
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate({
                        openingEnabled: !condition.openingEnabled,
                      });
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      condition.openingEnabled ? "bg-blue-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        condition.openingEnabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* BASEPLATE */}
              <div
                onClick={() =>
                  onUpdate({
                    baseplateEnabled: !condition.baseplateEnabled,
                  })
                }
                className={`cursor-pointer relative overflow-hidden rounded-xl border-2 p-5 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]
                ${
                  condition.baseplateEnabled
                    ? "border-blue-500 bg-white shadow-sm ring-1 ring-blue-50"
                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${condition.baseplateEnabled ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"}`}
                    >
                      <Square size={16} />
                    </div>

                    <div>
                      <p
                        className={`text-sm font-medium ${condition.baseplateEnabled ? "text-slate-900" : "text-slate-500"}`}
                      >
                        Basepalte
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate({
                        baseplateEnabled: !condition.baseplateEnabled,
                      });
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      condition.baseplateEnabled
                        ? "bg-blue-500"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        condition.baseplateEnabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* FOUNDATION */}
              <div
                onClick={() =>
                  onUpdate({
                    foundationEnabled: !condition.foundationEnabled,
                  })
                }
                className={`cursor-pointer relative overflow-hidden rounded-xl border-2 p-5 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]
                ${
                  condition.foundationEnabled
                    ? "border-blue-500 bg-white shadow-sm ring-1 ring-blue-50"
                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${condition.foundationEnabled ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"}`}
                    >
                      <Layers size={16} />
                    </div>

                    <div>
                      <p
                        className={`text-sm font-medium ${condition.foundationEnabled ? "text-slate-900" : "text-slate-500"}`}
                      >
                        Foundation
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate({
                        foundationEnabled: !condition.foundationEnabled,
                      });
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      condition.foundationEnabled
                        ? "bg-blue-500"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        condition.foundationEnabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
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
            Finish
            <ChevronRight className="w-5 h-5 hp:w-4 hp:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
