import React, { useState } from "react";
import PropTypes from "prop-types";
import { FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { PoleSpecificationTable } from "../results-table/PoleSpecificationTable";
import { DirectObjectCalculationTable } from "../results-table/DirectObjectCalculationTable";
import { OverheadWireCalculationTable } from "../results-table/OverheadWireCalculationTable";
import { ArmSpecificationTable } from "../results-table/ArmSpecificationTable";
import { ArmObjectCalculationTable } from "../results-table/ArmObjectCalculationTable";
import { StepLoadSummaryTable } from "../results-table/SummaryCalculationTable";

export function ResultsTable({ results, resultsDo, resultsOhw, resultsArm }) {
  const [page] = useState(0);
  const r = results[page]; // current Pole

  const [pageDo] = useState(0);
  const rDo = resultsDo[pageDo]; // current DO

  const [pageOhw] = useState(0);
  const rOhw = resultsOhw[pageOhw]; // current OHW

  const [pageArm] = useState(0);
  const rArm = resultsArm[pageArm]; // current Arm

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d3b66] to-[#0d3b66] px-6 py-5 hp:px-4 hp:py-3">
        <div className="flex items-center justify-between gap-3">
          {/* LEFT */}
          <div className="flex items-center gap-3 hp:gap-2">
            <div className="bg-white/10 backdrop-blur-sm p-2 hp:p-1.5 rounded-lg">
              <CheckCircle2 className="w-6 h-6 hp:w-5 hp:h-5 text-white" />
            </div>

            <div>
              <h2 className="text-white mb-0.5 text-sm hp:text-xs font-semibold">
                Calculation Results
              </h2>

              {/* hide description on mobile */}
              <p className="text-white/70 text-xs font-medium hp:hidden">
                Comprehensive structural analysis output
              </p>
            </div>
          </div>

          {/* RIGHT BUTTON */}
        </div>
      </div>

      {/* ==============================================> Tabel Result Pole <============================================== */}
      {r && <PoleSpecificationTable results={results} />}

      {/* ==============================================> Tabel Result Direct Object <============================================== */}
      {rDo && <DirectObjectCalculationTable resultsDo={resultsDo} />}

      {/* ==============================================> Tabel Result Overhead Wire <============================================== */}
      {rOhw && <OverheadWireCalculationTable resultsOhw={resultsOhw} />}

      {/* ==============================================> Tabel Result Arm <============================================== */}
      {rArm && <ArmSpecificationTable resultsArm={resultsArm} />}

      {/* ==============================================> Tabel Result Arm Object <============================================== */}
      {resultsArm?.map((arm, armIndex) => (
        <ArmObjectCalculationTable arm={arm} armIndex={armIndex} />
      ))}

      <div className="border-t border-gray-200 my-8" />

      {results.length > 0 && <StepLoadSummaryTable results={results} />}

      {/* ===================== EMPTY STATE ===================== */}
      {results.length === 0 && (
        <div className="p-16 text-center">
          <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">
            No calculation results yet. Please input pole data and click
            Calculate.
          </p>
        </div>
      )}
    </div>
  );
}

