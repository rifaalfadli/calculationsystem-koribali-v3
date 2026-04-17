// ====================================================
// Global Helpers
// ====================================================
// FUNCTION: check if a value is empty
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  return value.toString().trim() === "";
};

// FUNCTION: check if value is negative
export const isNegative = (value) => {
  if (value === null || value === undefined) return false;
  if (value.toString().trim() === "") return false;

  return Number(value) < 0;
};

// FUNCTION: check if a value is filled and non-negative
export const isPositiveFilled = (value) => {
  return !isEmpty(value) && !isNegative(value);
};

// FUNCTION: check if value is invalid (empty or negative)
export const isInvalidNumber = (value) => {
  return isEmpty(value) || isNegative(value);
};

// FUNCTION: helper to clear errors per field
export const clearError = (updates, setErrors) => {
  setErrors((prev) => {
    const next = { ...prev };

    Object.entries(updates).forEach(([key, value]) => {
      // kalau sudah ada isi, error = false
      if (value && value.toString().trim() !== "") {
        next[key] = false;
      }
    });

    return next;
  });
};

// FUNCTION: get error message for numeric input
export const getNumericError = (value) => {
  if (isEmpty(value)) return "Required field";
  if (isNegative(value)) return "Value must be positive";
  return "";
};

// ====================================================
// Function for Cover Input
// ====================================================
// FUNCTION: Check if cover information from is complete
export const isCoverComplete = (cover) => {
  return [
    cover.managementMark,
    cover.calculationNumber,
    cover.projectName,
    cover.date,
  ].every((v) => v && v.trim() !== "");
};

// FUNCTION: Create an error checker helper for the cover
export const getCoverErrors = (cover) => ({
  managementMark: isEmpty(cover.managementMark),
  calculationNumber: isEmpty(cover.calculationNumber),
  projectName: isEmpty(cover.projectName),
  date: isEmpty(cover.date),
});

// ====================================================
// Function for Condition Input
// ====================================================
// FUNCTION: Check if condition information form is complete
export const isConditionComplete = (condition) => {
  return (
    !isEmpty(condition.designStandard) &&
    !isEmpty(condition.method) &&
    isPositiveFilled(condition.windSpeed) &&
    isPositiveFilled(condition.airDensity)
  );
};

// FUNCTION: Create an error checker helper for the condition
export const getConditionErrors = (condition) => ({
  designStandard: isEmpty(condition.designStandard),
  windSpeed: isInvalidNumber(condition.windSpeed),
  airDensity: isInvalidNumber(condition.airDensity),
  method: isEmpty(condition.method),
});

// ====================================================
// Function for Structural Design Pole Input
// ====================================================
// FUNCTION: Check if Structural Design Pole information form is complete
export const structuralDesignComplete = (structuralDesign) => {
  return (
    !isEmpty(structuralDesign.lowestStep) &&
    isPositiveFilled(structuralDesign.overDesign)
  );
};

// FUNCTION: Create an error checker helper for the Structural Design Pole
export const getStructuralDesignErrors = (structuralDesign) => ({
  lowestStep: isEmpty(structuralDesign.lowestStep),
  overDesign: isInvalidNumber(structuralDesign.overDesign),
});

// ====================================================
// Function for Pole Type Standard Input
// ====================================================
// FUNCTION: Check if Pole Type Standard information form is complete
export const poleTypeStandardComplete = (poleTypeStandard) => {
  return [poleTypeStandard.poleShape].every((v) => !isEmpty(v));
};

