import { Helmet } from "react-helmet";
import { useState } from "react";
import { useProjectStorage } from "../../components/pole-analyzer/hooks/useProjectStorage";
import { ChevronDown, ChevronUp, Box } from "lucide-react";
import { useParams } from "react-router-dom";
import { FoundationTypeInput } from "../../components/foundation-forms/FoundationTypeInput";
import { HeaderCalculationPage } from "../../components/pole-analyzer/PoleAnalyzerHeader";
import * as Utils from "../../utils/pole-analyzer";

export default function FoundationPage() {
  const { type: projectType } = useParams();

  const [foundationType, setFoundationType] = useProjectStorage(
    projectType,
    "foundationType",
    {
      type: "",
    },
  );

  // STATE: Validation errors for foundationType form
  const [foundationTypeErrors, setFoundationTypeErrors] = useState({});

  // STATE: Toggle expand/collapse for foundationType section UI
  const [isExpandedFoundationType, setIsExpandedFoundationType] =
    useState(true);

  // STATE: Toggle expand/collapse for SelectFoundationType section UI
  const [isExpandedSelectFoundationType, setIsExpandedSelectFoundationType] =
    useState(true);

  // ------------------------ Function for Foundation Input ------------------------
  // FUNCTION: Update FoundationType data
  const handleFoundationTypeUpdate = (updates) => {
    Utils.updateFoundationType(foundationType, updates, setFoundationType);
  };

  const typeLabelMap = {
    "round-caisson": "Round Caisson Type",
    nemaki: "Nemaki Type",
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>Calculation Foundation - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="min-h-screen bg-gray-50 border border-gray-250">
          <HeaderCalculationPage />

          <div className="mx-6 2040:mx-[300px] pt-1 pb-8 hp:mx-2">
            {/* ============================================================
              FORM FOUNDATION TYPE (Bagian foundation perhitungan)
            ============================================================ */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out ${
                isExpandedFoundationType
                  ? "rounded-t-2xl hp:rounded-t-xl"
                  : "rounded-2xl hp:rounded-xl"
              } hp:px-4 hp:py-3`}
              onClick={() =>
                setIsExpandedFoundationType(!isExpandedFoundationType)
              }
            >
              {/* Judul cover */}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                  Foundation Type
                </h2>
              </div>

              {/* Icon toggle (up/down) */}
              <div className="p-2">
                {isExpandedFoundationType ? (
                  <ChevronUp className="w-5 h-5 text-white hp:w4 hp:h-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white hp:w4 hp:h-4" />
                )}
              </div>
            </div>

            {/* Body form (collapsible) */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpandedFoundationType
                  ? "max-h-[5000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <FoundationTypeInput
                foundationType={foundationType}
                onUpdate={handleFoundationTypeUpdate}
                errors={foundationTypeErrors}
              />
            </div>

            {/* ============================================================
              FORM FOUNDATION TYPE (Bagian foundation perhitungan)
            ============================================================ */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-10 transition-all duration-500 ease-in-out ${
                isExpandedSelectFoundationType
                  ? "rounded-t-2xl hp:rounded-t-xl"
                  : "rounded-2xl hp:rounded-xl"
              } hp:px-4 hp:py-3`}
              onClick={() =>
                setIsExpandedSelectFoundationType(
                  !isExpandedSelectFoundationType,
                )
              }
            >
              {/* Judul cover */}
              <div>
                {foundationType.type && (
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                    <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                      {typeLabelMap[foundationType.type]}
                    </h2>
                  </div>
                )}
              </div>

              {/* Icon toggle (up/down) */}
              <div className="p-2">
                {isExpandedSelectFoundationType ? (
                  <ChevronUp className="w-5 h-5 text-white hp:w4 hp:h-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white hp:w4 hp:h-4" />
                )}
              </div>
            </div>

            {/* Body form (collapsible) */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpandedSelectFoundationType
                  ? "max-h-[5000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              {/* ================= EMPTY STATE ================= */}
              {!foundationType.type && (
                <div className="bg-white border border-gray-200 rounded-b-2xl p-10 flex flex-col items-center justify-center text-center">
                  {/* ICON */}
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Box className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* TEXT */}
                  <p className="text-gray-500 text-sm">
                    Please select foundation type first
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Choose the type above to configure parameters
                  </p>
                </div>
              )}

              {/* ================= FORM BASED ON TYPE ================= */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