// SKEMA DATA: Dokumentasi tipe data dan satuan variabel teknik yang diperlukan untuk merender tabel hasil analisis struktur.
ResultsTable.propTypes = {
  // step pole
  results: PropTypes.arrayOf(
    PropTypes.shape({
      pole: PropTypes.string,
      description: PropTypes.string,
      poleType: PropTypes.string,
      diaUpper: PropTypes.number,
      diaLower: PropTypes.number,
      thickUpper: PropTypes.number,
      thickLower: PropTypes.number,
      length: PropTypes.number,
      heightPole: PropTypes.number,
      centerPoint: PropTypes.number,
      fb: PropTypes.number,
      stb: PropTypes.number,
      sts: PropTypes.number,
      stc: PropTypes.number,
      sectionArea: PropTypes.number,
      sectionModulus: PropTypes.number,
      momentInertia: PropTypes.number,
      radiusGyr: PropTypes.number,
      taperRatio: PropTypes.number,
      material: PropTypes.string,
      ip: PropTypes.number,
      heightSection: PropTypes.number,
      typeofTaper: PropTypes.string,
    }),
  ).isRequired,

  // direct object
  resultsDo: PropTypes.arrayOf(
    PropTypes.shape({
      doNum: PropTypes.string,
      nameDo: PropTypes.string,
      typeOfDo: PropTypes.string,
      frontAreaDo: PropTypes.number,
      sideAreaDo: PropTypes.number,
      weightDo: PropTypes.number,
      heightDo: PropTypes.number,
      nncDo: PropTypes.number,
      qtyDo: PropTypes.number,
      fixAngleDo: PropTypes.number,
      flDo: PropTypes.number,
      cfDo: PropTypes.number,
      wlafDo: PropTypes.number,
      wlasDo: PropTypes.number,
      slDo: PropTypes.number,
    }),
  ).isRequired,

  // overhead wire
  resultsOhw: PropTypes.arrayOf(
    PropTypes.shape({
      ohwNum: PropTypes.string,
      nameOhw: PropTypes.string,
      weightOhw: PropTypes.number,
      diameterOhw: PropTypes.number,
      fixheightOhw: PropTypes.number,
      spanOhw: PropTypes.number,
      saggingOhw: PropTypes.number,
      nncOhw: PropTypes.number,
      fixAngleOhw: PropTypes.number,
      verticalAngleOhw: PropTypes.number,
      flOhwKg: PropTypes.number,
      flOhwN: PropTypes.number,
      AreaOhw: PropTypes.number,
      cfOhw: PropTypes.number,
      wlOhw: PropTypes.number,
      slOhw: PropTypes.number,
      pwFixOhw: PropTypes.number,
      pwStraightOhw: PropTypes.number,
      pwObliqueOhw: PropTypes.number,
      tensionFixOhw: PropTypes.number,
      tensionStraightOhw: PropTypes.number,
      tensionObliqueOhw: PropTypes.number,
      cosVerticalAngleOhw: PropTypes.number,
    }),
  ).isRequired,

  // arm
  resultsArm: PropTypes.arrayOf(
    PropTypes.shape({
      armNum: PropTypes.string,
      nameArm: PropTypes.string,
      materialArm: PropTypes.string,
      diameterArm: PropTypes.number,
      thicknessArm: PropTypes.number,
      lengthArm: PropTypes.number,
      expLengthArm: PropTypes.number,
      heightArm: PropTypes.number,
      hDistanceArm: PropTypes.number,
      fixAngleArm: PropTypes.number,
      nncArm: PropTypes.number,
      qtyArm: PropTypes.number,

      fb: PropTypes.number,
      sfb: PropTypes.number,
      sfs: PropTypes.number,
      sfc: PropTypes.number,
      sectAreaArm: PropTypes.number,
      sectModulusArm: PropTypes.number,
      momentInertiaArm: PropTypes.number,
      ipArm: PropTypes.number,
      radiusGyrArm: PropTypes.number,
      massaMArm: PropTypes.number,
      massaArm: PropTypes.number,
      flMArm: PropTypes.number,
      flArm: PropTypes.number,
      frontAreaArm: PropTypes.number,
      sideAreaArm: PropTypes.number,
      frontAreaMMArm: PropTypes.number,
      sideAreaMMArm: PropTypes.number,
      wlaFrontArm: PropTypes.number,
      slArm: PropTypes.number,
      wlasArm: PropTypes.number,
      mFixArm: PropTypes.number,
      mWindArm: PropTypes.number,
      mSeisArm: PropTypes.number,

      // arm object
      armObjects: PropTypes.arrayOf(
        PropTypes.shape({
          aoNum: PropTypes.string,
          nameAo: PropTypes.string,
          typeOfAo: PropTypes.string,
          frontAreaAo: PropTypes.number,
          sideAreaAo: PropTypes.number,
          weightAo: PropTypes.number,
          hDistanceAo: PropTypes.number,
          heightAo: PropTypes.number,
          fixAngleAo: PropTypes.number,
          nncAo: PropTypes.number,
          qtyAo: PropTypes.number,

          flAo: PropTypes.number,
          cfAo: PropTypes.number,
          wlafAo: PropTypes.number,
          wlasAo: PropTypes.number,
          slAo: PropTypes.number,
          mFixAo: PropTypes.number,
          mWindAo: PropTypes.number,
          mSeisAo: PropTypes.number,
        }),
      ),
    }),
  ),
};
