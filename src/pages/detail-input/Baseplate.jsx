import { Helmet } from "react-helmet";
import React, { useState } from "react";
import { useProjectStorage } from "../../components/pole-analyzer/hooks/useProjectStorage";
import { ChevronDown, ChevronUp, Box } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { BaseplateTypeInput } from "../../components/baseplate-forms/BaseplateTypeInput";
import { HeaderCalculationPage } from "../../components/pole-analyzer/PoleAnalyzerHeader";
import { FourRibTypeInput } from "../../components/baseplate-forms/4RibTypeInput";
import { EightRibTypeInput } from "../../components/baseplate-forms/8RibTypeInput";
import { ResultsTableBaseplate } from "../../components/result-table-component/ResultsTableBaseplate";
import * as Utils from "../../utils/pole-analyzer";
import * as Modal from "../../components/pole-analyzer/PoleAnalyzerModal";

export default function BaseplatePage() {
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

  // STATE: EightRibType for calculation
  const [eightRibType, setEightRibType] = useProjectStorage(
    projectType,
    "eightRibType",
    {
      bl1: "",
      bl2: "",
      ap1: "",
      ap2: "",
      dab: "",
      nab: "",
      nabTensionSide: "",
      ribAngle: "",
      tb: "",
      hr: "",
      lr: "",
      tr: "",
      lrs: "",
      lk: "",
    },
  );

  // STATE: Results table
  const [showResultsBp, setShowResultsBp] = useProjectStorage(
    projectType,
    "showResultsBp",
    false,
  );

  // STATE: Validation errors for bpType form
  const [bpTypeErrors, setBpTypeErrors] = useState({});

  // STATE: Validation errors for fourRibType form
  const [fourRibTypeErrors, setFourRibTypeErrors] = useState({});

  // STATE: Validation errors for eightRibType form
  const [eightRibTypeErrors, setEightRibTypeErrors] = useState({});

  // STATE: Toggle expand/collapse for BpType section UI
  const [isExpandedBpType, setIsExpandedBpType] = useState(true);

  // STATE: Toggle expand/collapse for SelectBpType section UI
  const [isExpandedSelectBpType, setIsExpandedSelectBpType] = useState(true);
  const [isCalculated, setIsCalculated] = useState(false);
  const [toast, setToast] = useState(null); // toast notifications { message, type }
  const [showCoverPopup, setShowCoverPopup] = useState(false); // show cover popup
  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  // ------------------------ Function for Baseplate Input ------------------------
  // FUNCTION: Step navigation helper (dynamic flow control)
  const { buttonLabel, nextStep, isLast } = Utils.getStepNavigation(
    condition,
    "baseplate",
  );

  // FUNCTION: Update BpType data
  const handleBpTypeUpdate = (updates) => {
    Utils.updateBpType(bpType, updates, setBpType);
  };

  // FUNCTION: Update FourRibType data
  const handleFourRibTypeUpdate = (updates) => {
    Utils.updateFourRibType(fourRibType, updates, setFourRibType);
    Utils.clearError(updates, setFourRibTypeErrors);
  };

  // FUNCTION: Update EightRibType data
  const handleEightRibTypeUpdate = (updates) => {
    Utils.updateEightRibType(eightRibType, updates, setEightRibType);
    Utils.clearError(updates, setEightRibTypeErrors);
  };

  // FUNCTION: Check if FourRibType form is complete
  const handleFourRibTypeComplete = () => {
    return Utils.fourRibTypeComplete(fourRibType);
  };

  // FUNCTION: Check if EightRibType form is complete
  const handleEightRibTypeComplete = () => {
    return Utils.eightRibTypeComplete(eightRibType);
  };

  // HANDLE: Execute calculation and enable next step
  const handleCalculate = () => {
    // RESET ERROR
    setBpTypeErrors({});
    setFourRibTypeErrors({});
    setEightRibTypeErrors({});

    // VALIDASI TYPE DULU
    if (!bpType.type) {
      showToast("Please select baseplate type first.");
      setBpTypeErrors({ type: true });
      return;
    }

    // VALIDASI BERDASARKAN TYPE
    if (bpType.type === "4rib") {
      if (!handleFourRibTypeComplete()) {
        showToast("Please complete all 4 Rib Type fields.");
        setFourRibTypeErrors(Utils.getFourRibTypeErrors(fourRibType));
        return;
      }
    }

    if (bpType.type === "8rib") {
      if (!handleEightRibTypeComplete()) {
        showToast("Please complete all 8 Rib Type fields.");
        setEightRibTypeErrors(Utils.getEightRibTypeErrors(eightRibType));
        return;
      }
    }

    // LOLOS VALIDASI
    setIsCalculated(true);
    setShowResultsBp(true);
    const target = document.getElementById("results-bp");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
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

    // SUCCESS
    sessionStorage.setItem(`${projectType}_hasReport`, "true");
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
                  onCalculate={handleCalculate}
                  onNext={handleFinish}
                  isCalculated={isCalculated}
                  buttonLabel={buttonLabel}
                />
              )}

              {bpType.type === "8rib" && (
                <EightRibTypeInput
                  eightRibType={eightRibType}
                  onUpdate={handleEightRibTypeUpdate}
                  errors={eightRibTypeErrors}
                  onCalculate={handleCalculate}
                  onNext={handleFinish}
                  isCalculated={isCalculated}
                  buttonLabel={buttonLabel}
                />
              )}
            </div>

            {/* TABEL HASIL KALKULASI */}
            <div id="results-bp">
              {showResultsBp && <ResultsTableBaseplate />}
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
