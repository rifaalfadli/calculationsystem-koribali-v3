import {
  calculatePoleResults,
  calculateDoResults,
  calculateOhwResults,
  calculateArmResults,
} from "./calculationResults";

import { validatePole } from "./validation";

// ===============================================================================
// FUNCTION: Perform calculation for all form
// ===============================================================================
export const handleCalculateResults = (
  poleTypeStandard,
  condition,
  showToast,
  structuralDesign,
  sections,
  handleIsSectionComplete,
  directObjects,
  handleIsDoComplete,
  overheadWires,
  handleIsOhwComplete,
  arms,
  handleIsArmComplete,
  handleIsAoComplete,
  stepPoleStandard,
  handleStepPoleStandardComplete,
  setResults,
  setResultsDo,
  setResultsOhw,
  setResultsArm,
  setShowResults,
) => {
  const errors = {
    structuralDesign: false,
    section: false,
    directObject: false,
    overheadWire: false,
    arm: false,
    armObject: false,
    stepPoleStandard: false,
  };
  // =========================
  // POLE VALIDATION (ONLY CUSTOM MODE)
  // =========================
  let sectionIncomplete = false;
  if (condition.method !== "standard") {
    for (const section of sections || []) {
      if (!handleIsSectionComplete(section)) {
        showToast("Please correct the errors in Pole Specification fields.");
        errors.section = true;
        sectionIncomplete = true;
        break;
      }
    }
  }

  // =========================
  // STEP POLE STANDRAD VALIDATION
  // =========================
  if (
    condition.method !== "custom" &&
    poleTypeStandard.poleShape === "straight"
  ) {
    if (!handleStepPoleStandardComplete(stepPoleStandard, condition)) {
      showToast(
        "Please correct the errors in Stepped Pole Type Specifications fields.",
      );
      errors.stepPoleStandard = true;
    }
  }

  // POLE VALIDATION (custom error check)
  if (!sectionIncomplete) {
    const validatePoleError = validatePole(sections, structuralDesign);

    if (validatePoleError) {
      showToast(validatePoleError);
      errors.section = true;
      return { isValid: false, errors };
    }
  }

  // =========================
  // DIRECT OBJECT VALIDATION
  // =========================
  if (condition.method !== "standard") {
    for (const directObject of directObjects || []) {
      if (!handleIsDoComplete(directObject)) {
        showToast("Please correct the errors in Direct Object fields.");
        errors.directObject = true;
        break;
      }
    }
  }

  // =========================
  // OVERHEAD WIRE VALIDATION
  // =========================
  if (condition.method !== "standard") {
    for (const overheadWire of overheadWires || []) {
      if (!handleIsOhwComplete(overheadWire)) {
        showToast("Please correct the errors Overhead Wire fields.");
        errors.overheadWire = true;
        break;
      }
    }
  }

  // =========================
  // ARM VALIDATION
  // =========================
  if (condition.method !== "standard") {
    for (const arm of arms || []) {
      if (!handleIsArmComplete(arm)) {
        showToast("Please correct the errors Arm Specification fields.");
        errors.arm = true;
        break;
      }
    }
  }

  // =========================
  // ARM OBJECT VALIDATION
  // =========================
  if (condition.method !== "standard") {
    for (const arm of arms || []) {
      if (!arm) continue;

      for (const armObject of arm.armObjects || []) {
        if (!handleIsAoComplete(armObject)) {
          showToast("Please correct the errors Arm Object fields.");
          errors.armObject = true;
          break;
        }
      }

      if (errors.armObject) break;
    }
  }

  const isValid = Object.values(errors).every((v) => v === false);

  if (!isValid) {
    return { isValid, errors };
  }

  // =========================
  // CALCULATION ENGINE
  // =========================
  const calculatedResults = calculatePoleResults(sections);
  const calculatedResultsDo = calculateDoResults(directObjects);
  const calculatedResultsOhw = calculateOhwResults(overheadWires);
  const calculatedResultsArm = calculateArmResults(arms);

  setResults(calculatedResults);
  setResultsDo(calculatedResultsDo);
  setResultsOhw(calculatedResultsOhw);
  setResultsArm(calculatedResultsArm);
  setShowResults(true);

  return { isValid, errors };
};

