// ====================================================
// Global Helpers
// ====================================================
// FUNCTION: check if a value is empty
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  return value.toString().trim() === "";
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
  return [condition.designStandard, condition.windSpeed].every(
    (v) => v && v.trim() !== "",
  );
};

// FUNCTION: Create an error checker helper for the condition
export const getConditionErrors = (condition) => ({
  designStandard: isEmpty(condition.designStandard),
  windSpeed: isEmpty(condition.windSpeed),
});

// ====================================================
// Function for Structural Design Pole Input
// ====================================================
// FUNCTION: Check if Structural Design Pole information form is complete
export const structuralDesignComplete = (structuralDesign) => {
  return [structuralDesign.lowestStep, structuralDesign.overDesign].every(
    (v) => !isEmpty(v),
  );
};

// FUNCTION: Create an error checker helper for the Structural Design Pole
export const getStructuralDesignErrors = (structuralDesign) => ({
  lowestStep: isEmpty(structuralDesign.lowestStep),
  overDesign: isEmpty(structuralDesign.overDesign),
});

// ====================================================
// Function for Pole Input
// ====================================================
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
        return `Pole ${poleNumber}: Lowest step (${lPole}) must be lower than the bottom step height (${hCurrent}). Please review your configuration.`;
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
  if (
    section.name.trim() === "" ||
    section.height.trim() === "" ||
    section.quantity.trim() === ""
  ) {
    return false; // fallback
  }
  if (section.poleType === "Taper") {
    // Taper: all lower + upper fields required
    return (
      section.diameterLower.trim() !== "" &&
      section.diameterUpper.trim() !== "" &&
      section.thicknessLower.trim() !== "" &&
      section.thicknessUpper.trim() !== ""
    );
  } else if (section.poleType === "Straight") {
    // Straight: only lower required
    return (
      section.diameterLower.trim() !== "" &&
      section.thicknessLower.trim() !== ""
    );
  }
  return false; // fallback
};

// FUNCTION: Create an error checker helper for the section/step
export const getSectionsErrors = (sections) => {
  const allErrors = {};

  sections.forEach((section) => {
    const e = {
      name: isEmpty(section.name),
      height: isEmpty(section.height),
      quantity: isEmpty(section.quantity),
      diameterLower: false,
      diameterUpper: false,
      thicknessLower: false,
      thicknessUpper: false,
    };

    if (section.poleType === "Taper") {
      e.diameterLower = isEmpty(section.diameterLower);
      e.diameterUpper = isEmpty(section.diameterUpper);
      e.thicknessLower = isEmpty(section.thicknessLower);
      e.thicknessUpper = isEmpty(section.thicknessUpper);
    } else {
      e.diameterLower = isEmpty(section.diameterLower);
      e.thicknessLower = isEmpty(section.thicknessLower);
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
  // field wajib untuk all type
  const baseComplete =
    directObject.nameDo.trim() !== "" &&
    directObject.frontAreaDo.trim() !== "" &&
    directObject.weightDo.trim() !== "" &&
    directObject.heightDo.trim() !== "" &&
    directObject.nncDo.trim() !== "" &&
    directObject.qtyDo.trim() !== "";

  if (!baseComplete) return false;

  // tambahan khusus directional
  if (directObject.typeOfDo === "directional") {
    return (
      directObject.sideAreaDo.trim() !== "" &&
      directObject.fixAngleDo.trim() !== ""
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
      frontAreaDo: isEmpty(directObject.frontAreaDo),
      weightDo: isEmpty(directObject.weightDo),
      heightDo: isEmpty(directObject.heightDo),
      nncDo: isEmpty(directObject.nncDo),
      qtyDo: isEmpty(directObject.qtyDo),
      sideAreaDo: false,
      fixAngleDo: false,
    };

    if (directObject.typeOfDo === "directional") {
      e.sideAreaDo = isEmpty(directObject.sideAreaDo);
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
  // field wajib untuk all type
  const baseComplete =
    overheadWire.nameOhw.trim() !== "" &&
    overheadWire.weightOhw.trim() !== "" &&
    overheadWire.diameterOhw.trim() !== "" &&
    overheadWire.fixheightOhw.trim() !== "" &&
    overheadWire.spanOhw.trim() !== "" &&
    overheadWire.saggingOhw.trim() !== "" &&
    overheadWire.nncOhw.trim() !== "" &&
    overheadWire.fixAngleOhw.trim() !== "" &&
    overheadWire.verticalAngleOhw.trim() !== "";

  if (!baseComplete) return false;

  return true;
};

// FUNCTION: Create an error checker helper for the overhead wire
export const getOhwErrors = (overheadWires) => {
  const allErrors = {};

  overheadWires.forEach((overheadWire) => {
    const e = {
      nameOhw: isEmpty(overheadWire.nameOhw),
      weightOhw: isEmpty(overheadWire.weightOhw),
      diameterOhw: isEmpty(overheadWire.diameterOhw),
      fixheightOhw: isEmpty(overheadWire.fixheightOhw),
      spanOhw: isEmpty(overheadWire.spanOhw),
      saggingOhw: isEmpty(overheadWire.saggingOhw),
      nncOhw: isEmpty(overheadWire.nncOhw),
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
// FUNCTION: Check if a arm is complete
export const isArmComplete = (arm) => {
  const baseComplete =
    arm.nameArm.trim() !== "" &&
    arm.materialArm.trim() !== "" &&
    arm.diameterArm.trim() !== "" &&
    arm.thicknessArm.trim() !== "" &&
    arm.lengthArm.trim() !== "" &&
    arm.expLengthArm.trim() !== "" &&
    arm.heightArm.trim() !== "" &&
    arm.hDistanceArm.trim() !== "" &&
    arm.fixAngleArm.trim() !== "" &&
    arm.nncArm.trim() !== "" &&
    arm.qtyArm.trim() !== "";

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
      diameterArm: isEmpty(arm.diameterArm),
      thicknessArm: isEmpty(arm.thicknessArm),
      lengthArm: isEmpty(arm.lengthArm),
      expLengthArm: isEmpty(arm.expLengthArm),
      heightArm: isEmpty(arm.heightArm),
      hDistanceArm: isEmpty(arm.hDistanceArm),
      fixAngleArm: isEmpty(arm.fixAngleArm),
      nncArm: isEmpty(arm.nncArm),
      qtyArm: isEmpty(arm.qtyArm),
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
  // field wajib untuk all type
  const baseComplete =
    armObject.nameAo.trim() !== "" &&
    armObject.frontAreaAo.trim() !== "" &&
    armObject.weightAo.trim() !== "" &&
    armObject.heightAo.trim() !== "" &&
    armObject.nncAo.trim() !== "" &&
    armObject.qtyAo.trim() !== "";

  if (!baseComplete) return false;

  // tambahan khusus directional
  if (armObject.typeOfAo === "directional") {
    return (
      armObject.sideAreaAo.trim() !== "" && armObject.fixAngleAo.trim() !== ""
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
        frontAreaAo: isEmpty(ao.frontAreaAo),
        weightAo: isEmpty(ao.weightAo),
        heightAo: isEmpty(ao.heightAo),
        nncAo: isEmpty(ao.nncAo),
        qtyAo: isEmpty(ao.qtyAo),
        sideAreaAo: false,
        fixAngleAo: false,
      };

      if (ao.typeOfAo === "directional") {
        e.sideAreaAo = isEmpty(ao.sideAreaAo);
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
