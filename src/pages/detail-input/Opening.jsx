import { Helmet } from "react-helmet";
import React, { useState } from "react";
import { useProjectStorage } from "../../components/pole-analyzer/hooks/useProjectStorage";
import { BoxTypeInput } from "../../components/opening-forms/BoxTypeInput";
import { ChevronDown, ChevronUp, Box } from "lucide-react";
import { useParams } from "react-router-dom";
import { HeaderCalculationPage } from "../../components/pole-analyzer/PoleAnalyzerHeader";
import * as Utils from "../../utils/pole-analyzer";
import { OpeningTypeInput } from "../../components/opening-forms/OpeningTypeInput";
import { RTypeInput } from "../../components/opening-forms/RTypeInput";

export default function OpeningPage() {
  const { type: projectType } = useParams();

  // STATE: opType for calculation
  const [opType, setOpType] = useProjectStorage(projectType, "opType", {
    type: "",
  });

  // STATE: opBoxType for calculation
  const [opBoxType, setOpBoxType] = useProjectStorage(
    projectType,
    "opBoxType",
    {
      boxWidth: "",
      opWidth: "",
      boxHeight: "",
      opSurfaceHeight: "",
      opLength: "",
    },
  );

  // STATE: opRType for calculation
  const [opRType, setOpRType] = useProjectStorage(projectType, "opRType", {
    opWidth: "",
    opSurfaceHeight: "",
    opLength: "",
  });

  // STATE: Validation errors for opType form
  const [opTypeErrors, setOpTypeErrors] = useState({});

  // STATE: Validation errors for opBoxType form
  const [opBoxTypeErrors, setOpBoxTypeErrors] = useState({});

  // STATE: Validation errors for opRType form
  const [opRTypeErrors, setOpRTypeErrors] = useState({});

  // STATE: Toggle expand/collapse for OpType section UI
  const [isExpandedOpType, setIsExpandedOpType] = useState(true);

  // STATE: Toggle expand/collapse for SelectOpType section UI
  const [isExpandedSelectOpType, setIsExpandedSelectOpType] = useState(true);

  // ------------------------ Function for OP Input ------------------------
  // FUNCTION: Update OpType data
  const handleOpTypeUpdate = (updates) => {
    Utils.updateOpType(opType, updates, setOpType);
  };

  // FUNCTION: Update OpBoxType data
  const handleOpBoxTypeUpdate = (updates) => {
    Utils.updateOpBoxType(opBoxType, updates, setOpBoxType);
  };

  // FUNCTION: Update OpRType data
  const handleOpRTypeUpdate = (updates) => {
    Utils.updateOpRType(opRType, updates, setOpRType);
  };

  const typeLabelMap = {
    box: "Box Type",
    r: "R Type",
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>Calculation Opening - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="min-h-screen bg-gray-50 border border-gray-250">
          <HeaderCalculationPage />
          <div className="mx-6 2040:mx-[250px] pt-1 pb-8 hp:mx-2">
            {/* ============================================================
              FORM OPENING TYPE (Bagian opening perhitungan)
            ============================================================ */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out ${
                isExpandedOpType
                  ? "rounded-t-2xl hp:rounded-t-xl"
                  : "rounded-2xl hp:rounded-xl"
              } hp:px-4 hp:py-3`}
              onClick={() => setIsExpandedOpType(!isExpandedOpType)}
            >
              {/* Judul cover */}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                  Opening Part Type
                </h2>
              </div>

              {/* Icon toggle (up/down) */}
              <div className="p-2">
                {isExpandedOpType ? (
                  <ChevronUp className="w-5 h-5 text-white hp:w4 hp:h-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white hp:w4 hp:h-4" />
                )}
              </div>
            </div>

            {/* Body form (collapsible) */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpandedOpType
                  ? "max-h-[5000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <OpeningTypeInput
                opType={opType}
                onUpdate={handleOpTypeUpdate}
                errors={opTypeErrors}
              />
            </div>

            {/* ============================================================
              FORM OP BOX TYPE (Bagian opening perhitungan)
            ============================================================ */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-10 transition-all duration-500 ease-in-out ${
                isExpandedSelectOpType
                  ? "rounded-t-2xl hp:rounded-t-xl"
                  : "rounded-2xl hp:rounded-xl"
              } hp:px-4 hp:py-3`}
              onClick={() => setIsExpandedSelectOpType(!isExpandedSelectOpType)}
            >
              {/* Judul cover */}
              <div>
                {opType.type && (
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                    <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                      {typeLabelMap[opType.type]}
                    </h2>
                  </div>
                )}
              </div>

              {/* Icon toggle (up/down) */}
              <div className="p-2">
                {isExpandedSelectOpType ? (
                  <ChevronUp className="w-5 h-5 text-white hp:w4 hp:h-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white hp:w4 hp:h-4" />
                )}
              </div>
            </div>

            {/* Body form (collapsible) */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpandedSelectOpType
                  ? "max-h-[5000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              {/* ================= EMPTY STATE ================= */}
              {!opType.type && (
                <div className="bg-white border border-gray-200 rounded-b-2xl p-10 flex flex-col items-center justify-center text-center">
                  {/* ICON */}
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Box className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* TEXT */}
                  <p className="text-gray-500 text-sm">
                    Please select opening type first
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Choose the type above to configure parameters
                  </p>
                </div>
              )}

              {/* ================= FORM BASED ON TYPE ================= */}
              {opType.type === "box" && (
                <BoxTypeInput
                  opBoxType={opBoxType}
                  onUpdate={handleOpBoxTypeUpdate}
                  errors={opBoxTypeErrors}
                />
              )}

              {opType.type === "r" && (
                <RTypeInput
                  opRType={opRType}
                  onUpdate={handleOpRTypeUpdate}
                  errors={opRTypeErrors}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
