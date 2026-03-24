import { Helmet } from "react-helmet";
import React, { useState } from "react";
import { useProjectStorage } from "../../components/pole-analyzer/hooks/useProjectStorage";
import { BoxTypeInput } from "../../components/opening-forms/BoxTypeInput";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { HeaderCalculationPage } from "../../components/pole-analyzer/PoleAnalyzerHeader";
import * as Utils from "../../utils/pole-analyzer";

export default function OpeningPage() {
  const { type: projectType } = useParams();

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

  // STATE: Validation errors for opBoxType form
  const [opBoxTypeErrors, setOpBoxTypeErrors] = useState({});

  // STATE: Toggle expand/collapse for OpBoxType section UI
  const [isExpandedOpBoxType, setIsExpandedOpBoxType] = useState(true);

  // ------------------------ Function for OP Box Type Input ------------------------
  // FUNCTION: Update OpBoxType data
  const handleOpBoxTypeUpdate = (updates) => {
    Utils.updateOpBoxType(opBoxType, updates, setOpBoxType);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>Calculation - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="min-h-screen bg-gray-50 border border-gray-250">
          <HeaderCalculationPage />
          <div className="mx-6 2040:mx-[250px] pt-1 pb-8 hp:mx-2">
            {/* ============================================================
              FORM OP BOX TYPE (Bagian opening perhitungan)
            ============================================================ */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out ${
                isExpandedOpBoxType
                  ? "rounded-t-2xl hp:rounded-t-xl"
                  : "rounded-2xl hp:rounded-xl"
              } hp:px-4 hp:py-3`}
              onClick={() => setIsExpandedOpBoxType(!isExpandedOpBoxType)}
            >
              {/* Judul cover */}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                  Opening Part Box Type
                </h2>
              </div>

              {/* Icon toggle (up/down) */}
              <div className="p-2">
                {isExpandedOpBoxType ? (
                  <ChevronUp className="w-5 h-5 text-white hp:w4 hp:h-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white hp:w4 hp:h-4" />
                )}
              </div>
            </div>

            {/* Body form (collapsible) */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpandedOpBoxType
                  ? "max-h-[5000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <BoxTypeInput
                opBoxType={opBoxType}
                onUpdate={handleOpBoxTypeUpdate}
                errors={opBoxTypeErrors}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
