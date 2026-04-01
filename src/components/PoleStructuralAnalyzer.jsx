import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

// COMPONENTS: Feature-specific components
import { HeaderCalculationPage } from "./pole-analyzer/PoleAnalyzerHeader";
import { StructuralDesign } from "./pole-analyzer/StructuralDesignInput";
import { PoleInput } from "./pole-analyzer/PoleInput";
import { DirectObjectInput } from "./pole-analyzer/DirectObjectInput";
import { OverheadWireInput } from "./pole-analyzer/OverheadWireInput";
import { ResultsTable } from "./pole-analyzer/ResultsTable";
import { ArmObjectInput } from "./pole-analyzer/ArmObjectInput";
import { ArmInput } from "./pole-analyzer/ArmInput";
import { useProjectStorage } from "./pole-analyzer/hooks/useProjectStorage";
import STANDARD_POLE_DATA from "../data/specStandardPole.json";
import { PoleBasicForm } from "./pole-analyzer/StandardLightingPoleInput";
import { PoleTypeStandardInput } from "./pole-analyzer/PoleTypeStandardInput";
import { StepPoleTypeInput } from "./pole-analyzer/StepPoleTypeInput";

// UTILS & MODALS: Shared logic and overlays
import * as Modal from "./pole-analyzer/PoleAnalyzerModal";
import * as Utils from "../utils/pole-analyzer";

// ICONS: UI Elements
import {
  Plus,
  CheckCircle,
  Circle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Calculator,
  Copy,
  ClipboardPaste,
} from "lucide-react";

