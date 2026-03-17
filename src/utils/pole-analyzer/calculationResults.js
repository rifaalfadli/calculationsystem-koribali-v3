import {
  calculateFlU,
  calculateCrossAp,
  calculateInasMp,
  calculateSecMdl,
  calculateRadGy,
} from "./calculatePole";

// ==============================
// STEP POLE INPUT
// ==============================
export function calculatePoleResults(sections) {
  return sections.map((section, index) => {
    const sectionName = section.name || `支柱-${index + 1}`;
    const materialType = section.material;
    const poleType = section.poleType;

    const dLower = parseFloat(section.diameterLower) || 0;
    const dUpper = parseFloat(section.diameterUpper) || 0;
    const tLower = parseFloat(section.thicknessLower) || 0;
    const tUpper = parseFloat(section.thicknessUpper) || 0;
    const heightPole = parseFloat(section.height) || 0;
    const qty = parseFloat(section.quantity) || 1;

    // calculate pole
    const flU = calculateFlU(dLower, tLower);
    const CrossAp = calculateCrossAp(dLower, tLower);
    const InasMp = calculateInasMp(dLower, tLower);
    const SecMdl = calculateSecMdl(dLower, tLower);
    const RadGy = calculateRadGy(dLower, tLower);

    // dummy data
    const length = 1;
    const centerPoint = 1;

    const fb = 156;
    const stb = 235;
    const sts = 136;
    const stc = 235;

    const sectionArea = CrossAp;
    const sectionModulus = SecMdl;
    const momentInertia = InasMp;
    const ip = 1;
    const radiusGyr = RadGy;
    const taperRatio = 1;
    const heightSection = 1;
    const typeofTaper = "温間スピニングテーパー柱";

    return {
      pole: `Pole${index + 1}`,
      description: sectionName,
      poleType,
      diaUpper: dUpper,
      diaLower: dLower,
      thickUpper: tUpper,
      thickLower: tLower,
      heightPole,
      qty,

      flU,
      CrossAp,
      InasMp,
      SecMdl,
      RadGy,

      length,
      centerPoint,
      fb,
      stb,
      sts,
      stc,
      sectionArea,
      sectionModulus,
      momentInertia,
      radiusGyr,
      taperRatio,
      material: materialType,
      ip,
      heightSection,
      typeofTaper,
    };
  });
}

// ==============================
// DIRECT OBJECT INPUT
// ==============================
export function calculateDoResults(directObjects) {
  return directObjects.map((directObject, index) => {
    const nameDo = directObject.nameDo;
    const typeOfDo = directObject.typeOfDo;

    const frontAreaDo = parseFloat(directObject.frontAreaDo) || 0;
    const sideAreaDo = parseFloat(directObject.sideAreaDo) || 0;
    const weightDo = parseFloat(directObject.weightDo) || 0;
    const heightDo = parseFloat(directObject.heightDo) || 0;
    const nncDo = parseFloat(directObject.nncDo) || 0;
    const qtyDo = parseFloat(directObject.qtyDo) || 1;
    const fixAngleDo = parseFloat(directObject.fixAngleDo) || 0;

    // dummy data
    const flDo = 100;
    const cfDo = 1;
    const wlafDo = 100;
    const wlasDo = 100;
    const slDo = 100;

    return {
      doNum: `DO${index + 1}`,
      nameDo,
      typeOfDo,
      frontAreaDo,
      sideAreaDo,
      weightDo,
      heightDo,
      nncDo,
      qtyDo,
      fixAngleDo,
      flDo,
      cfDo,
      wlafDo,
      wlasDo,
      slDo,
    };
  });
}