// ===============================================================================
// FUNCTION: Validate all inputs before generating the final report
// ===============================================================================
export const makeReport = (
  poleTypeStandard,
  condition,
  results,
  showToast,
  handleIsCoverComplete,
  structuralDesign,
  structuralDesignComplete,
  sections,
  handleIsSectionComplete,
  arms,
  handleIsArmComplete,
  directObjects,
  handleIsDoComplete,
  overheadWires,
  handleIsOhwComplete,
  handleIsAoComplete,
  stepPoleStandard,
  handleStepPoleStandardComplete,
) => {
  const errors = {
    results: false,
    cover: false,
    structuralDesign: false,
    section: false,
    directObject: false,
    overheadWire: false,
    arm: false,
    armObject: false,
    stepPoleStandard: false,
  };

  // CHECK 1: Results
  if (!results || results.length === 0) {
    showToast("No calculation results pole available.");
    errors.results = true;
  }

  // CHECK 2: Cover
  if (!handleIsCoverComplete()) {
    showToast("Please complete the Cover Information fields.");
    errors.cover = true;
  }

  // CHECK 3: Structural Design
  if (condition.method !== "standard") {
    if (!structuralDesignComplete()) {
      showToast("Please correct the errors in Structural Design fields.");
      errors.structuralDesign = true;
    }
  }

  // CHECK 4: Custom Pole
  let sectionIncomplete = false;
  if (condition.method !== "standard") {
    for (const section of sections || []) {
      if (!handleIsSectionComplete(section)) {
        showToast("Please correct the errors in Pole Specifications fields.");
        errors.section = true;
        sectionIncomplete = true;
        break;
      }
    }
  }

  // CHECK 5: Validation Custom Pole
  if (!sectionIncomplete) {
    const validatePoleError = validatePole(sections, structuralDesign);

    if (validatePoleError) {
      showToast(validatePoleError);
      errors.section = true;
      return { isValid: false, errors };
    }
  }

  // CHECK 6: Standard Pole (Stepped Pole Type)
  if (
    condition.method !== "custom" &&
    poleTypeStandard.poleShape === "straight"
  ) {
    if (!handleStepPoleStandardComplete(stepPoleStandard, condition)) {
      showToast("Please correct the errors in  Specifications fields.");
      errors.stepPoleStandard = true;
    }
  }

  // CHECK 7: Direct Object
  if (condition.method !== "standard") {
    for (const directObject of directObjects || []) {
      if (!handleIsDoComplete(directObject)) {
        showToast("Please correct the errors in Direct Object fields.");
        errors.directObject = true;
        break;
      }
    }
  }

  // CHECK 8: Overhead Wire
  if (condition.method !== "standard") {
    for (const overheadWire of overheadWires) {
      if (!handleIsOhwComplete(overheadWire)) {
        showToast("Please correct the errors in Overhead Wire fields.");
        errors.overheadWire = true;
        break;
      }
    }
  }

  // CHECK 9: Arms
  if (condition.method !== "standard") {
    for (const arm of arms || []) {
      if (!handleIsArmComplete(arm)) {
        showToast("Please correct the errors in Arm Specifications fields.");
        errors.arm = true;
        break;
      }
    }
  }

  // CHECK 10: Arm Object
  if (condition.method !== "standard") {
    for (const arm of arms || []) {
      if (!arm) continue;

      for (const armObject of arm.armObjects || []) {
        if (!handleIsAoComplete(armObject)) {
          showToast("Please correct the errors in Arm Object fields.");
          errors.armObject = true;
          break;
        }
      }

      if (errors.armObject) break;
    }
  }

  const isValid = Object.values(errors).every((v) => v === false);

  return { isValid, errors };
};

// ===============================================================================
// FUNCTIONS: Completely reset all calculation data, UI states, and storage
// ===============================================================================
export const deleteReport = (
  projectType,
  setResults,
  setResultsDo,
  setResultsOhw,
  setResultsArm,
  setShowResults,
  setCover,
  setStructuralDesign,
  setSections,
  setDirectObjects,
  setOverheadWires,
  setArms,
  setPoleBasic,
  setActiveTab,
  setIsExpandedPole,
  sectionIdRef,
  doIdRef,
  ohwIdRef,
  armIdRef,
  setIsExpandedDo,
  setIsExpandedOhw,
  setIsExpandedArm,
) => {
  // Reset Calculation Result
  setResults([]);
  setResultsDo([]);
  setResultsOhw([]);
  setResultsArm([]);
  setShowResults(false);
  setPoleBasic({
    poleType: "",
    groundPosition: "",
    height: "",
  });

  // Reset Cover
  setCover({
    managementMark: "",
    calculationNumber: "",
    projectName: "",
    contentr2: "",
    contentr3: "",
    date: "",
  });

  // Reset Structural Design
  setStructuralDesign({
    lowestStep: "",
    overDesign: "",
  });

  // Reset Sections (1 section default)
  setSections([
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

  // Reset Direct Objects
  setDirectObjects([]);
  doIdRef.current = 0;

  // Reset Overhead Wire
  setOverheadWires([]);
  ohwIdRef.current = 0;

  // Reset Arm
  setArms([]);
  armIdRef.current = 0;

  // Reset active tab ke section 1
  setActiveTab("1");
  sectionIdRef.current = 1;

  // Reset UI control
  setIsExpandedPole(true);
  setIsExpandedDo(true);
  setIsExpandedOhw(true);
  setIsExpandedArm(false);

  // Hapus semua sessionStorage
  const keys = [
    "cover",
    "structuralDesign",
    "sections",
    "directObjects",
    "overheadWires",
    "results",
    "resultsDo",
    "resultsOhw",
  ];

  keys.forEach((key) => sessionStorage.removeItem(`${projectType}_${key}`));

  sessionStorage.removeItem("arms");
  sessionStorage.removeItem("armObjects");
  sessionStorage.removeItem("resultsArm");
  sessionStorage.removeItem("method");
  sessionStorage.removeItem("poleBasic");
  sessionStorage.removeItem("projectType");
};

export const clearCalculationSession = (projectType) => {
  const keys = [
    "cover",
    "condition",
    "structuralDesign",
    "sections",
    "directObjects",
    "overheadWires",
    "results",
    "resultsDo",
    "resultsOhw",
    "resultsArm",
    "showResults",
    "opType",
    "opBoxType",
    "opRType",
    "bpType",
    "fourRibType",
    "eightRibType",
    "foundationType",
    "sqrCaissonType",
    "roundCaissonType",
    "poleTypeStandard",
    "arms",
    "poleBasic",
    "stepPoleStandard",
    "hasReport",
    "showResultsOp",
    "calculatedOp",
    "showResultsBp",
    "calculatedFoundation",
    "showResultsFoundation",
    "reportSnapshot",
  ];

  keys.forEach((key) => sessionStorage.removeItem(`${projectType}_${key}`));

  sessionStorage.removeItem(`${projectType}_calculation_config`);
  sessionStorage.removeItem("projectType");
};