// ====================================================
// Function for Pole Input
// ====================================================
// FUNCTION: Check if Stepped Pole Type Standard form is complete
export const stepPoleStandardComplete = (stepPoleStandard, condition) => {
  const isBase = condition.baseplateEnabled;
  const isEmbedment = !condition.baseplateEnabled;
  const isUnderGL = stepPoleStandard.groundPosition === "underGL";

  return [
    !isEmpty(stepPoleStandard.upperThickness),
    isPositiveFilled(stepPoleStandard.upperLength),
    !isEmpty(stepPoleStandard.lowerThickness),
    isPositiveFilled(stepPoleStandard.lowerLength),

    // ===== EMBEDMENT =====
    ...(isEmbedment ? [!isEmpty(stepPoleStandard.embedmentLength)] : []),

    // ===== BASE =====
    ...(isBase ? [!isEmpty(stepPoleStandard.groundPosition)] : []),

    // ===== UNDER GL ONLY =====
    ...(isBase && isUnderGL ? [!isEmpty(stepPoleStandard.heightDepth)] : []),
  ].every(Boolean);
};

// FUNCTION: Create an error checker helper for the Stepped Pole Type Standard
export const getStepPoleStandardErrors = (stepPoleStandard, condition) => {
  const isBase = condition.baseplateEnabled;
  const isEmbedment = !condition.baseplateEnabled;
  const isUnderGL = stepPoleStandard.groundPosition === "underGL";

  return {
    upperThickness: isEmpty(stepPoleStandard.upperThickness),
    upperLength: isInvalidNumber(stepPoleStandard.upperLength),
    lowerThickness: isEmpty(stepPoleStandard.lowerThickness),
    lowerLength: isInvalidNumber(stepPoleStandard.lowerLength),

    // ===== EMBEDMENT =====
    embedmentLength: isEmbedment
      ? isInvalidNumber(stepPoleStandard.embedmentLength)
      : false,

    // ===== BASE =====
    groundPosition: isBase ? isEmpty(stepPoleStandard.groundPosition) : false,

    // heightDepth cuma dicek kalau UNDER GL
    heightDepth:
      isBase && isUnderGL
        ? isInvalidNumber(stepPoleStandard.heightDepth)
        : false,
  };
};

// FUNCTION: Validate Pole Input
export const validatePole = (sections, structuralDesign) => {
  const lPole = Number(structuralDesign.lowestStep);

  // Basic validation
  if (!sections || sections.length === 0) {
    return "No pole data available.";
  }

  // Loop each pole step
  for (let i = 0; i < sections.length; i++) {
    const poleNumber = i + 1;
    const current = sections[i];
    const previous = sections[i - 1];

    // Extract & normalize values
    const {
      diameterLower,
      diameterUpper,
      thicknessLower,
      thicknessUpper,
      height,
      poleType,
    } = current;

    const dLower = Number(diameterLower);
    const dUpper = Number(diameterUpper);
    const tLower = Number(thicknessLower);
    const tUpper = Number(thicknessUpper);
    const hCurrent = Number(height);

    // ERROR 1 — Height pole tidak boleh 0 / kosong
    if (!hCurrent || hCurrent <= 0) {
      return `Pole ${poleNumber}: Height must be greater than 0. Please provide a valid height.`;
    }

    // ERROR 2 — Urutan height antar step terbalik
    if (i > 0) {
      const hPrevious = Number(previous.height);

      if (hCurrent > hPrevious) {
        return `Pole ${poleNumber}: Step height (${hCurrent}) must not be higher than the previous step (${hPrevious}). Please review the height order.`;
      }
    }

    // ERROR 3 — Lowest step melewati tinggi pole terakhir (pole paling bawah)
    if (i === sections.length - 1) {
      if (lPole >= hCurrent) {
        return `Pole ${poleNumber}: Lowest height (${lPole}) must be lower than the bottom step height (${hCurrent}). Please review your configuration.`;
      }
    }

    // ERROR 4 — Diameter dalam satu pole (Taper)
    if (poleType === "Taper") {
      if (dUpper >= dLower) {
        return `Pole ${poleNumber}: For taper type, the upper diameter (${dUpper}) must be smaller than the lower diameter (${dLower}). Please adjust the values.`;
      }
    }

    // ERROR 5 — Diameter continuity antar pole
    if (i > 0) {
      const prevLower = Number(previous.diameterLower);

      if (dUpper < prevLower) {
        return `Pole ${poleNumber}: Upper diameter (${dUpper}) must be equal to or larger than the previous step’s lower diameter (${prevLower}). Please check the diameter continuity.`;
      }
    }

    // ERROR 6 — Thickness pole melebihi radius pole
    // For Lower
    if (tLower > dLower / 2) {
      return `Pole ${poleNumber}: Lower thickness (${tLower}) should not exceed half of the lower diameter (${dLower / 2}). Please adjust the thickness value.`;
    }

    // For Upper
    if (tUpper > dUpper / 2) {
      return `Pole ${poleNumber}: Upper thickness (${tUpper}) should not exceed half of the upper diameter (${dUpper / 2}). Please adjust the thickness value.`;
    }
  }

  return null;
};

