import * as Modal from "../pole-analyzer/PoleAnalyzerModal";
import { clearCalculationSession } from "../../utils/pole-analyzer";
import React, { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  LayoutDashboard,
  TowerControl,
  DoorOpen,
  Layers,
} from "lucide-react";
import { BaseplateIcon } from "../../utils/pole-analyzer/icon";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export function HeaderCalculationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();

  const configKey = `${type}_calculation_config`;

  // STATE
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false); // reset all confirmation

  // HANDLERS
  const handleBackClick = () => {
    setShowDraftModal(true);
  };

  const handleSaveDraft = () => {
    sessionStorage.removeItem("projectType");
    navigate("/calculation");
  };

  // FUNCTION: Removes all calculation results and hides the results table.
  const handleDelete = () => {
    clearCalculationSession(type);
    navigate("/calculation");
  };

  // LOAD CONFIG (reactive)
  const config = JSON.parse(sessionStorage.getItem(configKey) || "null");

  // NAVIGATION
  const navItems = config
    ? [
        {
          label: "Initial",
          path: `/calculation/${type}`,
          icon: LayoutDashboard,
        },
        {
          label: "Pole",
          path: `/calculation/${type}/pole`,
          icon: TowerControl,
        },
        ...(config.opening
          ? [
              {
                label: "Opening",
                path: `/calculation/${type}/opening`,
                icon: DoorOpen,
              },
            ]
          : []),
        ...(config.baseplate
          ? [
              {
                label: "Baseplate",
                path: `/calculation/${type}/baseplate`,
                icon: BaseplateIcon,
              },
            ]
          : []),
        ...(config.foundation
          ? [
              {
                label: "Foundation",
                path: `/calculation/${type}/foundation`,
                icon: Layers,
              },
            ]
          : []),
      ]
    : [
        {
          label: "Initial",
          path: `/calculation/${type}`,
          icon: LayoutDashboard,
        },
      ];

  return (
    <div className="sticky top-[64px] z-30">
      {/* ================= TOP BAR ================= */}
      <div className="bg-gradient-to-r from-[#0d3b66] to-[#0d3b66] shadow-lg px-6 py-[16px]">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-md text-sm font-medium border border-white/20 hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project Type
          </button>

          <button
            onClick={() => setConfirmResetAll(true)}
            className="flex items-center gap-2 bg-gray-200 text-[#0d3b66] px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="hp:hidden">Reset All</span>
            <span className="hidden hp:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* ================= NAVIGATION ================= */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                  
                  ${
                    isActive
                      ? "bg-[#0d3b66] text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }
                `}
              >
                {/* ICON */}
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-slate-500"
                  }`}
                />

                {/* LABEL */}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <Modal.ConfirmSaveDraftModal
        confirmSaveDraft={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        onSaveDraft={handleSaveDraft}
        onDiscard={() => setConfirmResetAll(true)}
      />

      <Modal.ConfirmResetAllModal
        confirmResetAll={confirmResetAll}
        onClose={() => setConfirmResetAll(false)}
        handleDeleteReport={handleDelete}
      />
    </div>
  );
}
