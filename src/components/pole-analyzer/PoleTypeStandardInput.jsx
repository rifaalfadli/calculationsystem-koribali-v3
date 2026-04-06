export function PoleTypeStandardInput({ poleTypeStandard, onUpdate }) {
  return (
    <div className="mb-6 px-6">
      <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-sm font-medium">
        <div className="w-1 h-5 bg-[#3399cc] rounded-full"></div>
        Select Pole Type
      </h3>

      <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          {[
            { id: "taper", label: "Taper Pole" },
            { id: "straight", label: "Straight Pole" },
          ].map((item) => {
            const active = poleTypeStandard.poleShape === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onUpdate({
                    poleShape: item.id,
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
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