// FUNCTION: Check if a section/step pole is complete
export const isSectionComplete = (section) => {
  // ===== BASIC REQUIRED =====
  const baseValid =
    !isEmpty(section.name) &&
    isPositiveFilled(section.height) &&
    isPositiveFilled(section.quantity);

  if (!baseValid) return false;

  // ===== TYPE BASED =====
  if (section.poleType === "Taper") {
    return (
      isPositiveFilled(section.diameterLower) &&
      isPositiveFilled(section.diameterUpper) &&
      isPositiveFilled(section.thicknessLower) &&
      isPositiveFilled(section.thicknessUpper)
    );
  }

  if (section.poleType === "Straight") {
    return (
      isPositiveFilled(section.diameterLower) &&
      isPositiveFilled(section.thicknessLower)
    );
  }

  return false;
};

// FUNCTION: Create an error checker helper for the section/step
export const getSectionsErrors = (sections) => {
  const allErrors = {};

  sections.forEach((section) => {
    const e = {
      name: isEmpty(section.name),

      height: isInvalidNumber(section.height),
      quantity: isInvalidNumber(section.quantity),

      diameterLower: false,
      diameterUpper: false,
      thicknessLower: false,
      thicknessUpper: false,
    };

    if (section.poleType === "Taper") {
      e.diameterLower = isInvalidNumber(section.diameterLower);
      e.diameterUpper = isInvalidNumber(section.diameterUpper);
      e.thicknessLower = isInvalidNumber(section.thicknessLower);
      e.thicknessUpper = isInvalidNumber(section.thicknessUpper);
    } else {
      e.diameterLower = isInvalidNumber(section.diameterLower);
      e.thicknessLower = isInvalidNumber(section.thicknessLower);
    }

    if (Object.values(e).some(Boolean)) {
      allErrors[section.id] = e;
    }
  });

  return allErrors;
};

// FUNCTION: clear error for a specific section
export const clearSectionError = (sectionId, updates, setSectionsErrors) => {
  setSectionsErrors((prev) => {
    const next = { ...prev };
    const sectionError = { ...(next[sectionId] || {}) };

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        sectionError[key] = false;
      }
    });

    // kalau semua error false, hapus object error section/step
    const hasError = Object.values(sectionError).some(Boolean);
    if (hasError) {
      next[sectionId] = sectionError;
    } else {
      delete next[sectionId];
    }

    return next;
  });
};

// ====================================================
// Function for Direct Object Input
// ====================================================
// FUNCTION: Check if a direct object is complete
export const isDoComplete = (directObject) => {
  // ===== BASE REQUIRED =====
  const baseComplete =
    !isEmpty(directObject.nameDo) &&
    isPositiveFilled(directObject.frontAreaDo) &&
    isPositiveFilled(directObject.weightDo) &&
    isPositiveFilled(directObject.heightDo) &&
    isPositiveFilled(directObject.nncDo) &&
    isPositiveFilled(directObject.qtyDo);

  if (!baseComplete) return false;

  // ===== DIRECTIONAL ONLY =====
  if (directObject.typeOfDo === "directional") {
    return (
      isPositiveFilled(directObject.sideAreaDo) &&
      !isEmpty(directObject.fixAngleDo)
    );
  }

  return true;
};

