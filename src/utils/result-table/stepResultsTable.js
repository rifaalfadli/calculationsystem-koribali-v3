export const getRowsForStepFull = (stepIndex, resultsPole) => {
  const currentStep = resultsPole[stepIndex];

  const rows = [];

  // =========================
  // POLE ONLY
  // =========================
  rows.push({
    type: "section",
    description: currentStep.description,
  });

  return rows;
};
