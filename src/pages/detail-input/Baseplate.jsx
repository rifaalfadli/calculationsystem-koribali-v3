import { Helmet } from "react-helmet";
import React, { useState } from "react";
import { useProjectStorage } from "../../components/pole-analyzer/hooks/useProjectStorage";
import { ChevronDown, ChevronUp, Box } from "lucide-react";
import { useParams } from "react-router-dom";
import { BaseplateTypeInput } from "../../components/baseplate-forms/BaseplateTypeInput";
import { HeaderCalculationPage } from "../../components/pole-analyzer/PoleAnalyzerHeader";
import { FourRibTypeInput } from "../../components/baseplate-forms/4RibTypeInput";
import * as Utils from "../../utils/pole-analyzer";

export default function BaseplatePage() {
  const { type: projectType } = useParams();

  // STATE: bpType for calculation
  const [bpType, setBpType] = useProjectStorage(projectType, "bpType", {
    type: "",
  });

  // STATE: FourRibType for calculation
  const [fourRibType, setFourRibType] = useProjectStorage(
    projectType,
    "fourRibType",
    {
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
    },
  );

  // STATE: Validation errors for bpType form
  const [bpTypeErrors, setBpTypeErrors] = useState({});

  // STATE: Validation errors for fourRibType form
  const [fourRibTypeErrors, setFourRibTypeErrors] = useState({});

  // STATE: Toggle expand/collapse for BpType section UI
  const [isExpandedBpType, setIsExpandedBpType] = useState(true);

  // STATE: Toggle expand/collapse for SelectBpType section UI
  const [isExpandedSelectBpType, setIsExpandedSelectBpType] = useState(true);

  // ------------------------ Function for Baseplate Input ------------------------
  // FUNCTION: Update BpType data
  const handleBpTypeUpdate = (updates) => {
    Utils.updateBpType(bpType, updates, setBpType);
  };

  // FUNCTION: Update FourRibType data
  const handleFourRibTypeUpdate = (updates) => {
    Utils.updateFourRibType(fourRibType, updates, setFourRibType);
  };

  const typeLabelMap = {
    "4rib": "4 Rib Type",
    "8rib": "8 Rib Type",
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>Calculation Baseplate - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="min-h-screen bg-gray-50 border border-gray-250">
          <HeaderCalculationPage />

          <div className="mx-6 2040:mx-[300px] pt-1 pb-8 hp:mx-2">
            {/* ============================================================
              FORM BASEPLATE  TYPE (Bagian baseplate perhitungan)
            ============================================================ */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out ${
                isExpandedBpType
                  ? "rounded-t-2xl hp:rounded-t-xl"
                  : "rounded-2xl hp:rounded-xl"
              } hp:px-4 hp:py-3`}
              onClick={() => setIsExpandedBpType(!isExpandedBpType)}
            >
              {/* Judul cover */}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                  Baseplate Type
                </h2>
              </div>

              {/* Icon toggle (up/down) */}
              <div className="p-2">
                {isExpandedBpType ? (
                  <ChevronUp className="w-5 h-5 text-white hp:w4 hp:h-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white hp:w4 hp:h-4" />
                )}
              </div>
            </div>

            {/* Body form (collapsible) */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpandedBpType
                  ? "max-h-[5000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <BaseplateTypeInput
                bpType={bpType}
                onUpdate={handleBpTypeUpdate}
                errors={bpTypeErrors}
              />
            </div>

            {/* ============================================================
              FORM BASEPLATE TYPE (Bagian opening perhitungan)
            ============================================================ */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-10 transition-all duration-500 ease-in-out ${
                isExpandedSelectBpType
                  ? "rounded-t-2xl hp:rounded-t-xl"
                  : "rounded-2xl hp:rounded-xl"
              } hp:px-4 hp:py-3`}
              onClick={() => setIsExpandedSelectBpType(!isExpandedSelectBpType)}
            >
              {/* Judul cover */}
              <div>
                {bpType.type && (
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                    <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                      {typeLabelMap[bpType.type]}
                    </h2>
                  </div>
                )}
              </div>

              {/* Icon toggle (up/down) */}
              <div className="p-2">
                {isExpandedSelectBpType ? (
                  <ChevronUp className="w-5 h-5 text-white hp:w4 hp:h-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white hp:w4 hp:h-4" />
                )}
              </div>
            </div>

            {/* Body form (collapsible) */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpandedSelectBpType
                  ? "max-h-[5000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              {/* ================= EMPTY STATE ================= */}
              {!bpType.type && (
                <div className="bg-white border border-gray-200 rounded-b-2xl p-10 flex flex-col items-center justify-center text-center">
                  {/* ICON */}
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Box className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* TEXT */}
                  <p className="text-gray-500 text-sm">
                    Please select baseplate type first
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Choose the type above to configure parameters
                  </p>
                </div>
              )}

              {/* ================= FORM BASED ON TYPE ================= */}

              {bpType.type === "4rib" && (
                <FourRibTypeInput
                  fourRibType={fourRibType}
                  onUpdate={handleFourRibTypeUpdate}
                  errors={fourRibTypeErrors}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
