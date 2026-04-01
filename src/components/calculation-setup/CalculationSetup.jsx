import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useProjectStorage } from "../pole-analyzer/hooks/useProjectStorage";
import { HeaderCalculationPage } from "../pole-analyzer/PoleAnalyzerHeader";
import { ConditionInput } from "./ConditionInput";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ToastModal } from "../pole-analyzer/PoleAnalyzerModal";
import { ConfirmDisableComponentModal } from "../pole-analyzer/PoleAnalyzerModal";
import * as Utils from "../../utils/pole-analyzer";

// CONSTANT: List of allowed project types
const VALID_TYPES = ["lighting-pole", "acemast", "signboard", "multiple"];

export default function CalculationSetup() {
  const navigate = useNavigate();
  const { type: projectType } = useParams();

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

  // Temporary draft state to prevent auto-persist before explicit submit (Finish)
  const [localCondition, setLocalCondition] = useState(condition);

  // Keep draft in sync with persisted session state
  useEffect(() => {
    setLocalCondition(condition);
  }, [condition]);

  // STATE: Validation errors for condition form
  const [conditionErrors, setConditionErrors] = useState({});

  // STATE: Toggle expand/collapse for condition section UI
  const [isExpandedCondition, setIsExpandedCondition] = useState(true);

  // STATE: Toast notifications { message, type}
  const [toast, setToast] = useState(null);

  // STATE: confirm disable additional components
  const [confirmDisable, setConfirmDisable] = useState(null);
  const [prevCondition, setPrevCondition] = useState({ ...condition });

  // EFFECT: Validate project type on mount/change and clean invalid session
  useEffect(() => {
    if (!VALID_TYPES.includes(projectType)) {
      sessionStorage.removeItem("projectType");
    }
  }, [projectType]);

  // ------------------------ Function for ConditionInput ------------------------
  const getDisabledComponents = () => {
    const disabled = [];

    if (condition.openingEnabled && !localCondition.openingEnabled) {
      disabled.push("Opening");
    }

    if (condition.baseplateEnabled && !localCondition.baseplateEnabled) {
      disabled.push("Baseplate");
    }

    if (condition.foundationEnabled && !localCondition.foundationEnabled) {
      disabled.push("Foundation");
    }

    return disabled;
  };

  const proceedFinish = () => {
    // 1. SET CONFIG (SOURCE OF TRUTH HEADER)
    const newConfig = {
      opening: !!localCondition.openingEnabled,
      baseplate: !!localCondition.baseplateEnabled,
      foundation: !!localCondition.foundationEnabled,
    };

    sessionStorage.setItem(
      `${projectType}_calculation_config`,
      JSON.stringify(newConfig),
    );

    // 2. CLEANUP
    if (!localCondition.openingEnabled) {
      sessionStorage.removeItem(`${projectType}_opType`);
      sessionStorage.removeItem(`${projectType}_opBoxType`);
      sessionStorage.removeItem(`${projectType}_opRType`);
    }

    if (!localCondition.baseplateEnabled) {
      sessionStorage.removeItem(`${projectType}_bpType`);
      sessionStorage.removeItem(`${projectType}_fourRibType`);
      sessionStorage.removeItem(`${projectType}_eightRibType`);
    }

    if (!localCondition.foundationEnabled) {
      sessionStorage.removeItem(`${projectType}_foundationType`);
      sessionStorage.removeItem(`${projectType}_sqrCaissonType`);
      sessionStorage.removeItem(`${projectType}_roundCaissonType`);
    }

    // 3. COMMIT CONDITION
    setCondition(localCondition);

    // 4. NAVIGATE
    navigate(`/calculation/${projectType}/pole`);
  };

  // FUNCTION: Update condition data
  const handleConditionUpdate = (updates) => {
    Utils.updateCondition(localCondition, updates, setLocalCondition);
    Utils.clearError(updates, setConditionErrors);
  };

  // FUNCTION: Check if condition information form is complete
  const handleIsConditionComplete = () => {
    return Utils.isConditionComplete(localCondition);
  };

  // FUNCTION: Trigger toast notification with specific message and type.
  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  // FUNCTION: Go to Pole Input after Condition
  const handleConditionNext = () => {
    setConditionErrors({});

    const result = Utils.conditionNext(handleIsConditionComplete());

    if (!result.isValid) {
      showToast("Please complete all initial input fields.");
      if (result.errors?.condition) {
        setConditionErrors(Utils.getConditionErrors(localCondition));
      }
      return;
    }

    // cek perubahan true => false
    const disabledComponents = getDisabledComponents();

    if (disabledComponents.length > 0) {
      setPrevCondition({ ...condition });
      setConfirmDisable(disabledComponents);
      return;
    }
    // kalau tidak ada perubahan → langsung lanjut
    proceedFinish();
  };

  // GUARD: Redirect if project type is invalid
  if (!VALID_TYPES.includes(projectType)) {
    return <Navigate to="/calculation" replace />;
  }

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
                condition={localCondition}
                onUpdate={handleConditionUpdate}
                onNext={handleConditionNext}
                errors={conditionErrors}
              />
            </div>
          </div>
        </div>

        <ConfirmDisableComponentModal
          data={confirmDisable}
          onClose={() => {
            setConfirmDisable(null);
            setLocalCondition({ ...prevCondition });
          }}
          onConfirm={() => {
            setConfirmDisable(null);
            proceedFinish();
          }}
        />

        {/* Toast Modal */}
        <ToastModal toast={toast} onClose={() => setToast(null)} />
      </div>
    </>
  );
}
