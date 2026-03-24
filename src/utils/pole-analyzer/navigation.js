// ====================================================
// Function for Condition Input
// ====================================================
// FUNCTIONS: Go to Pole Input after Condition
export const conditionNext = (isComplete, projectType, condition) => {
  if (!isComplete) {
    return {
      isValid: false,
      errors: {
        condition: true,
      },
    };
  }

  // KEY: Dynamic config key based on project type
  const configKey = `${projectType}_calculation_config`;

  // STORE: Save enabled components configuration
  sessionStorage.setItem(
    configKey,
    JSON.stringify({
      opening: condition.openingEnabled,
      baseplate: condition.baseplateEnabled,
      foundation: condition.foundationEnabled,
    }),
  );

  return {
    isValid: true,
    errors: null,
  };
};

// ====================================================
// Function for Pole Input
// ====================================================
// FUNCTION: Go to the next section tab
export const goToNextSection = (sections, activeTab, setActiveTab) => {
  const currentIndex = sections.findIndex((s) => s.id === activeTab);
  if (currentIndex < sections.length - 1) {
    setActiveTab(sections[currentIndex + 1].id);
  }
};

// FUNCTIONS: Go to Direct Object Input after Step Pole
export const stepPoleNext = (setIsExpandedPole, setIsExpandedDo) => {
  // Close step pole
  setIsExpandedPole(false);

  // Open direct Object
  setIsExpandedDo(true);
};

// ====================================================
// Function for Arm Input
// ====================================================
// FUNCTION: Go to the next arm tab
export const goToNextArm = (arms, activeTabArm, setActiveTabArm) => {
  const currentIndex = arms.findIndex((s) => s.idArm === activeTabArm);
  if (currentIndex < arms.length - 1) {
    setActiveTabArm(arms[currentIndex + 1].idArm);
  }
};

// FUNCTIONS: Go to the next form input
export const armNext = (setIsExpandedArm) => {
  // Close arm
  setIsExpandedArm(false);
};