// FUNCTION: Create an error checker helper for the direct object
export const getDoErrors = (directObjects) => {
  const allErrors = {};

  directObjects.forEach((directObject) => {
    const e = {
      nameDo: isEmpty(directObject.nameDo),

      frontAreaDo: isInvalidNumber(directObject.frontAreaDo),
      weightDo: isInvalidNumber(directObject.weightDo),
      heightDo: isInvalidNumber(directObject.heightDo),
      nncDo: isInvalidNumber(directObject.nncDo),
      qtyDo: isInvalidNumber(directObject.qtyDo),

      sideAreaDo: false,
      fixAngleDo: false,
    };

    if (directObject.typeOfDo === "directional") {
      e.sideAreaDo = isInvalidNumber(directObject.sideAreaDo);
      e.fixAngleDo = isEmpty(directObject.fixAngleDo);
    }

    if (Object.values(e).some(Boolean)) {
      allErrors[directObject.idDo] = e;
    }
  });

  return allErrors;
};

// FUNCTION: clear error for a specific direct object
export const clearDoError = (idDo, updates, setDoErrors) => {
  setDoErrors((prev) => {
    const next = { ...prev };
    const doError = { ...(next[idDo] || {}) };

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        doError[key] = false;
      }
    });

    // kalau semua error false => hapus object error DO
    const hasError = Object.values(doError).some(Boolean);
    if (hasError) {
      next[idDo] = doError;
    } else {
      delete next[idDo];
    }

    return next;
  });
};

// ====================================================
// Function for Overhead Wire Input
// ====================================================
// FUNCTION: Check if a overhead wire is complete
export const isOhwComplete = (overheadWire) => {
  const baseComplete =
    !isEmpty(overheadWire.nameOhw) &&
    isPositiveFilled(overheadWire.weightOhw) &&
    isPositiveFilled(overheadWire.diameterOhw) &&
    isPositiveFilled(overheadWire.fixheightOhw) &&
    isPositiveFilled(overheadWire.spanOhw) &&
    isPositiveFilled(overheadWire.saggingOhw) &&
    isPositiveFilled(overheadWire.nncOhw) &&
    !isEmpty(overheadWire.fixAngleOhw) &&
    !isEmpty(overheadWire.verticalAngleOhw);

  if (!baseComplete) return false;

  return true;
};

// FUNCTION: Create an error checker helper for the overhead wire
export const getOhwErrors = (overheadWires) => {
  const allErrors = {};

  overheadWires.forEach((overheadWire) => {
    const e = {
      nameOhw: isEmpty(overheadWire.nameOhw),

      weightOhw: isInvalidNumber(overheadWire.weightOhw),
      diameterOhw: isInvalidNumber(overheadWire.diameterOhw),
      fixheightOhw: isInvalidNumber(overheadWire.fixheightOhw),
      spanOhw: isInvalidNumber(overheadWire.spanOhw),
      saggingOhw: isInvalidNumber(overheadWire.saggingOhw),
      nncOhw: isInvalidNumber(overheadWire.nncOhw),
      fixAngleOhw: isEmpty(overheadWire.fixAngleOhw),
      verticalAngleOhw: isEmpty(overheadWire.verticalAngleOhw),
    };

    if (Object.values(e).some(Boolean)) {
      allErrors[overheadWire.idOhw] = e;
    }
  });

  return allErrors;
};

// FUNCTION: clear error for a specific overhead wire
export const clearOhwError = (idOhw, updates, setOhwErrors) => {
  setOhwErrors((prev) => {
    const next = { ...prev };
    const ohwError = { ...(next[idOhw] || {}) };

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        ohwError[key] = false;
      }
    });

    // kalau semua error false => hapus wire error OHW
    const hasError = Object.values(ohwError).some(Boolean);
    if (hasError) {
      next[idOhw] = ohwError;
    } else {
      delete next[idOhw];
    }

    return next;
  });
};

