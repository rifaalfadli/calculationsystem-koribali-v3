import { RotateCcw, ChevronRight, Calculator } from "lucide-react";
import { getNumericError } from "../../utils/pole-analyzer";

/**
 * Field mapping (engineering reference):
 * bl1 = Baseplate width (East-West)
 * bl2 = Baseplate width (North-South)
 * ap1 = Anchor pitch (East-West)
 * ap2 = Anchor pitch (North-South)
 * dab = Diameter of anchor bolt
 * nab = Number of anchor bolts
 * nabTensionSide = Number of anchor bolts on tension side
 * ribAngle = Rib Angle (θ)
 * tb = Baseplate thickness
 * hr = Rib plate height
 * lr = Rib plate length
 * tr = Rib plate thickness
 * lrs = Rib scallop length
 * lk = Weld leg length
 */

/**
 * Reusable Input Field Component
 * - Handles label, unit, error, and styling
 */
const InputField = ({
  label,
  value,
  onChange,
  error,
  unit = "mm",
  colSpan = "",
  min,
}) => {
  return (
    <div className={`relative ${colSpan}`}>
      <label className="block text-sm text-gray-700 mb-3 hp:text-xs hp:mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type="number"
          min={min ?? undefined}
          value={value}
          onChange={onChange}
          onWheel={(e) => e.target.blur()}
          className={`${getInputClass(error)} pr-12`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm hp:text-xs">
          {unit}
        </span>
      </div>

      <ErrorText show={error} text={getNumericError(value)} />
    </div>
  );
};

/**
 * Input styling helper
 */
const getInputClass = (hasError) => `
  w-full px-4 py-2.5 rounded-lg outline-none transition-all text-sm border
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200 focus:ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-[#3399cc]"
  }
  hp:py-2 hp:px-3 hp:rounded-md hp:text-xs
`;

/**
 * Inline error text (reusable)
 */
const ErrorText = ({ show, text }) => {
  if (!show) return null;

  return (
    <div className="absolute left-0 -bottom-5 text-[11px] text-red-500 hp:text-[9px] hp:-bottom-4">
      *{text}
    </div>
  );
};

export function EightRibTypeInput({
  eightRibType, // object of all input values
  onUpdate, // function to update state (partial update)
  errors,
  onCalculate,
  onNext,
  isCalculated,
  buttonLabel,
}) {
  /**
   * Reset all fields to initial empty state
   */
  const handleReset = () => {
    const emptyState = Object.keys(eightRibType).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    onUpdate(emptyState);
  };

  /**
   * Helper to bind input change
   */
  const handleChange = (field) => (e) => {
    onUpdate({ [field]: e.target.value });
  };

  return (
    <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 hp:rounded-b-xl">
      <div className="p-6 shadow-sm space-y-6 hp:space-y-4 hp:p-4">
        {/* ===== GRID LAYOUT ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* ===== TOP VIEW INPUT ===== */}
          <div className="p-5 rounded-xl border border-gray-200 hp:px-4 hp:py-5 hp:rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              {/* FIELD : Width of the Baseplate in the EW direction (BL1) */}
              <InputField
                label="Baseplate Width (EW) (BL1)"
                value={eightRibType.bl1}
                onChange={handleChange("bl1")}
                error={errors.bl1}
                min={0}
              />

              {/* FIELD : Width of the Baseplate in the NS direction (BL2) */}
              <InputField
                label="Baseplate Width (NS) (BL2)"
                value={eightRibType.bl2}
                onChange={handleChange("bl2")}
                error={errors.bl2}
                min={0}
              />

              {/* FIELD : Anchor pitch in the EW direction (Ap1) */}
              <InputField
                label="Anchor Pitch (EW) (Ap1)"
                value={eightRibType.ap1}
                onChange={handleChange("ap1")}
                error={errors.ap1}
                min={0}
              />

              {/* FIELD : Anchor pitch in the NS direction (Ap2) */}
              <InputField
                label="Anchor Pitch (NS) (Ap2)"
                value={eightRibType.ap2}
                onChange={handleChange("ap2")}
                error={errors.ap2}
                min={0}
              />

              {/* FIELD : Diameter of Anchor Bolt */}
              <InputField
                label="Anchor Bolt Diameter"
                value={eightRibType.dab}
                onChange={handleChange("dab")}
                error={errors.dab}
                min={0}
              />

              {/* FIELD : Number of anchor bolts (n) */}
              <InputField
                label="Number of Anchor Bolts (n)"
                value={eightRibType.nab}
                onChange={handleChange("nab")}
                error={errors.nab}
                unit="pcs"
                min={0}
              />

              {/* FIELD : Number of anchor bolts on the tension side (n') */}
              <InputField
                label="Anchor Bolts on Tension Side (n')"
                value={eightRibType.nabTensionSide}
                onChange={handleChange("nabTensionSide")}
                error={errors.nabTensionSide}
                unit="pcs"
                min={0}
              />

              {/* FIELD : Rib Angle (θ) */}
              <InputField
                label="Rib Angle (θ)"
                value={eightRibType.ribAngle}
                onChange={handleChange("ribAngle")}
                error={errors.ribAngle}
                unit="deg"
              />
            </div>
          </div>

          {/* IMAGE TOP VIEW */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-center h-full hover:shadow-sm transition">
            <img
              src="/images/8rib-topview.png"
              alt="8 rib baseplate top view"
              className="max-h-[250px] object-contain"
            />
          </div>

          {/* ===== SIDE VIEW INPUT ===== */}
          <div className="p-5 rounded-xl border border-gray-200 hp:px-4 hp:py-5 hp:rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              {/* FIELD : Thickness of the Baseplate (Tb) */}
              <InputField
                label="Baseplate Thickness (Tb)"
                value={eightRibType.tb}
                onChange={handleChange("tb")}
                error={errors.tb}
                min={0}
              />

              {/* FIELD : Height of the Rib Plate (Hr) */}
              <InputField
                label="Rib Plate Height (Hr)"
                value={eightRibType.hr}
                onChange={handleChange("hr")}
                error={errors.hr}
                min={0}
              />

              {/* FIELD : Rib Plate scallop (Lrs) */}
              <InputField
                label="Rib Plate Scallop (Lrs)"
                value={eightRibType.lrs}
                onChange={handleChange("lrs")}
                error={errors.lrs}
                min={0}
              />

              {/* FIELD : Weld leg length (Lk) */}
              <InputField
                label="Weld Leg Length (Lk)"
                value={eightRibType.lk}
                onChange={handleChange("lk")}
                error={errors.lk}
                min={0}
              />

              {/* FIELD : Length of the Rib Plate (Lr) */}
              <InputField
                label="Rib Plate Length (Lr)"
                value={eightRibType.lr}
                onChange={handleChange("lr")}
                error={errors.lr}
                min={0}
              />

              {/* FIELD : Thickness of the Rib Plate (Tr) */}
              <InputField
                label="Rib Plate Thickness (Tr)"
                value={eightRibType.tr}
                onChange={handleChange("tr")}
                error={errors.tr}
                min={0}
              />
            </div>
          </div>

          {/* IMAGE SIDE VIEW */}
          <div className="bg-gray-50 border rounded-2xl p-4 flex items-center justify-center h-full hover:shadow-sm transition">
            <img
              src="/images/8rib-sideview.png"
              alt="8 rib baseplate side view"
              className="max-h-[150px] object-contain"
            />
          </div>
        </div>

        {/* ===== FOOTER ACTIONS ===== */}
        <div className="flex justify-between items-center mt-6 pt-6 hp:pt-4 border-t border-gray-200">
          {/* RESET */}
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
