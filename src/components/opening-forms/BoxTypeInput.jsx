export function BoxTypeInput({ opBoxType, onUpdate, errors }) {
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
    <div>
      {/* MAIN CARD */}
      <div className="bg-white border border-gray-200 p-6 rounded-b-2xl shadow-sm">
        {/* GRID 2 KOLOM */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
          {/* ================= LEFT : INPUT ================= */}
          <div>
            {/* STACK INPUT (VERTICAL) */}
            <div className="flex flex-col gap-5">
              {/* Box Width */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Box Width (a)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={opBoxType.boxWidth}
                    onChange={(e) => onUpdate({ boxWidth: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.boxWidth)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.boxWidth} text="Required field" />
              </div>

              {/* Opening Width */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Opening Width (b)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={opBoxType.opWidth}
                    onChange={(e) => onUpdate({ opWidth: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.opWidth)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.opWidth} text="Required field" />
              </div>

              {/* Box Height */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Box Height (tb)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={opBoxType.boxHeight}
                    onChange={(e) => onUpdate({ boxHeight: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.boxHeight)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.boxHeight} text="Required field" />
              </div>

              {/* Opening Surface Height */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Opening Surface Height (HOp)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={opBoxType.opSurfaceHeight}
                    onChange={(e) =>
                      onUpdate({ opSurfaceHeight: e.target.value })
                    }
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.opSurfaceHeight)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    mm
                  </span>
                </div>
                <ErrorText
                  show={errors.opSurfaceHeight}
                  text="Required field"
                />
              </div>

              {/* Opening Length */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Opening Length (LOp)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={opBoxType.opLength}
                    onChange={(e) => onUpdate({ opLength: e.target.value })}
                    onWheel={(e) => e.target.blur()}
                    className={`${inputClass(errors.opLength)} pr-12`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    mm
                  </span>
                </div>
                <ErrorText show={errors.opLength} text="Required field" />
              </div>
            </div>
          </div>

          {/* ================= RIGHT : VISUAL ================= */}
          <div className="flex flex-col justify-center gap-6">
            {/* TOP VIEW */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-center hover:shadow-sm transition">
              <img
                src="/images/opBox-top-view.png"
                alt="Top View"
                className="max-h-48 object-contain"
              />
            </div>

            {/* SIDE VIEW */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-center hover:shadow-sm transition">
              <img
                src="/images/opBox-side-view.png"
                alt="Side View"
                className="max-h-48 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