// ==============================
// OVERHEAD WIRE INPUT
// ==============================
export function calculateOhwResults(overheadWires) {
  return overheadWires.map((overheadWire, index) => {
    const nameOhw = overheadWire.nameOhw;

    const weightOhw = parseFloat(overheadWire.weightOhw) || 0;
    const diameterOhw = parseFloat(overheadWire.diameterOhw) || 0;
    const fixheightOhw = parseFloat(overheadWire.fixheightOhw) || 0;
    const spanOhw = parseFloat(overheadWire.spanOhw) || 0;
    const saggingOhw = parseFloat(overheadWire.saggingOhw) || 0;
    const nncOhw = parseFloat(overheadWire.nncOhw) || 0;
    const fixAngleOhw = parseFloat(overheadWire.fixAngleOhw) || 0;
    const verticalAngleOhw = parseFloat(overheadWire.verticalAngleOhw) || 0;

    // dummy data
    const flOhwKg = 100;
    const flOhwN = 100;
    const AreaOhw = 100;
    const cfOhw = 100;
    const wlOhw = 100;
    const slOhw = 100;
    const pwFixOhw = 100;
    const pwStraightOhw = 100;
    const pwObliqueOhw = 100;
    const tensionFixOhw = 100;
    const tensionStraightOhw = 100;
    const tensionObliqueOhw = 100;
    const cosVerticalAngleOhw = 100;

    return {
      ohwNum: `OHW${index + 1}`,
      nameOhw,
      weightOhw,
      diameterOhw,
      fixheightOhw,
      spanOhw,
      saggingOhw,
      nncOhw,
      fixAngleOhw,
      verticalAngleOhw,

      flOhwKg,
      flOhwN,
      AreaOhw,
      cfOhw,
      wlOhw,
      slOhw,
      pwFixOhw,
      pwStraightOhw,
      pwObliqueOhw,
      tensionFixOhw,
      tensionStraightOhw,
      tensionObliqueOhw,
      cosVerticalAngleOhw,
    };
  });
}

// ==============================
// ARM INPUT
// ==============================
// export function calculateArmResults(arms) {
//   return arms.map((arm, index) => {
//     const nameArm = arm.nameArm || `アーム-${index + 1}`;
//     const materialArm = arm.materialArm;
//     const diameterArm = parseFloat(arm.diameterArm) || 0;
//     const thicknessArm = parseFloat(arm.thicknessArm) || 0;
//     const lengthArm = parseFloat(arm.lengthArm) || 0;
//     const expLengthArm = parseFloat(arm.expLengthArm) || 0;
//     const heightArm = parseFloat(arm.heightArm) || 0;
//     const hDistanceArm = parseFloat(arm.hDistanceArm) || 0;
//     const fixAngleArm = parseFloat(arm.fixAngleArm) || 0;
//     const nncArm = parseFloat(arm.nncArm) || 0;
//     const qtyArm = parseFloat(arm.qtyArm) || 1;

//     // dummy data
//     const fb = 156;
//     const stb = 235;
//     const sts = 136;
//     const stc = 235;

//     const sectAreaArm = 100;
//     const sectModulusArm = 100;
//     const momentInertiaArm = 100;
//     const ipArm = 100;
//     const radiusGyrArm = 100;
//     const massaMArm = 100;
//     const massaArm = 100;
//     const flMArm = 100;
//     const flArm = 100;
//     const frontAreaArm = 100;
//     const sideAreaArm = 100;
//     const frontAreaMMArm = 100;
//     const sideAreaMMArm = 100;
//     const wlaFrontArm = 100;
//     const slArm = 100;

//     return {
//       armNum: `AO${index + 1}`,
//       nameArm,
//       materialArm,
//       diameterArm,
//       thicknessArm,
//       lengthArm,
//       expLengthArm,
//       heightArm,
//       hDistanceArm,
//       fixAngleArm,
//       nncArm,
//       qtyArm,

//       fb,
//       stb,
//       sts,
//       stc,
//       sectAreaArm,
//       sectModulusArm,
//       momentInertiaArm,
//       ipArm,
//       radiusGyrArm,
//       massaMArm,
//       massaArm,
//       flMArm,
//       flArm,
//       frontAreaArm,
//       sideAreaArm,
//       frontAreaMMArm,
//       sideAreaMMArm,
//       wlaFrontArm,
//       slArm,
//     };
//   });
// }

// ==============================
// ARM OBJECT INPUT
// ==============================
// export function calculateAoResults(armObjects) {
//   return armObjects.map((armObject, index) => {
//     const nameAo = armObject.nameAo;
//     const typeOfAo = armObject.typeOfAo;

//     const frontAreaAo = parseFloat(armObject.frontAreaAo) || 0;
//     const sideAreaAo = parseFloat(armObject.sideAreaAo) || 0;
//     const weightAo = parseFloat(armObject.weightAo) || 0;
//     const heightAo = parseFloat(armObject.heightAo) || 0;
//     const fixAngleAo = parseFloat(armObject.fixAngleAo) || 0;
//     const nncAo = parseFloat(armObject.nncAo) || 0;
//     const qtyAo = parseFloat(armObject.qtyAo) || 1;

//     // dummy data
//     const flAo = 100;
//     const cfAo = 1;
//     const wlafAo = 100;
//     const wlasAo = 100;
//     const slAo = 100;

