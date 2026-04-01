import { FileSpreadsheet, CheckCircle2 } from "lucide-react";

export function ResultsTableFoundation({ foundationType }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d3b66] to-[#0d3b66] px-6 py-5 hp:px-4 hp:py-3">
        <div className="flex items-center justify-between gap-3">
          {/* LEFT */}
          <div className="flex items-center gap-3 hp:gap-2">
            <div className="bg-white/10 backdrop-blur-sm p-2 hp:p-1.5 rounded-lg">
              <CheckCircle2 className="w-6 h-6 hp:w-5 hp:h-5 text-white" />
            </div>

            <div>
              <h2 className="text-white mb-0.5 text-sm hp:text-xs font-semibold">
                Calculation Results
              </h2>

              {/* hide description on mobile */}
              <p className="text-white/70 text-xs font-medium hp:hidden">
                Comprehensive structural analysis output
              </p>
            </div>
          </div>

          {/* RIGHT BUTTON */}
        </div>
      </div>

      <div className="mx-6 my-6 space-y-6 hp:mx-2 hp:mt-4">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#0d3b66] px-5 py-4 shadow-sm hp:px-4 hp:py-3">
          <div className="flex items-center gap-3 hp:gap-2">
            <div className="bg-white/15 backdrop-blur-sm p-2 rounded-lg hp:p-1.5">
              <FileSpreadsheet className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm leading-tight hp:text-xs">
                Foundation Evaluation (Actual Size)
              </h3>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-50 text-[#0d3b66] text-sm hp:text-[10px]">
                <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                  No
                </th>
                <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                  Description
                </th>
                <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                  Safety Factor
                </th>
                <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                  Result
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="hover:bg-[#3399cc]/10 transition-colors text-sm hp:text-[10px]">
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  1
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {foundationType?.type === "square-caisson" &&
                    "Square Caisson Foundation"}
                  {foundationType?.type === "round-caisson" &&
                    "Round Caisson Foundation"}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  0.9
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  &lt; 1.0・・・O.K
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
