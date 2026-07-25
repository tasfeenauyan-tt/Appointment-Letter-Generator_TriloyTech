import React from "react";
import { FileText, Download, Printer, History, Plus, Users, Sparkles, Building2, Check, FileCheck, Layers } from "lucide-react";
import { PresetProfile } from "../types";
import { PRESET_PROFILES } from "../data/presets";

interface HeaderProps {
  onDownloadDocWithTerms: () => void;
  onDownloadDocWithoutTerms: () => void;
  onDownloadPdfWithTerms: () => void;
  onDownloadPdfWithoutTerms: () => void;
  onPrint: () => void;
  onNewLetter: () => void;
  onOpenHistory: () => void;
  onOpenBulk: () => void;
  onSelectPreset: (preset: PresetProfile) => void;
  isDocGenerating: boolean;
  isPdfGenerating: boolean;
  activeView: "preview" | "split" | "terms";
  setActiveView: (view: "preview" | "split" | "terms") => void;
}

export const Header: React.FC<HeaderProps> = ({
  onDownloadDocWithTerms,
  onDownloadDocWithoutTerms,
  onDownloadPdfWithTerms,
  onDownloadPdfWithoutTerms,
  onPrint,
  onNewLetter,
  onOpenHistory,
  onOpenBulk,
  onSelectPreset,
  isDocGenerating,
  isPdfGenerating,
  activeView,
  setActiveView
}) => {
  return (
    <header className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-3">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 ring-1 ring-white/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    TriloyTech
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                    HR Admin
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Appointment Letter Generator
                </p>
              </div>
            </div>

            {/* Presets dropdown for fast load */}
            <div className="hidden sm:flex items-center space-x-2">
              <select
                onChange={(e) => {
                  const preset = PRESET_PROFILES.find((p) => p.id === e.target.value);
                  if (preset) onSelectPreset(preset);
                }}
                defaultValue=""
                className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:border-slate-600 transition"
              >
                <option value="" disabled>
                  ⚡ Load Role Preset...
                </option>
                {PRESET_PROFILES.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center View Controls */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setActiveView("split")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                activeView === "split"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split Editor</span>
            </button>
            <button
              onClick={() => setActiveView("preview")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                activeView === "preview"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Letter Preview</span>
            </button>
            <button
              onClick={() => setActiveView("terms")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                activeView === "terms"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Terms Annexure</span>
            </button>
          </div>

          {/* Export & Action Buttons */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <button
              onClick={onOpenHistory}
              title="Saved Letters History"
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition flex items-center text-xs space-x-1"
            >
              <History className="w-4 h-4 text-slate-300" />
              <span className="hidden lg:inline font-medium">History</span>
            </button>

            <button
              onClick={onOpenBulk}
              title="Batch / Bulk Issue"
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition flex items-center text-xs space-x-1"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span className="hidden lg:inline font-medium">Bulk Issue</span>
            </button>

            <button
              onClick={onPrint}
              title="Print / Save as PDF via Browser"
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition flex items-center text-xs space-x-1"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline font-medium">Print</span>
            </button>

            {/* 2 DOCX Download Buttons Group */}
            <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-blue-500/30 shadow-sm space-x-1">
              <button
                onClick={onDownloadDocWithTerms}
                disabled={isDocGenerating}
                title="Export Word Document (.docx) including Terms & Annexure"
                className="px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg transition flex items-center space-x-1 disabled:opacity-50"
              >
                <FileText className="w-3.5 h-3.5 text-blue-200" />
                <span>DOCX (+ Terms)</span>
              </button>
              <button
                onClick={onDownloadDocWithoutTerms}
                disabled={isDocGenerating}
                title="Export Word Document (.docx) Letter Only (without Terms)"
                className="px-2 py-1.5 text-blue-300 hover:text-white hover:bg-slate-700/80 font-medium text-xs rounded-lg transition flex items-center space-x-1 disabled:opacity-50"
              >
                <span>DOCX (Letter)</span>
              </button>
            </div>

            {/* 2 PDF Download Buttons Group */}
            <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-red-500/30 shadow-sm space-x-1">
              <button
                onClick={onDownloadPdfWithTerms}
                disabled={isPdfGenerating}
                title="Export PDF Document (.pdf) including Terms & Annexure"
                className="px-2.5 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs rounded-lg transition flex items-center space-x-1 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-red-100" />
                <span>PDF (+ Terms)</span>
              </button>
              <button
                onClick={onDownloadPdfWithoutTerms}
                disabled={isPdfGenerating}
                title="Export PDF Document (.pdf) Letter Only (without Terms)"
                className="px-2 py-1.5 text-red-300 hover:text-white hover:bg-slate-700/80 font-medium text-xs rounded-lg transition flex items-center space-x-1 disabled:opacity-50"
              >
                <span>PDF (Letter)</span>
              </button>
            </div>

            <button
              onClick={onNewLetter}
              title="Reset to New Blank Form"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
