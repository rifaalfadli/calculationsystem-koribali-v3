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
  condition,
  showToast,
  structuralDesign,
  structuralDesignComplete,
  sections,
  handleIsSectionComplete,
  directObjects,
  handleIsDoComplete,
  overheadWires,
  handleIsOhwComplete,
  arms,
  handleIsArmComplete,
  handleIsAoComplete,
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
  };

  // =========================
  // STRUCTURAL DESIGN VALIDATION
  // =========================
  if (!structuralDesignComplete()) {
    showToast("Please complete all Pole Specification fields.");
    errors.structuralDesign = true;
  }

  // =========================
  // POLE VALIDATION (ONLY CUSTOM MODE)
  // =========================
  if (condition.method !== "standard") {
    for (const section of sections || []) {
      if (!handleIsSectionComplete(section)) {
        showToast("Please complete all Pole Specification fields.");
        errors.section = true;
        break;
      }
    }
  }

  // POLE VALIDATION (custom error check)
  const validatePoleError = validatePole(sections, structuralDesign);

  if (validatePoleError) {
    showToast(validatePoleError);
    errors.section = true;
    return { isValid: false, errors };
  }

  // =========================
  // DIRECT OBJECT VALIDATION
  // =========================
  if (condition.method !== "standard") {
    for (const directObject of directObjects || []) {
      if (!handleIsDoComplete(directObject)) {
        showToast("Please complete all Direct Object fields.");
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
        showToast("Please complete all Overhead Wire fields.");
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
        showToast("Please complete all Arm Specification fields.");
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
          showToast("Please complete all Arm Object fields.");
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
  condition,
  results,
  showToast,
  handleIsCoverComplete,
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
  };

  // CHECK 1: Results
  if (!results || results.length === 0) {
    showToast("No calculation results pole available.");
    errors.results = true;
  }

  // CHECK 3: Cover
  if (!handleIsCoverComplete()) {
    showToast("Please complete the Cover Information first.");
    errors.cover = true;
  }

  // CHECK 5: Structural Design
  if (!structuralDesignComplete()) {
    showToast("Please complete all Pole Specification first.");
    errors.structuralDesign = true;
  }

  // CHECK 6: Sections/Steps
  if (condition.method !== "standard") {
    for (const section of sections || []) {
      if (!handleIsSectionComplete(section)) {
        showToast("Please complete all Pole Specification first.");
        errors.section = true;
        break;
      }
    }
  }

  // CHECK 7: Direct Object
  if (condition.method !== "standard") {
    for (const directObject of directObjects || []) {
      if (!handleIsDoComplete(directObject)) {
        showToast("Please complete all Direct Object first.");
        errors.directObject = true;
        break;
      }
    }
  }

  // CHECK 8: Overhead Wire
  if (condition.method !== "standard") {
    for (const overheadWire of overheadWires) {
      if (!handleIsOhwComplete(overheadWire)) {
        showToast("Please complete all Overhead Wire first.");
        errors.overheadWire = true;
        break;
      }
    }
  }

  // CHECK 9: Arms
  if (condition.method !== "standard") {
    for (const arm of arms || []) {
      if (!handleIsArmComplete(arm)) {
        showToast("Please complete all Arm Specification first.");
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
          showToast("Please complete all Arm Object first.");
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
  setMethod,
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

  // Reset Method and Standard Input
  setMethod(null);

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
