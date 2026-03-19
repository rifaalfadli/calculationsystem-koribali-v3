import { Helmet } from "react-helmet";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";
import { useProjectStorage } from "../pole-analyzer/hooks/useProjectStorage";
import { HeaderCalculationPage } from "../pole-analyzer/PoleAnalyzerHeader";
import { ConditionInput } from "../pole-analyzer/ConditionInput";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as Utils from "../../utils/pole-analyzer";

export default function CalculationSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type: projectType } = useParams();

  const validTypes = ["lighting-pole", "acemast", "signboard", "multiple"];

  // STATE: Condition for calculation
  const [condition, setCondition] = useProjectStorage(
    projectType,
    "condition",
    {
      designStandard: "",
      windSpeed: "",
      airDensity: "",
      method: "",
      openingEnabled: false,
      baseplateEnabled: false,
      foundationEnabled: false,
    },
  );

  const [conditionErrors, setConditionErrors] = useState({});
  const [isExpandedPole, setIsExpandedPole] = useState(true); // expand/collapse pole input
  const [isExpandedCondition, setIsExpandedCondition] = useState(true); // expand/collapse condition input

  // ------------------------ Function for ConditionInput ------------------------
  // FUNCTION: Update condition data
  const handleConditionUpdate = (updates) => {
    Utils.updateCondition(condition, updates, setCondition);
    Utils.clearError(updates, setConditionErrors);
  };

  // FUNCTION: Check if condition information form is complete
  const handleIsConditionComplete = () => {
    return Utils.isConditionComplete(condition);
  };

  // FUNCTION: Go to Pole Input after Condition
  const handleConditionNext = () => {
    if (!handleIsConditionComplete()) {
      return;
    }

    // dynamic key berdasarkan project type
    const configKey = `${projectType}_calculation_config`;

    sessionStorage.setItem(
      configKey,
      JSON.stringify({
        opening: condition.openingEnabled,
        baseplate: condition.baseplateEnabled,
        foundation: condition.foundationEnabled,
      }),
    );

    navigate(`/calculation/${projectType}/pole`);
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

          <div className="mx-6 2040:mx-[300px] pt-1 pb-8 hp:mx-2">
            {/* ============================================================
              FORM CONDITION (Bagian kondisi perhitungan)
            ============================================================ */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out ${
                isExpandedCondition
                  ? "rounded-t-2xl hp:rounded-t-xl"
                  : "rounded-2xl hp:rounded-xl"
              } hp:px-4 hp:py-3`}
              onClick={() => setIsExpandedCondition(!isExpandedCondition)}
            >
              {/* Judul cover */}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                  Initial Input
                </h2>
              </div>

              {/* Icon toggle (up/down) */}
              <div className="p-2">
                {isExpandedCondition ? (
                  <ChevronUp className="w-5 h-5 text-white hp:w4 hp:h-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white hp:w4 hp:h-4" />
                )}
              </div>
            </div>

            {/* Body form (collapsible) */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpandedCondition
                  ? "max-h-[5000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <ConditionInput
                projectType={projectType}
                condition={condition}
                onUpdate={handleConditionUpdate}
                onNext={handleConditionNext}
                errors={conditionErrors}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