// ====================================================
// Function for Arm Input
// ====================================================
// FUNCTION: Check if an arm is complete
export const isArmComplete = (arm) => {
  const baseComplete =
    !isEmpty(arm.nameArm) &&
    !isEmpty(arm.materialArm) &&
    isPositiveFilled(arm.diameterArm) &&
    isPositiveFilled(arm.thicknessArm) &&
    isPositiveFilled(arm.lengthArm) &&
    isPositiveFilled(arm.expLengthArm) &&
    isPositiveFilled(arm.heightArm) &&
    isPositiveFilled(arm.hDistanceArm) &&
    !isEmpty(arm.fixAngleArm) &&
    isPositiveFilled(arm.nncArm) &&
    isPositiveFilled(arm.qtyArm);

  if (!baseComplete) return false;

  const armObjects = Array.isArray(arm.armObjects) ? arm.armObjects : [];

  if (armObjects.length === 0) return true;

  return armObjects.every(isAoComplete);
};

// FUNCTION: Create an error checker helper for the arm
export const getArmsErrors = (arms) => {
  const allErrors = {};

  arms.forEach((arm) => {
    const e = {
      nameArm: isEmpty(arm.nameArm),
      materialArm: isEmpty(arm.materialArm),

      diameterArm: isInvalidNumber(arm.diameterArm),
      thicknessArm: isInvalidNumber(arm.thicknessArm),
      lengthArm: isInvalidNumber(arm.lengthArm),
      expLengthArm: isInvalidNumber(arm.expLengthArm),
      heightArm: isInvalidNumber(arm.heightArm),
      hDistanceArm: isInvalidNumber(arm.hDistanceArm),
      fixAngleArm: isEmpty(arm.fixAngleArm),
      nncArm: isInvalidNumber(arm.nncArm),
      qtyArm: isInvalidNumber(arm.qtyArm),
    };

    if (Object.values(e).some(Boolean)) {
      allErrors[arm.idArm] = e;
    }
  });

  return allErrors;
};

// FUNCTION: clear error for a specific arm
export const clearArmError = (armId, updates, setArmsErrors) => {
  setArmsErrors((prev) => {
    const next = { ...prev };
    const armError = { ...(next[armId] || {}) };

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        armError[key] = false;
      }
    });

    // kalau semua error false, hapus object error arm
    const hasError = Object.values(armError).some(Boolean);
    if (hasError) {
      next[armId] = armError;
    } else {
      delete next[armId];
    }

    return next;
  });
};

// ====================================================
// Function for Arm Object Input
// ====================================================
// FUNCTION: Check if a arm object is complete
export const isAoComplete = (armObject) => {
  // ===== BASE REQUIRED =====
  const baseComplete =
    !isEmpty(armObject.nameAo) &&
    isPositiveFilled(armObject.frontAreaAo) &&
    isPositiveFilled(armObject.weightAo) &&
    isPositiveFilled(armObject.heightAo) &&
    isPositiveFilled(armObject.nncAo) &&
    isPositiveFilled(armObject.qtyAo);

  if (!baseComplete) return false;

  // ===== DIRECTIONAL ONLY =====
  if (armObject.typeOfAo === "directional") {
    return (
      isPositiveFilled(armObject.sideAreaAo) && !isEmpty(armObject.fixAngleAo)
    );
  }

  return true;
};

// FUNCTION: Create an error checker helper for the arm object
export const getAoErrors = (arms) => {
  const allErrors = {};

  arms.forEach((arm) => {
    arm.armObjects?.forEach((ao) => {
      const e = {
        nameAo: isEmpty(ao.nameAo),

        frontAreaAo: isInvalidNumber(ao.frontAreaAo),
        weightAo: isInvalidNumber(ao.weightAo),
        heightAo: isInvalidNumber(ao.heightAo),
        nncAo: isInvalidNumber(ao.nncAo),
        qtyAo: isInvalidNumber(ao.qtyAo),

        sideAreaAo: false,
        fixAngleAo: false,
      };

      if (ao.typeOfAo === "directional") {
        e.sideAreaAo = isInvalidNumber(ao.sideAreaAo);
        e.fixAngleAo = isEmpty(ao.fixAngleAo);
      }

      if (Object.values(e).some(Boolean)) {
        allErrors[ao.idAo] = e;
      }
    });
  });

  return allErrors;
};

