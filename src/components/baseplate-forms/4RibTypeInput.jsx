import { RotateCcw, ChevronRight, Calculator } from "lucide-react";

export function FourRibTypeInput({
  fourRibType,
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
      bl1: "",
      bl2: "",
      ap1: "",
      ap2: "",
      dab: "",
      nab: "",
      nabTensionSide: "",
      tb: "",
      hr: "",
      lr: "",
      tr: "",
      lrs: "",
      lk: "",
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
          {/* ================= TOP VIEW ================= */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 hp:px-4 hp:py-5 hp:rounded-lg">
            {/* INPUT */}
            <div className="grid grid-cols-2 gap-6">
              {/* Width of the Baseplate in the EW direction (BL1) */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Width of the Baseplate in the EW direction (BL1)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.bl1}
                    onChange={(e) => onUpdate({ bl1: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.bl1)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black-400 hp:text-xs">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.bl1} text="Required field" />
              </div>

              {/* Width of the Baseplate in the NS direction (BL2) */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Width of the Baseplate in the NS direction (BL2)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.bl2}
                    onChange={(e) => onUpdate({ bl2: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.bl2)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black-400 hp:text-xs">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.bl2} text="Required field" />
              </div>

              {/* Anchor pitch in the EW direction (Ap1) */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Anchor pitch in the EW direction (Ap1)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.ap1}
                    onChange={(e) => onUpdate({ ap1: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.ap1)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black-400 hp:text-xs">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.ap1} text="Required field" />
              </div>

              {/* Anchor pitch in the NS direction (Ap2) */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Anchor pitch in the NS direction (Ap2)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.ap2}
                    onChange={(e) => onUpdate({ ap2: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.ap2)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black-400 hp:text-xs">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.ap2} text="Required field" />
              </div>

              {/* Diameter of Anchor Bolt */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Diameter of Anchor Bolt
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.dab}
                    onChange={(e) => onUpdate({ dab: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.dab)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black-400 hp:text-xs">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.dab} text="Required field" />
              </div>

              {/* Number of anchor bolts (n) */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Number of anchor bolts (n)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.nab}
                    onChange={(e) => onUpdate({ nab: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.nab)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black-400 hp:text-xs">
                    pcs
                  </span>
                </div>
                <ErrorText show={errors.nab} text="Required field" />
              </div>

              {/* Number of anchor bolts on the tension side (n') */}
              <div className="col-span-2 relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Number of anchor bolts on the tension side (n')
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.nabTensionSide}
                    onChange={(e) =>
                      onUpdate({ nabTensionSide: e.target.value })
                    }
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.nabTensionSide)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black-400 hp:text-xs">
                    pcs
                  </span>
                </div>
                <ErrorText show={errors.nabTensionSide} text="Required field" />
              </div>
            </div>
          </div>

          {/* IMAGE TOP VIEW */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-center h-full hover:shadow-sm transition">
            <img
              src="/images/4rib-topview.png"
              alt="Baseplate 4 rib top view"
              className="max-h-[250px] object-contain"
            />
          </div>

          {/* ================= SIDE VIEW ================= */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 hp:px-4 hp:py-5 hp:rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              {/* Thickness of the Baseplate (Tb) */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Thickness of the Baseplate (Tb)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.tb}
                    onChange={(e) => onUpdate({ tb: e.target.value })}
                    className={`${inputClass(errors.tb)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.tb} text="Required field" />
              </div>

              {/* Height of the Rib Plate (Hr) */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Height of the Rib Plate (Hr)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.hr}
                    onChange={(e) => onUpdate({ hr: e.target.value })}
                    className={`${inputClass(errors.hr)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.hr} text="Required field" />
              </div>

              {/* Rib Plate scallop (Lrs) */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Rib Plate scallop (Lrs)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.lrs}
                    onChange={(e) => onUpdate({ lrs: e.target.value })}
                    className={`${inputClass(errors.lrs)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.lrs} text="Required field" />
              </div>

              {/* Weld leg length (Lk) */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Weld leg length (Lk)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.lk}
                    onChange={(e) => onUpdate({ lk: e.target.value })}
                    className={`${inputClass(errors.lk)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.lk} text="Required field" />
              </div>

              {/* Length of the Rib Plate (Lr) */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Length of the Rib Plate (Lr)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.lr}
                    onChange={(e) => onUpdate({ lr: e.target.value })}
                    className={`${inputClass(errors.lr)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.lr} text="Required field" />
              </div>

              {/* Thickness of the Rib Plate (Tr) */}
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
                  Thickness of the Rib Plate (Tr)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={fourRibType.tr}
                    onChange={(e) => onUpdate({ tr: e.target.value })}
                    className={`${inputClass(errors.tr)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.tr} text="Required field" />
              </div>
            </div>
          </div>

          {/* IMAGE SIDE VIEW */}
          <div className="bg-gray-50 border rounded-2xl p-4 flex items-center justify-center h-full hover:shadow-sm transition">
            <img
              src="/images/4rib-sideview.png"
              className="max-h-[150px] object-contain"
              alt="Baseplate 4 rib side view"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 border-t border-gray-200"></div>

        {/* FOOTER: LEFT (Reset Button) & RIGHT (Next Input) */}
        <div className="flex justify-between items-center pt-6 hp:pt-4">
          {/* LEFT */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-7 py-2.5 bg-[#eef2f6] text-[#0d3b66] text-sm
            border-2 border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium hp:text-xs hp:px-[22px] hp:py-[10px]"
          >
            <RotateCcw className="w-5 h-5 hp:w-4 hp:h-4" />
            Reset
          </button>

          {/* RIGHT GROUP */}
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
