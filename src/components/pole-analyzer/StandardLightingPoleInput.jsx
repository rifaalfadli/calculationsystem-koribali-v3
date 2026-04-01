import React from "react";
import { RotateCcw } from "lucide-react";

export function PoleBasicForm({ poleBasic, onUpdate }) {
  const poleTypes = [
    { id: "IS", label: "Type-I (IS)" },
    { id: "LS", label: "Type-L (LS)" },
    { id: "TS", label: "Type-T (TS)" },
    { id: "IA", label: "Type-I (IA)" },
    { id: "LA", label: "Type-L (LA)" },
    { id: "TA", label: "Type-T (TA)" },
  ];

  // ================= Height Options Semua Pole Types =================
  const HEIGHT_TYPE_S = {
    onGL: [
      { id: "8", label: "8.0" },
      { id: "10", label: "10.0" },
      { id: "12", label: "12.0" },
    ],
    underGL: [
      { id: "8U", label: "8.3" },
      { id: "10U", label: "10.3" },
      { id: "12U", label: "12.3" },
    ],
  };

  const HEIGHT_TYPE_A = {
    onGL: [
      { id: "4.5", label: "4.5" },
      { id: "5", label: "5.0" },
      { id: "8", label: "8.0" },
      { id: "10", label: "10.0" },
      { id: "12", label: "12.0" },
    ],
    underGL: [
      { id: "4.8", label: "4.8" },
      { id: "5.3", label: "5.3" },
      { id: "8.3", label: "8.3" },
      { id: "10.3", label: "10.3" },
      { id: "12.3", label: "12.3" },
    ],
  };

  // ================= Mapping Pole Type =================
  const heightOptionsByType = {
    IS: HEIGHT_TYPE_S,
    LS: HEIGHT_TYPE_S,
    TS: HEIGHT_TYPE_S,
    TA: HEIGHT_TYPE_S,
    LA: HEIGHT_TYPE_A,
    IA: HEIGHT_TYPE_A,
  };
  // ================= Ambil opsi height berdasarkan poleType yang dipilih =================
  const currentHeightOptions = heightOptionsByType[poleBasic.poleType] || {
    onGL: [],
    underGL: [],
  };

  return (
    <div className="bg-white px-6 pb-6 rounded-b-2xl hp:rounded-b-xl">
      {/* ================= Select Pole Type ================= */}
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
              const active = poleBasic.poleType === type.id;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    onUpdate({
                      poleType: type.id,
                      groundPosition: "",
                      height: "",
                    });
                  }}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all
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

      {/* ================= Ground Position + Height ================= */}
      <div className="mb-6">
        {/* Section Title */}
        <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-sm font-medium hp:text-xs hp:gap-1">
          <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4"></div>
          Ground Configuration
        </h3>

        {/* Outer Container */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            {/* ================= Ground Position ================= */}
            <div>
              <h4 className="block text-gray-700 text-sm mb-2 hp:text-xs hp:mb-1">
                Ground Position
              </h4>

              <div className="space-y-3">
                {[
                  { id: "onGL", label: "On GL" },
                  { id: "underGL", label: "Under GL" },
                ].map((item) => {
                  const active = poleBasic.groundPosition === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onUpdate({
                          groundPosition: item.id,
                          height: "",
                        });
                      }}
                      className={`cursor-pointer rounded-lg border px-4 py-3 transition-all flex items-center gap-3
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
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= Height ================= */}
            <div>
              <h4 className="block text-gray-700 text-sm mb-2 hp:text-xs hp:mb-1">
                Height of Structure
              </h4>

              {poleBasic.groundPosition ? (
                <select
                  value={poleBasic.height}
                  onChange={(e) => onUpdate({ height: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm min-h-[45px] focus:border-blue-500 outline-none transition-all bg-white hp:p-2 hp:rounded-md hp:text-xs"
                >
                  <option value="" disabled>
                    Select Height
                  </option>

                  {currentHeightOptions[poleBasic.groundPosition]?.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="border border-slate-200 rounded-lg px-5 bg-slate-50 min-h-[45px] flex items-center">
                  <p className="text-sm text-slate-400">
                    Select ground position first
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ================= Buttons ================= */}
      <div className="flex justify-between pt-6 border-t mt-8">
        <button
          type="button"
          onClick={() =>
            onUpdate({
              poleType: "",
              groundPosition: "",
              height: "",
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