// FUNCTION: clear error for a specific arm object
export const clearAoError = (idAo, updates, setAoErrors) => {
  setAoErrors((prev) => {
    const next = { ...prev };
    const aoError = { ...(next[idAo] || {}) };

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        aoError[key] = false;
      }
    });

    // kalau semua error false => hapus object error AO
    const hasError = Object.values(aoError).some(Boolean);
    if (hasError) {
      next[idAo] = aoError;
    } else {
      delete next[idAo];
    }

    return next;
  });
};

// ====================================================
// Function for Opening Input
// ====================================================
// FUNCTION: Check if OP box type information form is complete
export const opBoxTypeComplete = (opBoxType) => {
  return [
    opBoxType.boxWidth,
    opBoxType.opWidth,
    opBoxType.boxHeight,
    opBoxType.opSurfaceHeight,
    opBoxType.opLength,
  ].every(isPositiveFilled);
};

// FUNCTION: Create an error checker helper for the OP box type
export const getOpBoxTypeErrors = (opBoxType) => ({
  boxWidth: isInvalidNumber(opBoxType.boxWidth),
  opWidth: isInvalidNumber(opBoxType.opWidth),
  boxHeight: isInvalidNumber(opBoxType.boxHeight),
  opSurfaceHeight: isInvalidNumber(opBoxType.opSurfaceHeight),
  opLength: isInvalidNumber(opBoxType.opLength),
});

// FUNCTION: Check if OP r type information form is complete
export const opRTypeComplete = (opRType) => {
  return [opRType.opWidth, opRType.opSurfaceHeight, opRType.opLength].every(
    isPositiveFilled,
  );
};

// FUNCTION: Create an error checker helper for the OP r type
export const getOpRTypeErrors = (opRType) => ({
  opWidth: isInvalidNumber(opRType.opWidth),
  opSurfaceHeight: isInvalidNumber(opRType.opSurfaceHeight),
  opLength: isInvalidNumber(opRType.opLength),
});

// ====================================================
// Function for Baseplate Input
// ====================================================
// FUNCTION: Check if 4 Rib type information form is complete
export const fourRibTypeComplete = (fourRibType) => {
  return [
    fourRibType.bl1,
    fourRibType.bl2,
    fourRibType.ap1,
    fourRibType.ap2,
    fourRibType.dab,
    fourRibType.nab,
    fourRibType.nabTensionSide,
    fourRibType.tb,
    fourRibType.hr,
    fourRibType.lr,
    fourRibType.tr,
    fourRibType.lrs,
    fourRibType.lk,
  ].every(isPositiveFilled);
};

// FUNCTION: Create an error checker helper for the 4 rib type
export const getFourRibTypeErrors = (fourRibType) => ({
  bl1: isInvalidNumber(fourRibType.bl1),
  bl2: isInvalidNumber(fourRibType.bl2),
  ap1: isInvalidNumber(fourRibType.ap1),
  ap2: isInvalidNumber(fourRibType.ap2),
  dab: isInvalidNumber(fourRibType.dab),
  nab: isInvalidNumber(fourRibType.nab),
  nabTensionSide: isInvalidNumber(fourRibType.nabTensionSide),
  tb: isInvalidNumber(fourRibType.tb),
  hr: isInvalidNumber(fourRibType.hr),
  lr: isInvalidNumber(fourRibType.lr),
  tr: isInvalidNumber(fourRibType.tr),
  lrs: isInvalidNumber(fourRibType.lrs),
  lk: isInvalidNumber(fourRibType.lk),
});

