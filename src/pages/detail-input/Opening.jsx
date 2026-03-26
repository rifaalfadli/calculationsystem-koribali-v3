import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import { useProjectStorage } from "../../components/pole-analyzer/hooks/useProjectStorage";
import { BoxTypeInput } from "../../components/opening-forms/BoxTypeInput";
import { ChevronDown, ChevronUp, Box } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { HeaderCalculationPage } from "../../components/pole-analyzer/PoleAnalyzerHeader";
import { OpeningTypeInput } from "../../components/opening-forms/OpeningTypeInput";
import { RTypeInput } from "../../components/opening-forms/RTypeInput";
import * as Utils from "../../utils/pole-analyzer";
import * as Modal from "../../components/pole-analyzer/PoleAnalyzerModal";

export default function OpeningPage() {
  const { type: projectType } = useParams();
  const navigate = useNavigate();

  // STATE: Retrieve persisted calculation results from previous steps (Pole Page)
  const condition = JSON.parse(
    sessionStorage.getItem(`${projectType}_condition`) || "{}",
  );
  const [results] = useProjectStorage(projectType, "results", []);
  const [resultsDo] = useProjectStorage(projectType, "resultsDo", []);
  const [resultsOhw] = useProjectStorage(projectType, "resultsOhw", []);
  const [resultsArm] = useProjectStorage(projectType, "resultsArm", []);
  const [structuralDesign] = useProjectStorage(
    projectType,
    "structuralDesign",
    {},
  );

  // STATE: Cover information
  const [cover, setCover] = useProjectStorage(projectType, "cover", {
    managementMark: "",
    calculationNumber: "",
    projectName: "",
    contentr2: "",
    contentr3: "",
    date: "",
  });
  const [coverErrors, setCoverErrors] = useState({});

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
  const [isCalculated, setIsCalculated] = useState(false);
  const [toast, setToast] = useState(null); // toast notifications { message, type }
  const [showCoverPopup, setShowCoverPopup] = useState(false); // show cover popup
  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  // useEffect(() => {
  //   if (opType.type === "box" && Utils.opBoxTypeComplete(opBoxType)) {
  //     setIsCalculated(true);
  //   }

  //   if (opType.type === "r" && Utils.opRTypeComplete(opRType)) {
  //     setIsCalculated(true);
  //   }
  // }, [opType, opBoxType, opRType]);

  // ------------------------ Function for OP Input ------------------------
  // FUNCTION: Step navigation helper (dynamic flow control)
  const { buttonLabel, nextStep, isLast } = Utils.getStepNavigation(
    condition,
    "opening",
  );

  // FUNCTION: Update OpType data
  const handleOpTypeUpdate = (updates) => {
    Utils.updateOpType(opType, updates, setOpType);
  };

  // FUNCTION: Update OpBoxType data
  const handleOpBoxTypeUpdate = (updates) => {
    Utils.updateOpBoxType(opBoxType, updates, setOpBoxType);
    Utils.clearError(updates, setOpBoxTypeErrors);
  };

  // FUNCTION: Update OpRType data
  const handleOpRTypeUpdate = (updates) => {
    Utils.updateOpRType(opRType, updates, setOpRType);
    Utils.clearError(updates, setOpRTypeErrors);
  };

  // FUNCTION: Check if OpBoxType form is complete
  const handleOpBoxTypeComplete = () => {
    return Utils.opBoxTypeComplete(opBoxType);
  };

  // FUNCTION: Check if OpRType form is complete
  const handleOpRTypeComplete = () => {
    return Utils.opRTypeComplete(opRType);
  };

  // HANDLE: Execute calculation and enable next step
  const handleCalculate = () => {
    // RESET ERROR
    setOpTypeErrors({});
    setOpBoxTypeErrors({});
    setOpRTypeErrors({});

    // VALIDASI TYPE DULU
    if (!opType.type) {
      showToast("Please select opening type first.");
      setOpTypeErrors({ type: true });
      return;
    }

    // VALIDASI BERDASARKAN TYPE
    if (opType.type === "box") {
      if (!handleOpBoxTypeComplete()) {
        showToast("Please complete all Box Type fields.");
        setOpBoxTypeErrors(Utils.getOpBoxTypeErrors(opBoxType));
        return;
      }
    }

    if (opType.type === "r") {
      if (!handleOpRTypeComplete()) {
        showToast("Please complete all R Type fields.");
        setOpRTypeErrors(Utils.getOpRTypeErrors(opRType));
        return;
      }
    }

    // LOLOS VALIDASI
    setIsCalculated(true);
  };

  // HANDLE: Proceed to next step or trigger report if last step
  const handleFinish = () => {
    if (!isCalculated) return;

    if (isLast) {
      handleOpenCoverPopup(); // atau generateReport()
    } else {
      navigate(`/calculation/${projectType}/${nextStep}`);
    }
  };

  // ------------------------ Function for CoverInput ------------------------
  // FUNCTION: Update cover data
  const handleCoverUpdate = (updates) => {
    Utils.updateCover(cover, updates, setCover);
    Utils.clearError(updates, setCoverErrors);
  };

  // FUNCTION: Check if cover information form is complete
  const handleIsCoverComplete = () => {
    return Utils.isCoverComplete(cover);
  };

  // FUNCTION: Open Cover Input
  const handleOpenCoverPopup = () => {
    setShowCoverPopup(true);
  };

  // FUNCTION: Close Cover Input
  const handleCloseCoverPopup = () => {
    setShowCoverPopup(false);
  };

  // HANDLE: Execute make report
  const handleMakeReport = () => {
    // RESET ERROR
    setCoverErrors({});

    // VALIDASI RESULTS
    if (!results || results.length === 0) {
      showToast("No calculation results available.");
      return;
    }

    // VALIDASI COVER
    if (!handleIsCoverComplete()) {
      showToast("Please complete the Cover Information first.");
      setCoverErrors(Utils.getCoverErrors(cover));
      return;
    }

    // VALIDASI OPENING
    if (!isCalculated) {
      showToast("Please calculate opening first.");
      return;
    }

    // SUCCESS => NAVIGATE
    navigate("/report", {
      state: {
        results,
        resultsDo,
        resultsOhw,
        resultsArm,
        cover,
        condition,
        structuralDesign,
      },
    });
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
                  onCalculate={handleCalculate}
                  onNext={handleFinish}
                  isCalculated={isCalculated}
                  buttonLabel={buttonLabel}
                />
              )}

              {opType.type === "r" && (
                <RTypeInput
                  opRType={opRType}
                  onUpdate={handleOpRTypeUpdate}
                  errors={opRTypeErrors}
                  onCalculate={handleCalculate}
                  onNext={handleFinish}
                  isCalculated={isCalculated}
                  buttonLabel={buttonLabel}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Cover Input Modal */}
      <Modal.CoverInputModal
        open={showCoverPopup}
        onClose={handleCloseCoverPopup}
        cover={cover}
        onUpdateCover={handleCoverUpdate}
        onMakeReport={handleMakeReport}
        coverErrors={coverErrors}
      />

      {/* Toast Modal */}
      <Modal.ToastModal toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
