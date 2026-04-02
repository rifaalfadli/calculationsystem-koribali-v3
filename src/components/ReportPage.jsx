import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LightingPoleReport from "./report/lightingpole/LightingPoleReport";
import AcemastReport from "./report/acemast/AcemastReport";
import SignboardReport from "./report/signboard/SignboardReport";
import MultipleReport from "./report/multiple/MultipleReport";
import { clearCalculationSession } from "../utils/pole-analyzer";
import {
  ArrowLeft,
  Download,
  Trash2,
  FileText,
  AlertCircle,
  Calculator,
} from "lucide-react";

export function ReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectType = sessionStorage.getItem("projectType");

  // Ambil data cover, condition, results, sections dari state router
  // Jika tidak ada, fallback ke array kosong untuk mencegah error
  const reportData = location.state;

  const results =
    reportData?.results ||
    JSON.parse(sessionStorage.getItem(`${projectType}_results`) || "[]");

  const resultsDo =
    reportData?.resultsDo ||
    JSON.parse(sessionStorage.getItem(`${projectType}_resultsDo`) || "[]");

  const resultsOhw =
    reportData?.resultsOhw ||
    JSON.parse(sessionStorage.getItem(`${projectType}_resultsOhw`) || "[]");

  const cover =
    reportData?.cover ||
    JSON.parse(sessionStorage.getItem(`${projectType}_cover`) || "{}");

  const condition =
    reportData?.condition ||
    JSON.parse(sessionStorage.getItem(`${projectType}_condition`) || "{}");

  const structuralDesign =
    reportData?.structuralDesign ||
    JSON.parse(
      sessionStorage.getItem(`${projectType}_structuralDesign`) || "{}",
    );

  // // Tombol kembali ke calculation page
  // const onBack = () => navigate("/calculation");

  const onBackCalculation = () => {
    if (projectType) {
      navigate(`/calculation/${projectType}`);
    } else {
      navigate("/calculation");
    }
  };

  // State pop-up delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // Flag apakah report masih ada atau sudah dihapus
  const [hasReport, setHasReport] = useState(
    sessionStorage.getItem(`${projectType}_hasReport`) === "true",
  );

  // Fungsi print + rename file PDF via dokumen.title (workaround umum)
  const handlePrint = () => {
    const oldTitle = document.title;
    document.title = cover?.calculationNumber || "Calculation Report"; // rename filename
    window.print(); // buka dialog print
    document.title = oldTitle; // kembalikan title setelah print
  };

  // Hapus report: reset flag & tutup modal
  const handleDelete = () => {
    setHasReport(false);
    setShowDeleteConfirm(false);

    clearCalculationSession(projectType);
    navigate("/calculation");
  };

  // Render report component based on selected project type
  const renderReport = () => {
    switch (projectType) {
      case "lighting-pole":
        return (
          <div id="report-a4">
            <LightingPoleReport
              cover={cover}
              condition={condition}
              structuralDesign={structuralDesign}
              results={results}
              resultsDo={resultsDo}
            />
          </div>
        );
      case "acemast":
        return (
          <div id="report-a4">
            <AcemastReport
              cover={cover}
              condition={condition}
              structuralDesign={structuralDesign}
              results={results}
              resultsDo={resultsDo}
              resultsOhw={resultsOhw}
            />
          </div>
        );
      case "signboard":
        return (
          <div id="report-a4">
            <SignboardReport
              cover={cover}
              condition={condition}
              structuralDesign={structuralDesign}
              results={results}
              resultsDo={resultsDo}
              resultsOhw={resultsOhw}
            />
          </div>
        );
      case "multiple":
        return (
          <div id="report-a4">
            <MultipleReport
              cover={cover}
              condition={condition}
              structuralDesign={structuralDesign}
              results={results}
              resultsDo={resultsDo}
              resultsOhw={resultsOhw}
            />
          </div>
        );
      default:
        return <div />;
    }
  };

  // Empty State - No Report
  if (!hasReport || results.length === 0 || !projectType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-250">
        {/* Empty State Content */}
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full text-center">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="bg-blue-100 text-blue-800 p-6 rounded-2xl shadow-sm border border-blue-100">
                <FileText className="w-11 h-11" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
              No Reports
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl text-slate-600 mb-4 font-semibold">
              No calculation reports available
            </h2>

            {/* Description */}
            <p className="text-base text-slate-500 mb-10 lg:mb-12 leading-relaxed max-w-md mx-auto">
              You haven't generated any reports yet. Start by creating pole
              sections and running calculations to generate your first report.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={onBackCalculation}
                className="
                  flex items-center gap-2 px-8 py-3 
                  bg-blue-800 text-white rounded-lg shadow-sm 
                  hover:bg-blue-900 hover:shadow-md 
                  transition-all duration-200
                  font-medium text-base
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50
                "
              >
                <Calculator className="w-5 h-5" />
                Go to Calculation
              </button>
            </div>

            {/* Hint */}
            <p className="text-xs text-slate-600">
              Start your first calculation to generate reports
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar - Hidden on Print */}
      <div className="bg-white print:hidden sticky top-[64px] z-30 shadow-sm border-b border-[#0d3b66]">
        <div className="mx-auto px-6 py-4 hp:px-4 hp:py-2.5">
          <div className="flex items-center justify-between">
            {/* LEFT - BACK */}
            <button
              onClick={onBackCalculation}
              className="
                flex items-center gap-2
                px-5 py-2.5 text-sm
                bg-white text-[#0d3b66]
                border border-[#0d3b66]
                rounded-lg
                hover:bg-blue-50 transition-colors

                hp:px-3
                hp:py-2
              "
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hp:hidden">Back to Calculator</span>
            </button>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3 hp:gap-2">
              {/* DELETE */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="
                  flex items-center gap-2
                  px-5 py-2.5 text-sm
                  bg-white text-red-600
                  border border-red-300
                  rounded-lg
                  hover:bg-red-50 transition-colors

                  hp:px-3
                  hp:py-2
                "
                title="Delete Report"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hp:hidden">Delete Report</span>
              </button>

              {/* EXPORT */}
              <button
                onClick={handlePrint}
                className="
                  flex items-center gap-2
                  px-5 py-2.5 text-sm
                  bg-gradient-to-r from-[#0d3b66] to-[#3399cc]
                  text-white
                  rounded-lg
                  hover:brightness-110 transition-all shadow-sm

                  hp:px-3
                  hp:py-2
                "
                title="Export PDF"
              >
                <Download className="w-4 h-4" />
                <span className="hp:hidden">Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div
            className="
              w-full max-w-xs
              bg-white border border-gray-200
              rounded-xl shadow-xl
              p-4
              sm:max-w-md sm:p-8 sm:rounded-2xl
            "
          >
            {/* Icon */}
            <div
              className="
                mx-auto mb-3
                flex items-center justify-center
                w-10 h-10 sm:w-16 sm:h-16
                bg-red-100 rounded-full
              "
            >
              <AlertCircle className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />
            </div>
            {/* Title */}
            <h2
              className="
                text-center font-bold
                text-sm sm:text-base
                text-gray-900
                mb-1 sm:mb-2
              "
            >
              Delete Report?
            </h2>

            {/* Description */}
            <p
              className="
                text-center text-gray-600
                text-xs sm:text-sm
                mb-4 sm:mb-6
                leading-relaxed
              "
            >
              This will delete all inputs and results. This action cannot be
              undone. Continue?
            </p>

            {/* Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="
                  flex-1
                  py-2 sm:py-3 font-bold
                  text-xs sm:text-sm
                  bg-slate-100 text-slate-600
                  rounded-md sm:rounded-lg
                  hover:bg-slate-200 transition
                "
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="
                  flex-1
                  py-2 sm:py-3 font-bold
                  text-xs sm:text-sm
                  bg-red-500 text-white
                  rounded-md sm:rounded-lg
                  hover:bg-red-600 transition
                "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 hp:mx-0 hp:px-0 hp:flex hp:justify-center hp:max-w-[100vh] hp:overflow-hidden">
        {renderReport()}
      </div>
    </div>
  );
}