export function PoleStructuralAnalyzer() {
  const navigate = useNavigate();
  const { type: projectType } = useParams();

  const condition = JSON.parse(
    sessionStorage.getItem(`${projectType}_condition`) || "{}",
  );

  //
  // ==========================================================================
  // 1. STATES & REFS MANAGEMENT
  // ==========================================================================
  //
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

  // STATE: Structural Design of pole
  const [structuralDesign, setStructuralDesign] = useProjectStorage(
    projectType,
    "structuralDesign",
    { lowestStep: "", overDesign: "" },
  );
  const [structuralDesignErrors, setStructuralDesignErrors] = useState({});

  // STATE: Sections input, each section represents one pole
  const [sections, setSections] = useProjectStorage(projectType, "sections", [
    {
      id: "1",
      name: "",
      material: "STK400",
      poleType: "Straight",
      diameterLower: "",
      diameterUpper: "",
      thicknessLower: "",
      thicknessUpper: "",
      height: "",
      quantity: "1",
    },
  ]);
  const [sectionsErrors, setSectionsErrors] = useState({});

  // STATE: Standard pole type
  const [poleTypeStandard, setPoleTypeStandard] = useProjectStorage(
    projectType,
    "poleTypeStandard",
    [
      {
        poleShape: "",
      },
    ],
  );

  // STATE: Standarad pole input
  const [poleBasic, setPoleBasic] = useProjectStorage(
    projectType,
    "poleBasic",
    [
      {
        poleType: "",
        groundPosition: "",
        height: "",
      },
    ],
  );

  // STATE: Standarad pole input
  const [stepPoleStandard, setStepPoleStandard] = useProjectStorage(
    projectType,
    "stepPoleStandard",
    [
      {
        poleType: "",
        combinationGroup: "",
        combination: "",
        upperThickness: "",
        upperLength: "",
        lowerThickness: "",
        lowerLength: "",
        installationType: "",
        embedmentLength: "",
      },
    ],
  );
  const [stepPoleStandardErrors, setStepPoleStandardErrors] = useState({});

  // STATE: Direct Object input
  const [directObjects, setDirectObjects] = useProjectStorage(
    projectType,
    "directObjects",
    [],
  );
  const [doErrors, setDoErrors] = useState({});

  // STATE: Overhead Wire input
  const [overheadWires, setOverheadWires] = useProjectStorage(
    projectType,
    "overheadWires",
    [],
  );
  const [ohwErrors, setOhwErrors] = useState({});

  // STATE: Arm input
  const [arms, setArms] = useProjectStorage(projectType, "arms", []);
  const [armsErrors, setArmsErrors] = useState({});

  // STATE: Arm Object input
  const [aoErrors, setAoErrors] = useState({});

  // STATE: Results all step pole
  const [results, setResults] = useProjectStorage(projectType, "results", []);

  // STATE: Results all direct object
  const [resultsDo, setResultsDo] = useProjectStorage(
    projectType,
    "resultsDo",
    [],
  );

  // STATE: Results all overhead wire
  const [resultsOhw, setResultsOhw] = useProjectStorage(
    projectType,
    "resultsOhw",
    [],
  );

  // STATE: Results all arm
  const [resultsArm, setResultsArm] = useProjectStorage(
    projectType,
    "resultsArm",
    [],
  );

  // STATE: Results table
  const [showResults, setShowResults] = useProjectStorage(
    projectType,
    "showResults",
    false,
  );

  //
  // ==========================================================================
  // 2. UI CONTROL STATES (Modals, Toggles, & Temp Data)
  // ==========================================================================
  //
  // --- Step Pole Controls ---
  const [confirmDelete, setConfirmDelete] = useState(null); // section deletion confirmation
  const [activeTab, setActiveTab] = useState("1"); // currently active section
  const activeSection = sections.find((s) => s.id === activeTab);
  const isFirstSection = sections.findIndex((s) => s.id === activeTab) === 0;
  const isLastSection =
    sections.findIndex((s) => s.id === activeTab) === sections.length - 1;
  const isOnlySection = sections.length === 1;
  const isNextDisabledPole = isOnlySection || isLastSection;
  const isBackDisabledPole = isOnlySection || isFirstSection;

  // --- Direct Object (DO) Controls ---
  const [confirmReduceDo, setConfirmReduceDo] = useState(null);
  const [doClipboard, setDoClipboard] = useState(null);
  const [doInputValue, setDoInputValue] = useState("");
  const [confirmDeleteDo, setConfirmDeleteDo] = useState(null);

  // --- Overhead Wire (OHW) Controls ---
  const [confirmReduceOhw, setConfirmReduceOhw] = useState(null);
  const [ohwClipboard, setOhwClipboard] = useState(null);
  const [ohwInputValue, setOhwInputValue] = useState("");
  const [confirmDeleteOhw, setConfirmDeleteOhw] = useState(null);

  // --- Step Arm Controls ---
  const [confirmDeleteArm, setConfirmDeleteArm] = useState(null); // arm deletion confirmation
  const [activeTabArm, setActiveTabArm] = useState("1"); // currently active section
  const activeArm = arms.find((s) => s.idArm === activeTabArm);
  const armObjects = activeArm?.armObjects || [];
  const currentIndex = arms.findIndex((s) => s.idArm === activeTabArm);
  const isFirstArm = currentIndex === 0;
  const isLastArm = currentIndex === arms.length - 1;
  const isOnlyArm = arms.length === 1;
  const isNextDisabledArm = isOnlyArm || isLastArm;
  const isBackDisabledArm = isOnlyArm || isFirstArm;
  const [armClipboard, setArmClipboard] = useState(null);

  // --- Arm Object (AO) Controls ---
  const [confirmReduceAo, setConfirmReduceAo] = useState(null);
  const [aoClipboard, setAoClipboard] = useState(null);
  const [aoInputValue, setAoInputValue] = useState("");
  const [confirmDeleteAo, setConfirmDeleteAo] = useState(null);

  // --- Global UI & Navigation ---
  const [toast, setToast] = useState(null); // toast notifications { message, type }
  const [showCoverPopup, setShowCoverPopup] = useState(false); // show cover popup
  const [isCalculated, setIsCalculated] = useState(false);

  // --- Accordion States (Toggles) ---
  const [isExpandedPole, setIsExpandedPole] = useState(true); // expand/collapse pole input
  const [isExpandedDo, setIsExpandedDo] = useState(true); // expand/collapse direct object input
  const [isExpandedOhw, setIsExpandedOhw] = useState(true); // expand/collapse overhead wire input
  const [isExpandedArm, setIsExpandedArm] = useState(true); // expand/collapse arm input

  //
  // ==========================================================================
  // 3. DATA INITIALIZATION & LIFECYCLE SYNC
  // ==========================================================================
  //
  // --- ID Recovery: Sync Refs with Session Storage to prevent ID conflict ---
  // Generates unique Pole IDs and syncs with sessionStorage on mount
  const sectionIdRef = useRef(1);
  useEffect(() => {
    const saved = sessionStorage.getItem("sections");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        sectionIdRef.current = Math.max(...parsed.map((s) => Number(s.id)));
      }
    }
  }, []);

  // Generates unique Direct Object IDs and syncs with sessionStorage on mount
  const doIdRef = useRef(1);
  useEffect(() => {
    const saved = sessionStorage.getItem("directObjects");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        doIdRef.current = Math.max(...parsed.map((s) => Number(s.idDo)));
      }
    }
  }, []);

  // Generates unique Overhead Wire IDs and syncs with sessionStorage on mount
  const ohwIdRef = useRef(1);
  useEffect(() => {
    const saved = sessionStorage.getItem("overheadWires");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        ohwIdRef.current = Math.max(...parsed.map((s) => Number(s.idOhw)));
      }
    }
  }, []);

  // --- ID Recovery: Sync Refs with Session Storage to prevent ID conflict ---
  // Generates unique Arm IDs and syncs with sessionStorage on mount
  const armIdRef = useRef(1);
  useEffect(() => {
    const saved = sessionStorage.getItem("arms");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        armIdRef.current = Math.max(...parsed.map((s) => Number(s.idArm)));
      }
    }
  }, []);

  // Generates unique Arm Object IDs and syncs with sessionStorage on mount
  const aoIdRef = useRef(1);

  useEffect(() => {
    const saved = sessionStorage.getItem("arms");

    if (!saved) return;

    const parsed = JSON.parse(saved);

    const allAoIds = parsed.flatMap(
      (arm) => arm.armObjects?.map((o) => Number(o.idAo)) || [],
    );

    if (allAoIds.length > 0) {
      aoIdRef.current = Math.max(...allAoIds);
    }
  }, []);

  // --- UI Guard: Ensure Active Tab always points to a valid pole ---
  useEffect(() => {
    if (sections.length === 0) return;
    const isActiveValid = sections.some((s) => s.id === activeTab);
    if (!isActiveValid) {
      setActiveTab(sections[0].id);
    }
  }, [sections, activeTab]);

  // --- UI Guard: Ensure Active Tab always points to a valid arm ---
  useEffect(() => {
    if (arms.length === 0) return;
    const isActiveValidArm = arms.some((s) => s.idArm === activeTabArm);
    if (!isActiveValidArm) {
      setActiveTabArm(arms[0].idArm);
    }
  }, [arms, activeTabArm]);

  //
  // ==========================================================================
  // 5. ACTION HANDLERS & FEATURE LOGIC
  // ==========================================================================
  //
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

  // ------------------------ Function for structural design pole input ------------------------
  // FUNCTION: Update structural design data
  const structuralDesignUpdate = (updates) => {
    Utils.updateStructuralDesign(
      structuralDesign,
      updates,
      setStructuralDesign,
    );
    Utils.clearError(updates, setStructuralDesignErrors);
  };

  // FUNCTION: Check if structural design form is complete
  const handleStructuralDesignComplete = () => {
    return Utils.structuralDesignComplete(structuralDesign);
  };

  // ------------------------ Function for PoleInput ------------------------
  // FUNCTION: Update pole type standrad data
  const handleUpdatePoleTypeStandard = (updates) => {
    Utils.updatePoleTypeStandard(
      poleTypeStandard,
      updates,
      setPoleTypeStandard,
    );
  };

  // FUNCTION: Check if pole type standard form is complete
  const handlePoleTypeStandardComplete = () => {
    return Utils.poleTypeStandardComplete(poleTypeStandard);
  };

  // FUNCTION: State updater function and persistence handler Stepped Pole Standard
  const handleUpdateStepPoleStandard = (updates) => {
    Utils.updateStepPoleStandard(
      stepPoleStandard,
      updates,
      setStepPoleStandard,
    );

    Utils.clearError(updates, setStepPoleStandardErrors);
  };

  // FUNCTION: Check if stepPoleStandard form is complete
  const handleStepPoleStandardComplete = () => {
    return Utils.stepPoleStandardComplete(stepPoleStandard);
  };

  // FUNCTION: State updater function and persistence handler Taper Pole Standard
  const handleUpdatePoleBasic = (updates) => {
    Utils.updatePoleBasic(poleBasic, updates, setPoleBasic);
  };

  // FUNCTION: Add a new section (max 4 section)
  const handleAddSection = () => {
    Utils.addSection(sections, setSections, setActiveTab, sectionIdRef);
  };

  // FUNCTION: Remove a section by ID
  const handleRemoveSection = (id) => {
    Utils.removeSection(id, sections, setSections, activeTab, setActiveTab);
  };

  // FUNCTION: Update a specific section's data
  const handleUpdateSection = (id, updates) => {
    Utils.updateSection(id, updates, setSections, sections);
    Utils.clearSectionError(id, updates, setSectionsErrors);
  };

  // FUNCTION: Reset the active section to default values
  const resetCurrentSection = () => {
    Utils.resetCurrent(setSections, sections, activeTab);
  };

  // FUNCTION: Go to the next section tab
  const handleNextSection = () => {
    Utils.goToNextSection(sections, activeTab, setActiveTab);
  };

  // FUNCTION: Check if a section pole is complete
  const handleIsSectionComplete = (section) => {
    return Utils.isSectionComplete(section);
  };

  // ------------------------ Function for DirectObjectInput ------------------------
  // FUNCTION: Add a new object (max 25 object) by Input
  const handleAddDoByInput = () => {
    Utils.syncDoByInput(
      doInputValue,
      directObjects,
      setDirectObjects,
      doIdRef,
      setConfirmReduceDo,
    );

    // reset input setelah reduce
    setDoInputValue("");
  };

  // FUNCTION: Confirm reduce Direct Object
  const confirmReduceDirectObjects = () => {
    setDirectObjects((prev) => prev.slice(0, confirmReduceDo.to));
    setConfirmReduceDo(null);
  };

  // FUNCTION: Cancel reduce Direct Object
  const cancelReduceDirectObjects = () => {
    setDoInputValue(directObjects.length.toString());
    setConfirmReduceDo(null);
  };

  // FUNCTION: Add a new object (max 25 object) by click
  const handleAddDo = () => {
    Utils.addDo(directObjects, setDirectObjects, doIdRef);
  };

  // FUNCTION: Copy Direct Object data into clipboard
  const handleCopyDo = (directObject) => {
    Utils.copyDo(directObject, setDoClipboard);
  };

  // FUNCTION: Paste clipboard data into selected Direct Object
  const handlePasteDo = (idDo) => {
    Utils.pasteDo(idDo, setDirectObjects, doClipboard);
  };

  // FUNCTION: Remove a object by ID
  const handleRemoveDo = (idDo) => {
    Utils.removeDo(idDo, directObjects, setDirectObjects);
  };

  // FUNCTION: Update a specific object's data
  const handleUpdateDo = (idDo, updates) => {
    Utils.updateDo(idDo, updates, setDirectObjects, directObjects);
    Utils.clearDoError(idDo, updates, setDoErrors);
  };

  // FUNCTION: Reset the active direct object to default values
  const handleResetCurrentDo = (idDo) => {
    Utils.resetCurrentDo(setDirectObjects, directObjects, idDo);
  };

  // FUNCTION: Check if a direct object is complete
  const handleIsDoComplete = (directObject) => {
    return Utils.isDoComplete(directObject);
  };

  // ------------------------ Function for OverheadWireInput ------------------------
  // FUNCTION: Add a new OHW (max 8 OHW) by Input
  const handleAddOhwByInput = () => {
    Utils.syncOhwByInput(
      ohwInputValue,
      overheadWires,
      setOverheadWires,
      ohwIdRef,
      setConfirmReduceOhw,
    );

    // reset input setelah reduce
    setOhwInputValue("");
  };

  // FUNCTION: Confirm reduce Overhead Wire
  const confirmReduceOverheadWires = () => {
    setOverheadWires((prev) => prev.slice(0, confirmReduceOhw.to));
    setConfirmReduceOhw(null);
  };

  // FUNCTION: Cancel reduce Overhead Wire
  const cancelReduceOverheadWires = () => {
    setOhwInputValue(overheadWires.length.toString());
    setConfirmReduceOhw(null);
  };

  // FUNCTION: Add a new OHW (max 8 OHW) by click
  const handleAddOhw = () => {
    Utils.addOhw(overheadWires, setOverheadWires, ohwIdRef);
  };

  // FUNCTION: Copy Direct Object data into clipboard
  const handleCopyOhw = (overheadWire) => {
    Utils.copyOhw(overheadWire, setOhwClipboard);
  };

  // FUNCTION: Paste clipboard data into selected Direct Object
  const handlePasteOhw = (idOhw) => {
    Utils.pasteOhw(idOhw, setOverheadWires, ohwClipboard);
  };

  // FUNCTION: Remove a object by ID
  const handleRemoveOhw = (idOhw) => {
    Utils.removeOhw(idOhw, overheadWires, setOverheadWires);
  };

  // FUNCTION: Update a specific object's data
  const handleUpdateOhw = (idOhw, updates) => {
    Utils.updateOhw(idOhw, updates, setOverheadWires, overheadWires);
    Utils.clearOhwError(idOhw, updates, setOhwErrors);
  };

  // FUNCTION: Reset the active direct object to default values
  const handleResetCurrentOhw = (idOhw) => {
    Utils.resetCurrentOhw(setOverheadWires, overheadWires, idOhw);
  };

  // FUNCTION: Check if a direct object is complete
  const handleIsOhwComplete = (overheadWire) => {
    return Utils.isOhwComplete(overheadWire);
  };

  // ------------------------ Function for ArmInput ------------------------
  // FUNCTION: Add a new arm (max 6 Arm)
  const handleAddArm = () => {
    Utils.addArm(arms, setArms, setActiveTabArm, armIdRef);
  };

  // FUNCTION: Copy Arm Object data into clipboard
  const onCopyArm = (arm) => {
    Utils.copyArm(arm, setArmClipboard);
  };

  // FUNCTION: Paste clipboard data into selected Arm Spec
  const onPasteArm = (idArm) => {
    Utils.pasteArm(idArm, setArms, armClipboard);
  };

  // FUNCTION: Remove a arm by ID
  const handleRemoveArm = (idArm) => {
    Utils.removeArm(idArm, setArms, activeTabArm, setActiveTabArm);
  };

  // FUNCTION: Update a specific arm's data
  const handleUpdateArm = (idArm, updates) => {
    Utils.updateArm(idArm, updates, setArms, arms);
    Utils.clearArmError(idArm, updates, setArmsErrors);
  };

  // FUNCTION: Reset the active arm to default values
  const resetCurrentArm = () => {
    Utils.resetCurrentArm(setArms, arms, activeTabArm);
  };

  // FUNCTION: Check if a arm is complete
  const handleIsArmComplete = (arm) => {
    return Utils.isArmComplete(arm);
  };

  // ------------------------ Function for ArmObjectInput ------------------------
  const updateActiveArmObjects = (newObjects) => {
    setArms((prev) =>
      prev.map((arm) =>
        arm.idArm === activeTabArm ? { ...arm, armObjects: newObjects } : arm,
      ),
    );
  };

  // FUNCTION: Add a new object (max 5 object) by Input
  const handleAddAoByInput = () => {
    Utils.syncAoByInput(
      aoInputValue,
      armObjects,
      updateActiveArmObjects,
      aoIdRef,
      setConfirmReduceAo,
    );

    // reset input setelah reduce
    setAoInputValue("");
  };

  // FUNCTION: Confirm reduce Arm Object
  const confirmReduceArmObjects = () => {
    const reduced = armObjects.slice(0, confirmReduceAo.to);

    updateActiveArmObjects(reduced);
    setConfirmReduceAo(null);
  };

  // FUNCTION: Cancel reduce Arm Object
  const cancelReduceArmObjects = () => {
    setAoInputValue(armObjects.length.toString());
    setConfirmReduceAo(null);
  };

  // FUNCTION: Add a new object (max 5 object) by click
  const handleAddAo = () => {
    Utils.addAo(armObjects, updateActiveArmObjects, aoIdRef);
  };

  // FUNCTION: Copy Arm Object data into clipboard
  const handleCopyAo = (armObject) => {
    Utils.copyAo(armObject, setAoClipboard);
  };

  // FUNCTION: Paste clipboard data into selected Arm Object
  const handlePasteAo = (idAo) => {
    Utils.pasteAo(idAo, armObjects, updateActiveArmObjects, aoClipboard);
  };

  // FUNCTION: Remove a object by ID
  const handleRemoveAo = (idAo) => {
    Utils.removeAo(idAo, armObjects, updateActiveArmObjects);
  };

  // FUNCTION: Update a specific object's data
  const handleUpdateAo = (idAo, updates) => {
    Utils.updateAo(idAo, updates, armObjects, updateActiveArmObjects);
    Utils.clearAoError(idAo, updates, setAoErrors);
  };

  // FUNCTION: Reset the active arm object to default values
  const handleResetCurrentAo = (idAo) => {
    Utils.resetCurrentAo(idAo, armObjects, updateActiveArmObjects);
  };

  // FUNCTION: Check if a arm object is complete
  const handleIsAoComplete = (armObject) => {
    return Utils.isAoComplete(armObject);
  };

  // ------------------------ Function for All Form ------------------------
  // helper biar bersih
  const emptyData = () => ({
    sections: [],
    directObjects: [],
    arms: [],
    overheadWires: [],
  });

  // ------------------------
  // FUNCTION: Resolve standard data pole
  // ------------------------
  const resolveStandardData = () => {
    // =========================
    // NON STANDARD => pakai input user
    // =========================
    if (condition.method !== "standard") {
      return {
        sections,
        directObjects,
        arms,
        overheadWires,
      };
    }

    const shape = poleTypeStandard.poleShape;

    // =========================
    // TAPER (FULL STATIC)
    // =========================
    if (shape === "taper") {
      const selectedPole =
        STANDARD_POLE_DATA?.taper?.[poleBasic.poleType]?.[
          poleBasic.groundPosition
        ]?.[poleBasic.height];

      if (!selectedPole) {
        showToast("Standard taper pole data not found.");
        return emptyData();
      }

      return {
        sections: selectedPole.sections || [],
        directObjects: selectedPole.directObjects || [],
        arms: selectedPole.arms || [],
        overheadWires: selectedPole.overheadWires || [],
      };
    }

    // =========================
    // STRAIGHT (HYBRID)
    // =========================
    if (shape === "straight") {
      const key = stepPoleStandard.combination;

      if (!key) {
        showToast("Please select pole combination.");
        return emptyData();
      }

      const selectedPole = STANDARD_POLE_DATA?.straight?.[key];

      if (!selectedPole) {
        showToast("Standard straight pole data not found.");
        return emptyData();
      }

      const sections = selectedPole.sections.map((sec, index) => {
        let thickness = "";
        let height = "";

        // =========================
        // SECTION 1 => UPPER
        // =========================
        if (index === 0) {
          thickness = stepPoleStandard.upperThickness;
          height = stepPoleStandard.upperLength;
        }

        // =========================
        // SECTION 2 => LOWER
        // =========================
        if (index === 1) {
          thickness = stepPoleStandard.lowerThickness;
          height = stepPoleStandard.lowerLength;
        }

        return {
          ...sec,
          thicknessLower: thickness,
          thicknessUpper: thickness,
          height,
        };
      });

      return {
        sections,
        directObjects: [],
        arms: [],
        overheadWires: [],
      };
    }

    return emptyData();
  };

  // FUNCTION: Step navigation helper (dynamic flow control)
  const { buttonLabel, nextStep, isLast } = Utils.getStepNavigation(
    condition,
    "pole",
  );

  // FUNCTION: Perform calculation for all form
  const calculateResults = () => {
    // =========================
    // RESET ALL PREVIOUS ERRORS
    // =========================
    setStructuralDesignErrors({});
    setSectionsErrors({});
    setDoErrors({});
    setOhwErrors({});
    setArmsErrors({});
    setAoErrors({});
    setStepPoleStandardErrors({});

    // =========================
    // RESOLVE DATA SOURCE (MANUAL / STANDARD)
    // =========================
    const {
      sections: finalSections,
      directObjects: finalDo,
      arms: finalArms,
      overheadWires: finalOhw,
    } = resolveStandardData();

    // =========================
    // STRUCTURAL DESIGN VALIDATION
    // =========================
    const isStructuralValid = handleStructuralDesignComplete();

    if (!isStructuralValid) {
      setStructuralDesignErrors(
        Utils.getStructuralDesignErrors(structuralDesign),
      );
      showToast("Please complete Structural Design first.");
      return;
    }

    // =========================
    // POLE TYPE STANDARD VALIDATION
    // =========================
    const isPoleTypeStandardValid = handlePoleTypeStandardComplete();

    if (condition.method === "standard" && !isPoleTypeStandardValid) {
      showToast("Please select the pole type first.");
      return;
    }

    // Safety check kalau standard tapi tidak ditemukan di JSON
    if (
      condition.method === "standard" &&
      (!finalSections || finalSections.length === 0)
    ) {
      showToast("Selected standard configuration not found.");
      return;
    }

    // =========================
    // CALL VALIDATION + CALCULATION ENGINE
    // =========================
    const result = Utils.handleCalculateResults(
      poleTypeStandard,
      condition,
      showToast,
      structuralDesign,
      finalSections,
      handleIsSectionComplete,
      finalDo,
      handleIsDoComplete,
      finalOhw,
      handleIsOhwComplete,
      finalArms,
      handleIsArmComplete,
      handleIsAoComplete,
      stepPoleStandard,
      handleStepPoleStandardComplete,
      setResults,
      setResultsDo,
      setResultsOhw,
      setResultsArm,
      setShowResults,
    );

    // Defensive guard (prevent crash if undefined)
    if (!result || typeof result.isValid === "undefined") {
      console.error("Invalid calculation result:", result);
      return;
    }

    const { isValid, errors } = result;

    // =========================
    // IF INVALID => MAP ERRORS TO UI
    // =========================
    if (!isValid) {
      if (errors.section && condition.method !== "standard") {
        setSectionsErrors(Utils.getSectionsErrors(finalSections));
      }

      if (errors.directObject && condition.method !== "standard") {
        setDoErrors(Utils.getDoErrors(finalDo));
      }

      if (errors.overheadWire && condition.method !== "standard") {
        setOhwErrors(Utils.getOhwErrors(finalOhw));
      }

      if (errors.arm && condition.method !== "standard") {
        setArmsErrors(Utils.getArmsErrors(finalArms));
      }

      if (errors.armObject && condition.method !== "standard") {
        setAoErrors(Utils.getAoErrors(finalArms));
      }

      if (
        errors.stepPoleStandard &&
        condition.method !== "custom" &&
        poleTypeStandard.poleShape === "straight"
      ) {
        setStepPoleStandardErrors(
          Utils.getStepPoleStandardErrors(stepPoleStandard),
        );
      }

      return;
    }

    // =========================
    // SUCCESS => SCROLL TO RESULT
    // =========================
    setIsCalculated(true);
    const target = document.getElementById("results-section");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // FUNCTION: Complete current step and navigate or generate report
  const handleFinish = () => {
    if (!isCalculated) return;

    if (isLast) {
      handleOpenCoverPopup();
    } else {
      navigate(`/calculation/${projectType}/${nextStep}`);
    }
  };

  // FUNCTION: Full validation before navigating to the report page
  const handleMakeReport = () => {
    // reset all previous errors
    setCoverErrors({});
    setStructuralDesignErrors({});
    setSectionsErrors({});
    setDoErrors({});
    setOhwErrors({});
    setArmsErrors({});
    setAoErrors({});
    setStepPoleStandardErrors({});

    // resolve data source (custom or standard)
    const {
      sections: finalSections,
      directObjects: finalDo,
      arms: finalArms,
      overheadWires: finalOhw,
    } = resolveStandardData();

    // safety check kalau standard tapi tidak ditemukan di JSON
    if (
      condition.method === "standard" &&
      (!finalSections || finalSections.length === 0)
    ) {
      showToast("Selected standard configuration not found.");
      return;
    }

    // call report validation engine
    const result = Utils.makeReport(
      poleTypeStandard,
      condition,
      results,
      showToast,
      handleIsCoverComplete,
      handleStructuralDesignComplete,
      finalSections,
      handleIsSectionComplete,
      finalArms,
      handleIsArmComplete,
      finalDo,
      handleIsDoComplete,
      finalOhw,
      handleIsOhwComplete,
      handleIsAoComplete,
      stepPoleStandard,
      handleStepPoleStandardComplete,
    );

    // Defensive guard (pravent crash if undefined)
    if (!result) return;

    const { isValid, errors } = result;

    // if invalid => map errors to UI
    if (!isValid) {
      // Validate report cover details (project name, marks, and dates)
      if (errors.cover) {
        setCoverErrors(Utils.getCoverErrors(cover));
      }

      // Verify pole structural design integrity and over-design ratios
      if (errors.structuralDesign) {
        setStructuralDesignErrors(
          Utils.getStructuralDesignErrors(structuralDesign),
        );
      }

      // Check all pole section dimensions and material specifications
      if (errors.section && condition.method !== "standard") {
        setSectionsErrors(Utils.getSectionsErrors(sections));
      }

      // Ensure all mounted equipment (DO) data is valid for the final report
      if (errors.directObject && condition.method !== "standard") {
        setDoErrors(Utils.getDoErrors(directObjects));
      }

      // Final check for overhead wire tension, span, and clearance data
      if (errors.overheadWire && condition.method !== "standard") {
        setOhwErrors(Utils.getOhwErrors(overheadWires));
      }

      // Check all arm dimensions and material specifications
      if (errors.arm && condition.method !== "standard") {
        setArmsErrors(Utils.getArmsErrors(arms));
      }

      // Ensure all mounted equipment (AO) data is valid for the final report
      if (errors.armObject && condition.method !== "standard") {
        setAoErrors(Utils.getAoErrors(arms));
      }

      if (
        errors.stepPoleStandard &&
        condition.method !== "custom" &&
        poleTypeStandard.poleShape === "straight"
      ) {
        setStepPoleStandardErrors(
          Utils.getStepPoleStandardErrors(stepPoleStandard),
        );
      }

      return;
    }

    // success => navigate to report
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
        sections: finalSections,
        directObjects: finalDo,
        arms: finalArms,
        overheadWires: finalOhw,
      },
    });
  };

  // FUNCTION: Trigger toast notification with specific message and type.
  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  // FUNCTION: Conditional form calculation input (custom or standard)
  const isCustomPoleMode =
    projectType !== "lighting-pole" || condition.method === "custom";

  return (
    <div className="min-h-screen">
      {/* ============================================================
        HEADER UTAMA CALCULATION PAGE (Judul + Subjudul + Icon)
      ============================================================ */}
      <HeaderCalculationPage />

      {/* ============================================================
        MAIN CONTENT AREA
      ============================================================ */}
      <div className="mx-6 2040:mx-[250px] pt-1 pb-8 hp:mx-2">
        {/* ============================================================
          FORM POLE (Bagian input section/Step Pole)
        ============================================================ */}
        <div
          className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out ${
            isExpandedPole
              ? "rounded-t-2xl hp:rounded-t-xl"
              : "rounded-2xl hp:rounded-xl"
          } hp:px-4 hp:py-3`}
          onClick={() => setIsExpandedPole(!isExpandedPole)}
        >
          {/* Judul cover */}
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
            <h2
              id="pole-section-title"
              className="text-white text-sm font-bold hp:text-xs hp:font-semibold"
            >
              Pole Specifications
            </h2>
          </div>

          {/* Icon toggle (up/down) */}
          <div className="p-2">
            {isExpandedPole ? (
              <ChevronUp className="w-5 h-5 text-white hp:w4 hp:h-4" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white hp:w4 hp:h-4" />
            )}
          </div>
        </div>

        {/* Body form (collapsible) */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpandedPole
              ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl"
              : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
          }`}
        >
          <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 hp:rounded-b-xl">
            {/* Structural Design Form */}
            <div className="border-b border-gray-200 px-6 pt-6 pb-7 hp:px-4 hp:pt-4">
              <div className="flex items-center justify-between mb-4 hp:mb-2">
                <div>
                  <h2 className="text-[#0d3b66] font-medium flex items-center text-sm gap-2 hp:text-xs hp:font-medium">
                    <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4"></div>
                    Structural Design
                  </h2>
                </div>
              </div>

              <StructuralDesign
                structuralDesign={structuralDesign}
                onUpdate={structuralDesignUpdate}
                errors={structuralDesignErrors}
              />
            </div>

            {projectType === "lighting-pole" &&
              condition.method === "standard" && (
                <>
                  <div className="pt-6 hp:pt-4"></div>
                  <PoleTypeStandardInput
                    poleTypeStandard={poleTypeStandard}
                    onUpdate={handleUpdatePoleTypeStandard}
                  />

                  {poleTypeStandard.poleShape === "taper" && (
                    <PoleBasicForm
                      poleBasic={poleBasic}
                      onUpdate={handleUpdatePoleBasic}
                    />
                  )}

                  {poleTypeStandard.poleShape === "straight" && (
                    <StepPoleTypeInput
                      stepPoleStandard={stepPoleStandard}
                      onUpdate={handleUpdateStepPoleStandard}
                      errors={stepPoleStandardErrors}
                    />
                  )}
                </>
              )}

            {isCustomPoleMode && (
              <>
                {/* Step Pole Form */}
                <div className="px-6 pt-6 hp:p-4">
                  {/* HEADER ADD SECTION */}
                  <div className="flex items-center justify-between mb-4 hp:items-start hp:flex-col hp:gap-6 hp:mb-6">
                    <div>
                      <h2 className="text-[#0d3b66] text-sm flex items-center gap-1 hp:text-xs hp:flex hp:items-start">
                        <div className="w-1 h-5 bg-[#3399cc] rounded-full mr-1 hp:h-4"></div>
                        <span className="font-semibold">
                          Configure up to 6 Step Poles
                        </span>
                        <span className=" font-medium hp:hidden">
                          with detailed specifications
                        </span>
                      </h2>
                    </div>
                    {/* BUTTON ADD SECTION */}
                    <button
                      onClick={handleAddSection}
                      disabled={sections.length >= 6}
                      className={`flex items-center gap-2 text-sm px-7 py-3 rounded-lg font-medium transition-all shadow-md 
                      ${
                        sections.length >= 6
                          ? "bg-gray-300 text-black opacity-40 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:shadow-xl transition-transform duration-300 hover:scale-105"
                      } hp:text-xs hp:px-[22px] hp:py-[10px] hp:self-center`}
                    >
                      <Plus className="w-5 h-5 hp:w-4 hp:h-4" />
                      Add Step
                    </button>
                  </div>

                  {/* TABS SECTION */}
                  <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 hp:gap-2 hp:px-2 hp:justify-start scroll-smooth scrollbar-hide">
                    {sections.map((section, index) => {
                      const isComplete = handleIsSectionComplete(section);
                      const isActive = activeTab === section.id;

                      return (
                        <div key={section.id} className="flex-shrink-0">
                          <button
                            onClick={() => setActiveTab(section.id)}
                            className={`
                              flex items-center gap-3 px-7 py-2.5 rounded-lg border-2 transition-all
                              ${
                                isActive
                                  ? "bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100 shadow-md"
                                  : isComplete
                                    ? "bg-green-50 border-green-500 text-green-700 hover:bg-green-100"
                                    : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                              }

                              hp:px-4 hp:py-2
                              hp:border
                              hp:shadow-none
                              hp:gap-2
                            `}
                          >
                            {/* ICON */}
                            {isComplete ? (
                              <CheckCircle className="w-5 h-5 hp:w-4 hp:h-4" />
                            ) : (
                              <Circle className="w-5 h-5 hp:w-4 hp:h-4" />
                            )}

                            {/* TEXT */}
                            <span className="text-sm font-medium hp:text-xs">
                              <span className="hidden hp:inline">
                                {index + 1}
                              </span>
                              <span className="hp:hidden">
                                {isActive ? `Step ${index + 1}` : index + 1}
                              </span>
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div className="mt-5 border-t border-gray-200"></div>
                </div>

                {/* ACTIVE SECTION INPUT */}
                {activeSection && (
                  <div className="p-6 hp:px-4 hp:pt-2 hp:pb-4">
                    <div className="space-y-6 hp:space-y-4">
                      {/* Header section title */}
                      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 hp:mb-4 hp:pb-4">
                        <div className="flex items-center gap-3 hp:gap-2">
                          <div className="w-9 h-9 text-sm rounded-lg bg-gradient-to-br from-[#0d3b66] to-[#3399cc] flex items-center justify-center text-white hp:w-8 hp:h-8">
                            {sections.findIndex((s) => s.id === activeTab) + 1}
                          </div>
                          <div>
                            <h4 className="text-[#0d3b66] text-sm font-medium hp:text-xs">
                              Step Pole
                              {activeSection.name && ` : ${activeSection.name}`}
                            </h4>
                            <p className="text-xs text-gray-500 hp:text-[10px]">
                              {activeSection.poleType} Type
                            </p>
                          </div>
                        </div>

                        {sections.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(activeSection.id);
                            }}
                            title="Delete Step"
                            className="
                              flex items-center gap-2
                              px-6 py-2.5
                              rounded-lg
                              border border-red-200
                              text-red-600
                              bg-red-50
                              hover:bg-red-100 hover:border-red-300
                              transition-all
                              font-medium
                              shadow-sm

                              hp:px-[11px] hp:py-[8px]
                            "
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-xs hp:hidden">
                              Delete Step
                            </span>
                          </button>
                        )}
                      </div>
                      <PoleInput
                        section={activeSection}
                        onUpdate={(updates) =>
                          handleUpdateSection(activeTab, updates)
                        }
                        errors={sectionsErrors[activeTab] || {}}
                      />
                    </div>

                    {/* FOOTER: RESET + CALCULATE / NEXT */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 hp:mt-5 hp:pt-4">
                      {/* LEFT: RESET */}
                      <button
                        onClick={resetCurrentSection}
                        className="flex items-center text-sm gap-2 px-7 py-2.5 bg-[#eef2f6] text-[#0d3b66]
                        border-2 border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium
                        hp:text-xs hp:px-[22px] hp:py-[8px]"
                      >
                        <RotateCcw className="w-5 h-5 hp:w-4 hp:h-4" />
                        Reset
                      </button>

                      {/* RIGHT GROUP */}
                      <div className="flex items-center gap-3 hp:gap-2">
                        {/* BACK BUTTON */}
                        <button
                          onClick={
                            !isBackDisabledPole
                              ? () => {
                                  const currentIndex = sections.findIndex(
                                    (s) => s.id === activeTab,
                                  );
                                  setActiveTab(sections[currentIndex - 1].id);
                                }
                              : undefined
                          }
                          disabled={isBackDisabledPole}
                          className={`
                            flex items-center text-sm gap-2 px-7 py-2.5 rounded-lg font-medium
                          border-2 transition-colors hp:text-xs hp:px-[22px] hp:py-[8px]

                            ${
                              isBackDisabledPole
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-[#eef2f6] text-[#0d3b66] border-[#d0d7e2] hover:bg-[#e2e8f0]"
                            }
                          `}
                        >
                          <ChevronLeft className="w-5 h-5 hp:w-4 hp:h-4" />
                          <span className="hp:hidden">Back</span>
                        </button>

                        {/* NEXT STEP (ALWAYS EXIST) */}
                        <button
                          onClick={
                            !isNextDisabledPole ? handleNextSection : undefined
                          }
                          disabled={isNextDisabledPole}
                          className={`
                            flex items-center text-sm gap-2 px-7 py-2.5 border-2
                            rounded-lg font-medium shadow-md transition-all
                            hp:text-xs hp:px-[22px] hp:py-[8px]

                            ${
                              isNextDisabledPole
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none"
                                : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110"
                            }
                          `}
                        >
                          Next Step
                          <ChevronRight className="w-5 h-5 hp:w-4 hp:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ============================================================
          FORM DIRECT OBJECT (Bagian Direct Object perhitungan)
        ============================================================ */}
        {isCustomPoleMode && (
          <>
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-20 transition-all duration-500 ease-in-out ${
                isExpandedDo
                  ? "rounded-t-2xl hp:rounded-t-xl"
                  : "rounded-2xl hp:rounded-xl"
              } hp:px-4 hp:py-3`}
              onClick={() => setIsExpandedDo(!isExpandedDo)}
            >
              {/* Judul cover */}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                  Direct Object
                </h2>
              </div>

              {/* Icon toggle (up/down) */}
              <div className="p-2">
                {isExpandedDo ? (
                  <ChevronUp className="w-5 h-5 text-white hp:w4 hp:h-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white hp:w4 hp:h-4" />
                )}
              </div>
            </div>

            {/* Body form (collapsible) */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpandedDo
                  ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <DirectObjectInput
                directObjects={directObjects}
                doInputValue={doInputValue}
                setDoInputValue={setDoInputValue}
                onUpdate={handleUpdateDo}
                errors={doErrors}
                onAddDo={handleAddDoByInput}
                onCopyDo={handleCopyDo}
                onPasteDo={handlePasteDo}
                hasClipboard={Boolean(doClipboard)}
                setConfirmDeleteDo={setConfirmDeleteDo}
                resetCurrentDo={handleResetCurrentDo}
                handleAddDo={handleAddDo}
              />
            </div>
          </>
        )}

        {/* ============================================================
          FORM OVERHEAD WIRE (Bagian Overhead Wire perhitungan)
        ============================================================ */}
        {isCustomPoleMode && (
          <>
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-20 transition-all duration-500 ease-in-out ${
                isExpandedOhw
                  ? "rounded-t-2xl hp:rounded-t-xl"
                  : "rounded-2xl hp:rounded-xl"
              } hp:px-4 hp:py-3`}
              onClick={() => setIsExpandedOhw(!isExpandedOhw)}
            >
              {/* Judul cover */}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                  Overhead Wire
                </h2>
              </div>

              {/* Icon toggle (up/down) */}
              <div className="p-2">
                {isExpandedOhw ? (
                  <ChevronUp className="w-5 h-5 text-white hp:w4 hp:h-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white hp:w4 hp:h-4" />
                )}
              </div>
            </div>

            {/* Body form (collapsible) */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpandedOhw
                  ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <OverheadWireInput
                overheadWires={overheadWires}
                ohwInputValue={ohwInputValue}
                setOhwInputValue={setOhwInputValue}
                onUpdate={handleUpdateOhw}
                errors={ohwErrors}
                onAddOhw={handleAddOhwByInput}
                onCopyOhw={handleCopyOhw}
                onPasteOhw={handlePasteOhw}
                hasClipboard={Boolean(ohwClipboard)}
                setConfirmDeleteOhw={setConfirmDeleteOhw}
                resetCurrentOhw={handleResetCurrentOhw}
                handleAddOhw={handleAddOhw}
              />
            </div>
          </>
        )}

        {/* ============================================================
          FORM ARM (Bagian input arm)
        ============================================================ */}
        {projectType !== "acemast" && isCustomPoleMode && (
          <>
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-20 transition-all duration-500 ease-in-out ${
                isExpandedArm
                  ? "rounded-t-2xl hp:rounded-t-xl"
                  : "rounded-2xl hp:rounded-xl"
              } hp:px-4 hp:py-3`}
              onClick={() => setIsExpandedArm(!isExpandedArm)}
            >
              {/* Judul cover */}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                <h2
                  id="pole-section-title"
                  className="text-white text-sm font-bold hp:text-xs hp:font-semibold"
                >
                  Arm and Object Specifications
                </h2>
              </div>

              {/* Icon toggle (up/down) */}
              <div className="p-2">
                {isExpandedArm ? (
                  <ChevronUp className="w-5 h-5 text-white hp:w4 hp:h-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white hp:w4 hp:h-4" />
                )}
              </div>
            </div>

            {/* Body form (collapsible) */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isExpandedArm
                  ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 hp:rounded-b-xl">
                {/* Step Pole Form */}
                <div className="px-6 pt-6 hp:p-4">
                  {/* HEADER ADD ARM */}
                  <div className="flex items-center justify-between mb-4 hp:items-start hp:flex-col hp:gap-6 hp:mb-6">
                    <div>
                      <h2 className="text-[#0d3b66] text-sm flex items-center gap-1 hp:text-xs hp:flex hp:items-start">
                        <div className="w-1 h-5 bg-[#3399cc] rounded-full mr-1 hp:h-4"></div>
                        <span className="font-semibold">
                          Configure up to 6 Arms
                        </span>
                        <span className=" font-medium hp:hidden">
                          with detailed specifications
                        </span>
                      </h2>
                    </div>
                    {/* BUTTON ADD ARM */}
                    <button
                      onClick={handleAddArm}
                      disabled={arms.length >= 6}
                      className={`flex items-center gap-2 text-sm px-7 py-3 rounded-lg font-medium transition-all shadow-md 
                      ${
                        arms.length >= 6
                          ? "bg-gray-300 text-black opacity-40 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:shadow-xl transition-transform duration-300 hover:scale-105"
                      } hp:text-xs hp:px-[22px] hp:py-[10px] hp:self-center`}
                    >
                      <Plus className="w-5 h-5 hp:w-4 hp:h-4" />
                      Add Arm
                    </button>
                  </div>

                  {/* TABS SECTION */}
                  <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 hp:gap-2 hp:px-2 hp:justify-start scroll-smooth scrollbar-hide">
                    {arms.map((arm, index) => {
                      const isCompleteArm = handleIsArmComplete(arm);
                      const isActiveArm = activeTabArm === arm.idArm;

                      return (
                        <div key={arm.idArm} className="flex-shrink-0">
                          <button
                            onClick={() => setActiveTabArm(arm.idArm)}
                            className={`
                              flex items-center gap-3 px-7 py-2.5 rounded-lg border-2 transition-all
                              ${
                                isActiveArm
                                  ? "bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100 shadow-md"
                                  : isCompleteArm
                                    ? "bg-green-50 border-green-500 text-green-700 hover:bg-green-100"
                                    : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                              }

                              hp:px-4 hp:py-2
                              
                              hp:border
                              hp:shadow-none
                              hp:gap-2
                            `}
                          >
                            {/* ICON */}
                            {isCompleteArm ? (
                              <CheckCircle className="w-5 h-5 hp:w-4 hp:h-4" />
                            ) : (
                              <Circle className="w-5 h-5 hp:w-4 hp:h-4" />
                            )}

                            {/* TEXT */}
                            <span className="text-sm font-medium hp:text-xs">
                              <span className="hidden hp:inline">
                                {index + 1}
                              </span>
                              <span className="hp:hidden">
                                {isActiveArm ? `Arm ${index + 1}` : index + 1}
                              </span>
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div className="mt-5 border-t border-gray-200"></div>
                </div>

                {/* ACTIVE SECTION INPUT */}
                {activeArm && (
                  <div className="p-6 hp:px-4 hp:pt-2 hp:pb-4">
                    <div className="space-y-6 hp:space-y-4">
                      {/* Header section title */}
                      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 hp:mb-4 hp:pb-4">
                        <div className="flex items-center gap-3 hp:gap-2">
                          <div className="w-9 h-9 text-sm rounded-lg bg-gradient-to-br from-[#0d3b66] to-[#3399cc] flex items-center justify-center text-white hp:w-8 hp:h-8">
                            {arms.findIndex((s) => s.idArm === activeTabArm) +
                              1}
                          </div>
                          <div>
                            <h4 className="text-[#0d3b66] text-sm font-medium hp:text-xs">
                              Arm
                              {activeArm.nameArm && ` : ${activeArm.nameArm}`}
                            </h4>
                            {/* <p className="text-xs text-gray-500 hp:text-[10px]">
                          {activeArm.armType} Type
                        </p> */}
                          </div>
                        </div>

                        {arms.length > 0 && (
                          <div className="flex items-center gap-6 hp:hidden">
                            {/* Copy / Paste */}
                            <div className="flex items-center gap-2 ml-2">
                              <button
                                onClick={() => onCopyArm(activeArm)}
                                title="Copy this Arm Spec"
                                className="p-2 rounded-md border bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => onPasteArm(activeArm.idArm)}
                                disabled={!armClipboard}
                                title={
                                  armClipboard
                                    ? "Paste copied Arm Spec"
                                    : "No copied Arm Spec"
                                }
                                className={`p-2 rounded-md border transition ${
                                  armClipboard
                                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <ClipboardPaste className="w-4 h-4" />
                              </button>

                              {/* Divider */}
                              <div className="h-8 w-px mx-4 bg-gray-300 opacity-70"></div>

                              {/* Reset */}
                              <button
                                onClick={resetCurrentArm}
                                className="flex items-center gap-2 px-5 py-2 h-[40px] bg-[#eef2f6] text-[#0d3b66] border border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition text-xs font-medium"
                              >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                              </button>
                            </div>

                            {/* Delete */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteArm(activeArm.idArm);
                              }}
                              title="Delete Arm"
                              className="flex items-center gap-2 px-4 py-2 h-[40px] rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition text-xs font-medium"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="text-xs hp:hidden">
                                Delete Arm
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                      <ArmInput
                        arm={activeArm}
                        onUpdate={(updates) =>
                          handleUpdateArm(activeTabArm, updates)
                        }
                        armError={armsErrors[activeTabArm] || {}}
                      />
                      {activeArm && (
                        <ArmObjectInput
                          armObjects={
                            Array.isArray(activeArm.armObjects)
                              ? activeArm.armObjects
                              : []
                          }
                          aoInputValue={aoInputValue}
                          setAoInputValue={setAoInputValue}
                          onUpdate={handleUpdateAo}
                          errors={aoErrors}
                          onAddAo={handleAddAoByInput}
                          onCopyAo={handleCopyAo}
                          onPasteAo={handlePasteAo}
                          hasClipboard={Boolean(aoClipboard)}
                          setConfirmDeleteAo={setConfirmDeleteAo}
                          resetCurrentAo={handleResetCurrentAo}
                          handleAddAo={handleAddAo}
                        />
                      )}
                    </div>

                    {/* FOOTER: BACK + CALCULATE / NEXT */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 hp:mt-5 hp:pt-4">
                      {/* LEFT: BACK */}
                      <button
                        onClick={() => {
                          if (!isBackDisabledArm) {
                            setActiveTabArm(arms[currentIndex - 1].idArm);
                          }
                        }}
                        disabled={isBackDisabledArm}
                        className={`
                          flex items-center text-sm gap-2 px-7 py-2.5 rounded-lg font-medium
                          border-2 transition-colors hp:text-xs hp:px-[22px] hp:py-[8px]

                          ${
                            isBackDisabledArm
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-[#eef2f6] text-[#0d3b66] border-[#d0d7e2] hover:bg-[#e2e8f0]"
                          }
                        `}
                      >
                        <ChevronLeft className="w-5 h-5 hp:w-4 hp:h-4" />
                        <span className="hp:hidden">Back</span>
                      </button>

                      {/* RIGHT: NEXT ARM */}
                      <button
                        onClick={() => {
                          if (!isNextDisabledArm) {
                            setActiveTabArm(arms[currentIndex + 1].idArm);
                          }
                        }}
                        disabled={isNextDisabledArm}
                        className={`
                          flex items-center text-sm gap-2 px-7 py-2.5 border-2
                            rounded-lg font-medium shadow-md transition-all
                            hp:text-xs hp:px-[22px] hp:py-[8px]
                          ${
                            isNextDisabledArm
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none"
                              : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110"
                          }
                        `}
                      >
                        Next Arm
                        <ChevronRight className="w-5 h-5 hp:w-4 hp:h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-between p-5 mt-12 mb-20 bg-gradient-to-b from-white to-slate-50 rounded-2xl border border-gray-200 shadow-sm">
          {/* Kiri kosong biar center tetap center */}
          <div className="w-[120px]" />

          {/* Calculate (CENTER - PRIMARY ACTION) */}
          <button
            onClick={calculateResults}
            className="flex items-center gap-2 px-7 py-2.5
            bg-gradient-to-r from-[#0d3b66] to-[#3399cc]
            text-white rounded-lg text-sm
            hover:brightness-110 transition-all shadow-sm font-medium
            hp:text-xs hp:px-[22px] hp:py-[10px]"
          >
            <Calculator className="w-5 h-5 hp:w-4 hp:h-4" />
            Calculate Results
          </button>

          {/* Finish (KANAN - NEXT STEP) */}
          <button
            onClick={handleFinish}
            disabled={!isCalculated}
            className={`
              flex items-center gap-2 px-7 py-2.5 rounded-lg text-sm font-medium
              transition-all hp:text-xs hp:px-[22px] hp:py-[10px]

              ${
                !isCalculated
                  ? "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm"
              }
            `}
          >
            {buttonLabel}
            <ChevronRight className="w-5 h-5 hp:w-4 hp:h-4" />
          </button>
        </div>

        {/* TABEL HASIL KALKULASI */}
        <div id="results-section">
          {showResults && (
            <ResultsTable
              results={results}
              resultsDo={resultsDo}
              resultsOhw={resultsOhw}
              resultsArm={resultsArm}
            />
          )}
        </div>
      </div>

      {/* ===========================================> MODAL SYSTEM: Handles all user interactions for data entry and confirmation <=========================================== */}
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

      {/* Delete Confirmation Modal for Step Pole */}
      <Modal.ConfirmDeletePoleModal
        confirmDelete={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        handleRemoveSection={() => handleRemoveSection(confirmDelete)}
      />

      {/* Delete Confirmation Modal for Direct Object */}
      <Modal.ConfirmDeleteDoModal
        confirmDelete={confirmDeleteDo}
        onClose={() => setConfirmDeleteDo(false)}
        handleRemoveDo={() => handleRemoveDo(confirmDeleteDo)}
      />

      {/* Delete Confirmation Modal for Direct Object */}
      <Modal.ConfirmReduceDoModal
        confirmReduceDo={confirmReduceDo}
        cancelReduceDirectObjects={cancelReduceDirectObjects}
        confirmReduceDirectObjects={confirmReduceDirectObjects}
      />

      {/* Delete Confirmation Modal for Overhead Wire */}
      <Modal.ConfirmDeleteOhwModal
        confirmDelete={confirmDeleteOhw}
        onClose={() => setConfirmDeleteOhw(false)}
        handleRemoveOhw={() => handleRemoveOhw(confirmDeleteOhw)}
      />

      {/* Delete Confirmation Modal for Overhead Wire */}
      <Modal.ConfirmReduceOhwModal
        confirmReduceOhw={confirmReduceOhw}
        cancelReduceOverheadWires={cancelReduceOverheadWires}
        confirmReduceOverheadWires={confirmReduceOverheadWires}
      />

      {/* Delete Confirmation Modal for Arm */}
      <Modal.ConfirmDeleteArmModal
        confirmDeleteArm={confirmDeleteArm}
        onClose={() => setConfirmDeleteArm(false)}
        handleRemoveArm={() => handleRemoveArm(confirmDeleteArm)}
      />

      {/* Delete Confirmation Modal for Arm Object */}
      <Modal.ConfirmDeleteAoModal
        confirmDelete={confirmDeleteAo}
        onClose={() => setConfirmDeleteAo(false)}
        handleRemoveAo={() => handleRemoveAo(confirmDeleteAo)}
      />

      {/* Delete Confirmation Modal for Arm Object */}
      <Modal.ConfirmReduceAoModal
        confirmReduceAo={confirmReduceAo}
        cancelReduceArmObjects={cancelReduceArmObjects}
        confirmReduceArmObjects={confirmReduceArmObjects}
      />
    </div>
  );
}
