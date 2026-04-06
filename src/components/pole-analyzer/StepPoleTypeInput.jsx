import React from "react";
import { RotateCcw } from "lucide-react";

export function StepPoleTypeInput({
  stepPoleStandard,
  onUpdate,
  errors,
  condition,
}) {
  const poleTypes = [{ id: "stepPole", label: "Stepped Pole" }];

  const combinationGroup = ["114.3", "139.8", "165.2"];

  const combinations = {
    114.3: ["40-10", "40-12", "40-14", "40-20", "40-24", "40-30"],
    139.8: [
      "50-10",
      "50-12",
      "50-14",
      "50-20",
      "50-24",
      "50-30",
      "50-34",
      "50-40",
    ],
    165.2: ["60-14", "60-20", "60-24", "60-30", "60-34", "60-40", "60-50"],
  };

  // ===== TPL (LOWER) BASED ON DIAMETER =====
  const TPL_MAP = {
    40: [3.5, 4.5, 6.0],
    50: [3.5, 4.5, 6.6],
    60: [3.7, 4.5, 5.0, 7.1],
  };

  // ===== TPU (UPPER) BASED ON HEIGHT =====
  function getTPu(height) {
    if (height === 10) return [2.3, 3.2];
    if (height === 12 || height === 14) return [3.2, 3.5];
    if (height === 20) return [3.2, 3.8];
    if (height === 24 || height === 30) return [2.8, 3.2, 4.2];
    if (height === 34) return [3.2, 4.2];
    if (height === 40) return [3.5, 4.5, 6.0];
    if (height === 50) return [3.5, 4.5, 6.6];

    return [];
  }

  const getThicknessOptions = () => {
    if (!stepPoleStandard.combination) {
      return { upper: [], lower: [] };
    }

    const [diameter, height] = stepPoleStandard.combination
      .split("-")
      .map(Number);

    return {
      upper: getTPu(height),
      lower: TPL_MAP[diameter] || [],
    };
  };

  const { upper: upperOptions, lower: lowerOptions } = getThicknessOptions();

  // Function to helper class input
  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-lg outline-none transition-all border text-sm pr-14 min-h-[42px]
  ${
    hasError
      ? "border border-red-500 bg-[#fff5f5] ring-1 ring-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  } hp:pl-2 hp:py-2  hp:rounded-md hp:text-xs`;

  // Function to helper text error
  const ErrorText = ({ show, text }) =>
    show ? (
      <div className="absolute left-0 -bottom-5 flex items-center gap-1 text-[11px] text-red-500 hp:text-[9px] hp:-bottom-4">
        <span>*{text}</span>
      </div>
    ) : null;

  return (
    <div className="bg-white px-6 pb-6 rounded-b-2xl hp:rounded-b-xl">
      <div className="mb-6">
        {/* Section Title */}
        <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-sm font-medium hp:text-xs hp:gap-1">
          <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4"></div>
          Select Pole Standard
        </h3>

        {/* Container */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {poleTypes.map((type) => {
              const active = stepPoleStandard.poleType === type.id;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      poleType: type.id,
                    })
                  }
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all
                    ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                        : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }
                  `}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      {stepPoleStandard.poleType === "stepPole" && (
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          {/* ================= LEFT ================= */}
          <div>
            <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-sm font-medium">
              <div className="w-1 h-5 bg-[#3399cc] rounded-full"></div>
              Pole Data
            </h3>

            <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
              {/* ===== Combination ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT : Radio */}
                <div>
                  <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                    Select Lower Pole Diameter
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    {combinationGroup.map((item) => {
                      const active = stepPoleStandard.combinationGroup === item;

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            onUpdate({
                              combinationGroup: item,
                              combination: "",
                            })
                          }
                          className={`w-full py-2 rounded-lg min-h-[42px] text-sm border transition 
                          ${
                            active
                              ? "bg-blue-50 border-blue-500 text-blue-600"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT : Select */}
                <div className="relative">
                  <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                    Select Pole Combination
                  </h4>

                  {stepPoleStandard.combinationGroup ? (
                    <div className="relative">
                      <select
                        value={stepPoleStandard.combination}
                        onChange={(e) =>
                          onUpdate({
                            combination: e.target.value,
                            upperThickness: "",
                            lowerThickness: "",
                          })
                        }
                        className={`${inputClass(errors.combination)} min-h-[42px]`}
                      >
                        <option value="" disabled>
                          Select Combination
                        </option>

                        {stepPoleStandard.combinationGroup &&
                          combinations[stepPoleStandard.combinationGroup].map(
                            (c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ),
                          )}
                      </select>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-lg px-5 bg-slate-50 min-h-[42px] flex items-center">
                      <p className="text-sm text-slate-400">
                        Select lower pole diameter first
                      </p>
                    </div>
                  )}

                  <ErrorText show={errors.combination} text="Required field" />
                </div>
              </div>

              {/* ===== Upper & Lower ===== */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 hp:px-4 hp:py-5 hp:rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  {/* Upper */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      {/* Thickness */}
                      <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                        Upper Pole Thickness
                      </h4>
                      {stepPoleStandard.combination ? (
                        <div className="relative">
                          <select
                            value={stepPoleStandard.upperThickness}
                            onChange={(e) =>
                              onUpdate({ upperThickness: e.target.value })
                            }
                            className={`${inputClass(
                              errors.upperThickness,
                            )} min-h-[42px]`}
                          >
                            <option value="" disabled>
                              Select Thickness
                            </option>

                            {upperOptions.map((t) => (
                              <option key={t} value={t}>
                                {t} mm
                              </option>
                            ))}
                          </select>
                          <ErrorText
                            show={errors.upperThickness}
                            text="Required field"
                          />
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-lg px-5 bg-slate-50 min-h-[42px] flex items-center">
                          <p className="text-sm text-slate-400">
                            Select pole combination first
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      {/* Length */}
                      <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                        Upper Pole Length
                      </h4>
                      <div className="relative">
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            placeholder="Input Length"
                            value={stepPoleStandard.upperLength}
                            onChange={(e) =>
                              onUpdate({ upperLength: e.target.value })
                            }
                            onWheel={(e) => e.target.blur()}
                            className={inputClass(errors.upperLength)}
                          />
                          <span className="absolute right-4 text-sm top-1/2 -translate-y-1/2 text-black-400 hp:text-xs">
                            mm
                          </span>
                        </div>
                        <ErrorText
                          show={errors.upperLength}
                          text="Required field"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lower */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      {/* Thickness */}
                      <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                        Lower Pole Thickness
                      </h4>
                      {stepPoleStandard.combination ? (
                        <div className="relative">
                          <select
                            value={stepPoleStandard.lowerThickness}
                            onChange={(e) =>
                              onUpdate({ lowerThickness: e.target.value })
                            }
                            className={`${inputClass(
                              errors.lowerThickness,
                            )} min-h-[42px]`}
                          >
                            <option value="" disabled>
                              Select Thickness
                            </option>

                            {lowerOptions.map((t) => (
                              <option key={t} value={t}>
                                {t} mm
                              </option>
                            ))}
                          </select>
                          <ErrorText
                            show={errors.lowerThickness}
                            text="Required field"
                          />
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-lg px-5 bg-slate-50 min-h-[42px] flex items-center">
                          <p className="text-sm text-slate-400">
                            Select pole combination first
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      {/* Length */}
                      <h4 className="block text-gray-700 text-sm mb-3 hp:text-xs hp:mb-1">
                        Lower Pole Length
                      </h4>
                      <div className="relative">
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            placeholder="Input Length"
                            value={stepPoleStandard.lowerLength}
                            onChange={(e) =>
                              onUpdate({ lowerLength: e.target.value })
                            }
                            onWheel={(e) => e.target.blur()}
                            className={inputClass(errors.lowerLength)}
                          />
                          <span className="absolute right-4 text-sm top-1/2 -translate-y-1/2 text-black-400 hp:text-xs">
                            mm
                          </span>
                        </div>

                        <ErrorText
                          show={errors.lowerLength}
                          text="Required field"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div>
            <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-sm font-medium">
              <div className="w-1 h-5 bg-[#3399cc] rounded-full"></div>
              {condition.baseplateEnabled
                ? "Base Type Pole Installation"
                : "Embedment Type Pole Installation"}
            </h3>

            <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
              {/* ===== EMBEDMENT MODE ===== */}
              {!condition.baseplateEnabled && (
                <div className="grid grid-cols-1">
                  {/* Embedment Length */}
                  <div className="relative">
                    <label className="block text-sm text-gray-700 mb-3">
                      Embedment Length
                    </label>

                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        placeholder="Input Length"
                        value={stepPoleStandard.embedmentLength}
                        onChange={(e) =>
                          onUpdate({
                            embedmentLength: e.target.value,
                          })
                        }
                        onWheel={(e) => e.target.blur()}
                        className={inputClass(errors.embedmentLength)}
                      />

                      <span className="absolute right-4 text-black-400 text-sm top-1/2 -translate-y-1/2 hp:text-xs">
                        mm
                      </span>
                    </div>

                    <ErrorText
                      show={errors.embedmentLength}
                      text="Required field"
                    />
                  </div>
                </div>
              )}

              {/* ===== BASEPLATE MODE ===== */}
              {condition.baseplateEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ================= Ground Position ================= */}
                  <div>
                    <h4 className="block text-sm text-gray-700 mb-3">
                      Ground Position
                    </h4>

                    <div className="space-y-3">
                      {[
                        { id: "onGL", label: "On GL" },
                        { id: "underGL", label: "Under GL" },
                      ].map((item) => {
                        const active =
                          stepPoleStandard.groundPosition === item.id;

                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              onUpdate({
                                groundPosition: item.id,
                              });
                            }}
                            className={`w-full cursor-pointer rounded-lg border px-4 py-2.5 transition-all flex items-center gap-3
                        ${
                          active
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }
                      `}
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
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ================= Height ================= */}
                  {stepPoleStandard.groundPosition === "underGL" && (
                    <div>
                      <label className="block text-sm text-gray-700 mb-3">
                        Height Depth
                      </label>

                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          placeholder="Input Length"
                          value={stepPoleStandard.heightDepth}
                          onChange={(e) =>
                            onUpdate({
                              heightDepth: e.target.value,
                            })
                          }
                          onWheel={(e) => e.target.blur()}
                          className={inputClass(errors.heightDepth)}
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                          mm
                        </span>

                        <ErrorText
                          show={errors.heightDepth}
                          text="Required field"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= RESET ================= */}
      <div className="flex justify-between pt-6 border-t">
        <button
          type="button"
          onClick={() =>
            onUpdate({
              combinationGroup: "",
              combination: "",
              upperThickness: "",
              upperLength: "",
              lowerThickness: "",
              lowerLength: "",
              embedmentLength: "",
              groundPosition: "",
              heightDepth: "",
            })
          }
          className="flex items-center text-sm gap-2 px-7 py-2.5 bg-[#eef2f6] text-[#0d3b66]
          border-2 border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium hp:text-xs hp:px-[22px] hp:py-[8px]"
        >
          <RotateCcw className="w-5 h-5 hp:w-4 hp:h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