// FUNCTION: Check if 8 Rib type information form is complete
export const eightRibTypeComplete = (eightRibType) => {
  // ===== NUMERIC FIELDS =====
  const numericFields = [
    eightRibType.bl1,
    eightRibType.bl2,
    eightRibType.ap1,
    eightRibType.ap2,
    eightRibType.dab,
    eightRibType.nab,
    eightRibType.nabTensionSide,
    eightRibType.tb,
    eightRibType.hr,
    eightRibType.lr,
    eightRibType.tr,
    eightRibType.lrs,
    eightRibType.lk,
  ];

  // ===== SPECIAL FIELD =====
  const ribAngleValid = !isEmpty(eightRibType.ribAngle);

  return numericFields.every(isPositiveFilled) && ribAngleValid;
};

// FUNCTION: Create an error checker helper for the 8 rib type
export const getEightRibTypeErrors = (eightRibType) => ({
  bl1: isInvalidNumber(eightRibType.bl1),
  bl2: isInvalidNumber(eightRibType.bl2),
  ap1: isInvalidNumber(eightRibType.ap1),
  ap2: isInvalidNumber(eightRibType.ap2),
  dab: isInvalidNumber(eightRibType.dab),
  nab: isInvalidNumber(eightRibType.nab),
  nabTensionSide: isInvalidNumber(eightRibType.nabTensionSide),
  ribAngle: isEmpty(eightRibType.ribAngle),
  tb: isInvalidNumber(eightRibType.tb),
  hr: isInvalidNumber(eightRibType.hr),
  lr: isInvalidNumber(eightRibType.lr),
  tr: isInvalidNumber(eightRibType.tr),
  lrs: isInvalidNumber(eightRibType.lrs),
  lk: isInvalidNumber(eightRibType.lk),
});

// ====================================================
// Function for Foundation Input
// ====================================================
// FUNCTION: Check if square caisson type information form is complete
export const sqrCaissonTypeComplete = (sqrCaissonType) => {
  return [
    sqrCaissonType.width2a,
    sqrCaissonType.width2b,
    sqrCaissonType.embedmentDepth,
    sqrCaissonType.nValue,
    sqrCaissonType.yValue,
    sqrCaissonType.ycValue,
    sqrCaissonType.alphaValue,
  ].every(isPositiveFilled);
};

// FUNCTION: Create an error checker helper for the square caisson type
export const getSqrCaissonTypeErrors = (sqrCaissonType) => ({
  width2a: isInvalidNumber(sqrCaissonType.width2a),
  width2b: isInvalidNumber(sqrCaissonType.width2b),
  embedmentDepth: isInvalidNumber(sqrCaissonType.embedmentDepth),
  nValue: isInvalidNumber(sqrCaissonType.nValue),
  yValue: isInvalidNumber(sqrCaissonType.yValue),
  ycValue: isInvalidNumber(sqrCaissonType.ycValue),
  alphaValue: isInvalidNumber(sqrCaissonType.alphaValue),
});

// FUNCTION: Check if round caisson type information form is complete
export const roundCaissonTypeComplete = (roundCaissonType) => {
  return [
    roundCaissonType.width2a,
    roundCaissonType.width2b,
    roundCaissonType.embedmentDepth,
    roundCaissonType.nValue,
    roundCaissonType.yValue,
    roundCaissonType.ycValue,
    roundCaissonType.alphaValue,
  ].every(isPositiveFilled);
};

// FUNCTION: Create an error checker helper for the round caisson type
export const getRoundCaissonTypeErrors = (roundCaissonType) => ({
  width2a: isInvalidNumber(roundCaissonType.width2a),
  width2b: isInvalidNumber(roundCaissonType.width2b),
  embedmentDepth: isInvalidNumber(roundCaissonType.embedmentDepth),
  nValue: isInvalidNumber(roundCaissonType.nValue),
  yValue: isInvalidNumber(roundCaissonType.yValue),
  ycValue: isInvalidNumber(roundCaissonType.ycValue),
  alphaValue: isInvalidNumber(roundCaissonType.alphaValue),
});
