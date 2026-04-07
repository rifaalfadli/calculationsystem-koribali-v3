import { Helmet } from "react-helmet";
import { useState } from "react";
import { useProjectStorage } from "../../components/pole-analyzer/hooks/useProjectStorage";
import { ChevronDown, ChevronUp, Box } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { HeaderCalculationPage } from "../../components/pole-analyzer/PoleAnalyzerHeader";
import { FoundationTypeInput } from "../../components/foundation-forms/FoundationTypeInput";
import { SquareCaissonTypeInput } from "../../components/foundation-forms/SquareCaissonTypeInput";
import { RoundCaissonTypeInput } from "../../components/foundation-forms/RoundCaissonTypeInput";
import { ResultsTableFoundation } from "../../components/result-table-component/ResultsTableFoundation";
import * as Utils from "../../utils/pole-analyzer";
import * as Modal from "../../components/pole-analyzer/PoleAnalyzerModal";

export default function FoundationPage() {
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

  // STATE: foundationType for calculation
  const [foundationType, setFoundationType] = useProjectStorage(
    projectType,
    "foundationType",
    {
      type: "",
    },
  );

  // STATE: sqrCaissonType for calculation
  const [sqrCaissonType, setSqrCaissonType] = useProjectStorage(
    projectType,
    "sqrCaissonType",
    {
      width2a: "",
      width2b: "",
      embedmentDepth: "",
      nValue: "",
      yValue: "",
      ycValue: "",
      alphaValue: "",
    },
  );

  // STATE: roundCaissonType for calculation
  const [roundCaissonType, setRoundCaissonType] = useProjectStorage(
    projectType,
    "roundCaissonType",
    {
      width2a: "",
      width2b: "",
      embedmentDepth: "",
      nValue: "",
      yValue: "",
      ycValue: "",
      alphaValue: "",
    },
  );

  // STATE: Results table
  const [calculatedFoundation, setCalculatedFoundation] = useProjectStorage(
    projectType,
    "calculatedFoundation",
    null,
  );

  const [showResultsFoundation, setShowResultsFoundation] = useProjectStorage(
    projectType,
    "showResultsFoundation",
    false,
  );

  // STATE: Validation errors for foundationType form
  const [foundationTypeErrors, setFoundationTypeErrors] = useState({});

  // STATE: Validation errors for sqrCaissonType form
  const [sqrCaissonTypeErrors, setSqrCaissonTypeErrors] = useState({});

  // STATE: Validation errors for roundCaissonType form
  const [roundCaissonTypeErrors, setRoundCaissonTypeErrors] = useState({});

  // STATE: Toggle expand/collapse for foundationType section UI
  const [isExpandedFoundationType, setIsExpandedFoundationType] =
    useState(true);

  // STATE: Toggle expand/collapse for SelectFoundationType section UI
  const [isExpandedSelectFoundationType, setIsExpandedSelectFoundationType] =
    useState(true);
  const [isCalculated, setIsCalculated] = useState(false);
  const [toast, setToast] = useState(null); // toast notifications { message, type }
  const [showCoverPopup, setShowCoverPopup] = useState(false); // show cover popup
  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  // ------------------------ Function for Foundation Input ------------------------
  // FUNCTION: Step navigation helper (dynamic flow control)
  const { buttonLabel, nextStep, isLast } = Utils.getStepNavigation(
    condition,
    "foundation",
  );

  // FUNCTION: Update FoundationType data
  const handleFoundationTypeUpdate = (updates) => {
    Utils.updateFoundationType(foundationType, updates, setFoundationType);
  };

  // FUNCTION: Update SqrCaissonType data
  const handleSqrCaissonTypeUpdate = (updates) => {
    Utils.updateSqrCaissonType(sqrCaissonType, updates, setSqrCaissonType);
    Utils.clearError(updates, setSqrCaissonTypeErrors);
  };

  // FUNCTION: Update RoundCaissonType data
  const handleRoundCaissonTypeUpdate = (updates) => {
    Utils.updateRoundCaissonType(
      roundCaissonType,
      updates,
      setRoundCaissonType,
    );
    Utils.clearError(updates, setRoundCaissonTypeErrors);
  };

  // FUNCTION: Check if SqrCaissonType form is complete
  const handleSqrCaissonTypeComplete = () => {
    return Utils.sqrCaissonTypeComplete(sqrCaissonType);
  };

  // FUNCTION: Check if RoundCaissonType form is complete
  const handleRoundCaissonTypeComplete = () => {
    return Utils.roundCaissonTypeComplete(roundCaissonType);
  };

  // HANDLE: Execute calculation and enable next step
  const handleCalculate = () => {
    // RESET ERROR
    setFoundationTypeErrors({});
    setSqrCaissonTypeErrors({});
    setRoundCaissonTypeErrors({});

    // VALIDASI TYPE DULU
    if (!foundationType.type) {
      showToast("Please select foundation type first.");
      setFoundationTypeErrors({ type: true });
      return;
    }

    // VALIDASI BERDASARKAN TYPE
    if (foundationType.type === "square-caisson") {
      if (!handleSqrCaissonTypeComplete()) {
        showToast("Please complete all Square Caisson Type fields.");
        setSqrCaissonTypeErrors(Utils.getSqrCaissonTypeErrors(sqrCaissonType));
        return;
      }
    }

    if (foundationType.type === "round-caisson") {
      if (!handleRoundCaissonTypeComplete()) {
        showToast("Please complete all Round Caisson Type fields.");
        setRoundCaissonTypeErrors(
          Utils.getRoundCaissonTypeErrors(roundCaissonType),
        );
        return;
      }
    }

    // LOLOS VALIDASI
    setCalculatedFoundation({
      foundationType: { ...foundationType },
    });
    setIsCalculated(true);
    setShowResultsFoundation(true);
    const target = document.getElementById("results-foundation");
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
      showToast("Please calculate foundation first.");
      return;
    }

    // SUCCESS
    sessionStorage.setItem(`${projectType}_hasReport`, "true");
    const reportPayload = {
      results,
      resultsDo,
      resultsOhw,
      resultsArm,
      cover,
      condition,
      structuralDesign,
    };

    // save a special report snapshot
    sessionStorage.setItem(
      `${projectType}_reportSnapshot`,
      JSON.stringify(reportPayload),
    );

    navigate("/report", {
      state: reportPayload,
    });
  };

  const typeLabelMap = {
    "square-caisson": "Square Caisson Type",
    "round-caisson": "Round Caisson Type",
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
              {foundationType.type === "square-caisson" && (
                <SquareCaissonTypeInput
                  sqrCaissonType={sqrCaissonType}
                  onUpdate={handleSqrCaissonTypeUpdate}
                  errors={sqrCaissonTypeErrors}
                  onCalculate={handleCalculate}
                  onNext={handleFinish}
                  isCalculated={isCalculated}
                  buttonLabel={buttonLabel}
                />
              )}

              {foundationType.type === "round-caisson" && (
                <RoundCaissonTypeInput
                  roundCaissonType={roundCaissonType}
                  onUpdate={handleRoundCaissonTypeUpdate}
                  errors={roundCaissonTypeErrors}
                  onCalculate={handleCalculate}
                  onNext={handleFinish}
                  isCalculated={isCalculated}
                  buttonLabel={buttonLabel}
                />
              )}
            </div>

            {/* TABEL HASIL KALKULASI */}
            <div id="results-foundation">
              {showResultsFoundation && (
                <ResultsTableFoundation
                  foundationType={calculatedFoundation?.foundationType}
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