//     return {
//       aoNum: `AO${index + 1}`,
//       nameAo,
//       typeOfAo,
//       frontAreaAo,
//       sideAreaAo,
//       weightAo,
//       heightAo,
//       fixAngleAo,
//       nncAo,
//       qtyAo,
//       flAo,
//       cfAo,
//       wlafAo,
//       wlasAo,
//       slAo,
//     };
//   });
// }

// ==============================
// ARM OBJECT INPUT
// ==============================
export function calculateAoResults(armObjects = [], heightArm = 0) {
  return armObjects.map((armObject, index) => {
    const nameAo = armObject.nameAo;
    const typeOfAo = armObject.typeOfAo;

    const frontAreaAo = parseFloat(armObject.frontAreaAo) || 0;
    const sideAreaAo = parseFloat(armObject.sideAreaAo) || 0;
    const weightAo = parseFloat(armObject.weightAo) || 0;
    const hDistanceAo = parseFloat(armObject.heightAo) || 0;
    const fixAngleAo = parseFloat(armObject.fixAngleAo) || 0;
    const nncAo = parseFloat(armObject.nncAo) || 0;
    const qtyAo = parseFloat(armObject.qtyAo) || 1;
    const heightAo = heightArm;

    // dummy data
    const flAo = 100;
    const cfAo = 1;
    const wlafAo = 100;
    const wlasAo = 100;
    const slAo = 100;
    const mFixAo = 100;
    const mWindAo = 100;
    const mSeisAo = 100;

    return {
      aoNum: `AO${index + 1}`,
      nameAo,
      typeOfAo,
      frontAreaAo,
      sideAreaAo,
      weightAo,
      hDistanceAo,
      heightAo,
      fixAngleAo,
      nncAo,
      qtyAo,
      flAo,
      cfAo,
      wlafAo,
      wlasAo,
      slAo,
      mFixAo,
      mWindAo,
      mSeisAo,
    };
  });
}

// ==============================
// ARM INPUT
// ==============================
export function calculateArmResults(arms = []) {
  return arms.map((arm, index) => {
    const nameArm = arm.nameArm || `アーム-${index + 1}`;
    const materialArm = arm.materialArm;
    const diameterArm = parseFloat(arm.diameterArm) || 0;
    const thicknessArm = parseFloat(arm.thicknessArm) || 0;
    const lengthArm = parseFloat(arm.lengthArm) || 0;
    const expLengthArm = parseFloat(arm.expLengthArm) || 0;
    const heightArm = parseFloat(arm.heightArm) || 0;
    const hDistanceArm = parseFloat(arm.hDistanceArm) || 0;
    const fixAngleArm = parseFloat(arm.fixAngleArm) || 0;
    const nncArm = parseFloat(arm.nncArm) || 0;
    const qtyArm = parseFloat(arm.qtyArm) || 1;

    // calculate nested armObjects
    const calculatedArmObjects = calculateAoResults(
      arm.armObjects || [],
      heightArm,
    );

    // dummy data
    const fb = 156;
    const sfb = 235;
    const sfs = 136;
    const sfc = 235;

    const sectAreaArm = 100;
    const sectModulusArm = 100;
    const momentInertiaArm = 100;
    const ipArm = 100;
    const radiusGyrArm = 100;
    const massaMArm = 100;
    const massaArm = 100;
    const flMArm = 100;
    const flArm = 100;
    const frontAreaArm = 100;
    const sideAreaArm = 100;
    const frontAreaMMArm = 100;
    const sideAreaMMArm = 100;
    const wlaFrontArm = 100;
    const slArm = 100;
    const wlasArm = 0;
    const mFixArm = 100;
    const mWindArm = 100;
    const mSeisArm = 100;

    return {
      armNum: `Arm${index + 1}`,
      nameArm,
      materialArm,
      diameterArm,
      thicknessArm,
      lengthArm,
      expLengthArm,
      heightArm,
      hDistanceArm,
      fixAngleArm,
      nncArm,
      qtyArm,

      fb,
      sfb,
      sfs,
      sfc,
      sectAreaArm,
      sectModulusArm,
      momentInertiaArm,
      ipArm,
      radiusGyrArm,
      massaMArm,
      massaArm,
      flMArm,
      flArm,
      frontAreaArm,
      sideAreaArm,
      frontAreaMMArm,
      sideAreaMMArm,
      wlaFrontArm,
      slArm,
      wlasArm,
      mFixArm,
      mWindArm,
      mSeisArm,

      // arm object calculated
      armObjects: calculatedArmObjects,
    };
  });
}
