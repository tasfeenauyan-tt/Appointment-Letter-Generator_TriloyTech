import React, { useState } from "react";
import { X, Users, Upload, FileSpreadsheet, Download, CheckCircle2, Play, FileText, FileType, Sparkles, Loader2 } from "lucide-react";
import { AppointmentLetterData } from "../types";
import { getTodayFormatted, getFutureDateFormatted } from "../utils/dateFormatter";
import { formatGrossSalaryBDT } from "../utils/numberToWords";
import { generateAppointmentDocx } from "../utils/docxGenerator";
import { exportLetterToPDF } from "../utils/pdfGenerator";
import { LetterPreview } from "./LetterPreview";
import { TermsAndConditionsPreview } from "./TermsAndConditionsPreview";

interface BulkGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseData: AppointmentLetterData;
  onLoadBatchRecord: (record: AppointmentLetterData) => void;
}

interface BulkCandidate {
  id: string;
  salutation: string;
  employeeFullName: string;
  fullAddress: string;
  positionName: string;
  divisionName: string;
  letterIssueDate: string;
  effectiveDate: string;
  grossSalary: string;
}

type BulkExportMode =
  | "docx-terms"
  | "docx-no-terms"
  | "pdf-terms"
  | "pdf-no-terms"
  | "all-4-formats";

export const BulkGeneratorModal: React.FC<BulkGeneratorModalProps> = ({
  isOpen,
  onClose,
  baseData,
  onLoadBatchRecord
}) => {
  const [candidates, setCandidates] = useState<BulkCandidate[]>([
    {
      id: "1",
      salutation: "Mr.",
      employeeFullName: "Kazi Nazrul Islam",
      fullAddress: "House 12, Road 4, Dhanmondi, Dhaka",
      positionName: "Executive",
      divisionName: "Sales & Business Development Division",
      letterIssueDate: baseData.letterIssueDate || getTodayFormatted(),
      effectiveDate: getFutureDateFormatted(7),
      grossSalary: "55,000"
    },
    {
      id: "2",
      salutation: "Ms.",
      employeeFullName: "Faria Rahman",
      fullAddress: "Plot 8, Sector 3, Uttara, Dhaka",
      positionName: "Senior Executive",
      divisionName: "Sales & Business Development Division",
      letterIssueDate: baseData.letterIssueDate || getTodayFormatted(),
      effectiveDate: getFutureDateFormatted(7),
      grossSalary: "65,000"
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeCandidateForPdf, setActiveCandidateForPdf] = useState<AppointmentLetterData | null>(null);

  if (!isOpen) return null;

  const handleAddRow = () => {
    setCandidates([
      ...candidates,
      {
        id: Date.now().toString(),
        salutation: "Mr.",
        employeeFullName: "",
        fullAddress: "",
        positionName: baseData.positionName || "Executive",
        divisionName: baseData.divisionName || "Sales & Business Development Division",
        letterIssueDate: baseData.letterIssueDate || getTodayFormatted(),
        effectiveDate: baseData.effectiveDate || getFutureDateFormatted(7),
        grossSalary: baseData.grossSalary || "50,000"
      }
    ]);
  };

  const handleCandidateChange = (id: string, field: keyof BulkCandidate, value: string) => {
    setCandidates(
      candidates.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleRemoveRow = (id: string) => {
    setCandidates(candidates.filter((c) => c.id !== id));
  };

  const generateCandidateData = (c: BulkCandidate): AppointmentLetterData => {
    const { words } = formatGrossSalaryBDT(c.grossSalary);
    const cleanWords = words ? words.replace(/^\(|\)$/g, "").trim() : "";
    return {
      ...baseData,
      salutation: c.salutation,
      employeeFullName: c.employeeFullName,
      fullAddress: c.fullAddress,
      positionName: c.positionName,
      divisionName: c.divisionName,
      letterIssueDate: c.letterIssueDate || baseData.letterIssueDate || getTodayFormatted(),
      effectiveDate: c.effectiveDate,
      grossSalary: c.grossSalary,
      salaryInWords: cleanWords ? `(${cleanWords})` : "",
      copyTo: [c.divisionName, "Finance & Accounts Division"]
    };
  };

  const handleBatchExport = async (mode: BulkExportMode) => {
    const validCandidates = candidates.filter((c) => c.employeeFullName.trim() !== "");
    if (validCandidates.length === 0) return;

    setIsGenerating(true);
    setProgress(0);

    const totalSteps = mode === "all-4-formats" ? validCandidates.length * 4 : validCandidates.length;
    let completedSteps = 0;

    try {
      for (let i = 0; i < validCandidates.length; i++) {
        const c = validCandidates[i];
        const letterData = generateCandidateData(c);

        // Update active PDF target if PDF modes are involved
        if (mode === "pdf-terms" || mode === "pdf-no-terms" || mode === "all-4-formats") {
          setActiveCandidateForPdf(letterData);
          await new Promise((r) => setTimeout(r, 200));
        }

        // 1. DOCX with Terms & Annexure
        if (mode === "docx-terms" || mode === "all-4-formats") {
          setStatusMessage(`[${i + 1}/${validCandidates.length}] ${c.employeeFullName}: Exporting DOCX (With Terms)...`);
          await generateAppointmentDocx({ ...letterData, includeTermsPage: true }, true);
          completedSteps++;
          setProgress(Math.round((completedSteps / totalSteps) * 100));
          await new Promise((r) => setTimeout(r, 400));
        }

        // 2. DOCX without Terms & Annexure
        if (mode === "docx-no-terms" || mode === "all-4-formats") {
          setStatusMessage(`[${i + 1}/${validCandidates.length}] ${c.employeeFullName}: Exporting DOCX (Without Terms)...`);
          await generateAppointmentDocx({ ...letterData, includeTermsPage: false }, false);
          completedSteps++;
          setProgress(Math.round((completedSteps / totalSteps) * 100));
          await new Promise((r) => setTimeout(r, 400));
        }

        // 3. PDF with Terms & Annexure
        if (mode === "pdf-terms" || mode === "all-4-formats") {
          setStatusMessage(`[${i + 1}/${validCandidates.length}] ${c.employeeFullName}: Exporting PDF (With Terms)...`);
          await exportLetterToPDF(["bulk-pdf-letter", "bulk-pdf-terms"], letterData, "With_Terms");
          completedSteps++;
          setProgress(Math.round((completedSteps / totalSteps) * 100));
          await new Promise((r) => setTimeout(r, 400));
        }

        // 4. PDF without Terms & Annexure
        if (mode === "pdf-no-terms" || mode === "all-4-formats") {
          setStatusMessage(`[${i + 1}/${validCandidates.length}] ${c.employeeFullName}: Exporting PDF (Without Terms)...`);
          await exportLetterToPDF(["bulk-pdf-letter"], letterData, "Letter_Only");
          completedSteps++;
          setProgress(Math.round((completedSteps / totalSteps) * 100));
          await new Promise((r) => setTimeout(r, 400));
        }
      }
    } catch (err) {
      console.error("Batch export error:", err);
    } finally {
      setActiveCandidateForPdf(null);
      setIsGenerating(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Offscreen render container for PDF export */}
        {activeCandidateForPdf && (
          <div style={{ position: "fixed", top: 0, left: "-9999px", width: "800px", opacity: 0, pointerEvents: "none", zIndex: -1000 }}>
            <LetterPreview data={activeCandidateForPdf} containerId="bulk-pdf-letter" />
            <TermsAndConditionsPreview data={activeCandidateForPdf} containerId="bulk-pdf-terms" />
          </div>
        )}

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Bulk Appointment Letter Issuer
              </h3>
              <p className="text-xs text-slate-500">
                Batch generate and export DOCX and PDF appointment letters for multiple candidates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate Table */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left text-slate-800">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-2.5 w-16">Prefix</th>
                  <th className="p-2.5 min-w-[130px]">Full Name</th>
                  <th className="p-2.5 min-w-[150px]">Address</th>
                  <th className="p-2.5 min-w-[120px]">Position</th>
                  <th className="p-2.5 min-w-[130px]">Division</th>
                  <th className="p-2.5 min-w-[110px]">Issue Date</th>
                  <th className="p-2.5 min-w-[110px]">Effective Date</th>
                  <th className="p-2.5 min-w-[100px]">Gross Salary</th>
                  <th className="p-2.5 w-12 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-2">
                      <select
                        value={c.salutation}
                        onChange={(e) => handleCandidateChange(c.id, "salutation", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-xs"
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.employeeFullName}
                        onChange={(e) => handleCandidateChange(c.id, "employeeFullName", e.target.value)}
                        placeholder="Full Name"
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.fullAddress}
                        onChange={(e) => handleCandidateChange(c.id, "fullAddress", e.target.value)}
                        placeholder="Full Address"
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.positionName}
                        onChange={(e) => handleCandidateChange(c.id, "positionName", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.divisionName}
                        onChange={(e) => handleCandidateChange(c.id, "divisionName", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.letterIssueDate}
                        onChange={(e) => handleCandidateChange(c.id, "letterIssueDate", e.target.value)}
                        placeholder="Issue Date"
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.effectiveDate}
                        onChange={(e) => handleCandidateChange(c.id, "effectiveDate", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.grossSalary}
                        onChange={(e) => handleCandidateChange(c.id, "grossSalary", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleRemoveRow(c.id)}
                        disabled={isGenerating}
                        className="text-slate-400 hover:text-red-600 transition p-1 disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleAddRow}
              disabled={isGenerating}
              className="px-3 py-1.5 text-xs text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
            >
              + Add Another Candidate
            </button>
          </div>
        </div>

        {/* Footer & Export Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-3">
          {/* Progress bar */}
          {isGenerating && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-blue-900 font-semibold">
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>{statusMessage || "Generating batch files..."}</span>
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-600">
            <div>
              Total Candidates: <span className="font-bold text-slate-900">{candidates.filter(c => c.employeeFullName.trim()).length}</span>
            </div>
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          {/* 5 Export Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1">
            {/* Button 1: DOCX with Terms */}
            <button
              type="button"
              disabled={isGenerating || candidates.length === 0}
              onClick={() => handleBatchExport("docx-terms")}
              className="flex flex-col items-center justify-center p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-sm disabled:opacity-50 text-center"
              title="Export Word (.docx) file with Terms & Annexure for all candidates"
            >
              <div className="flex items-center space-x-1.5 text-xs font-bold">
                <FileText className="w-4 h-4" />
                <span>Doc (With Terms)</span>
              </div>
              <span className="text-[10px] text-blue-100 mt-0.5">Full Contract</span>
            </button>

            {/* Button 2: DOCX without Terms */}
            <button
              type="button"
              disabled={isGenerating || candidates.length === 0}
              onClick={() => handleBatchExport("docx-no-terms")}
              className="flex flex-col items-center justify-center p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-sm disabled:opacity-50 text-center"
              title="Export Word (.docx) file without Terms & Annexure (Letter Only) for all candidates"
            >
              <div className="flex items-center space-x-1.5 text-xs font-bold">
                <FileText className="w-4 h-4" />
                <span>Doc (Without Terms)</span>
              </div>
              <span className="text-[10px] text-indigo-100 mt-0.5">Letter Only</span>
            </button>

            {/* Button 3: PDF with Terms */}
            <button
              type="button"
              disabled={isGenerating || candidates.length === 0}
              onClick={() => handleBatchExport("pdf-terms")}
              className="flex flex-col items-center justify-center p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition shadow-sm disabled:opacity-50 text-center"
              title="Export PDF file with Terms & Annexure for all candidates"
            >
              <div className="flex items-center space-x-1.5 text-xs font-bold">
                <FileType className="w-4 h-4" />
                <span>PDF (With Terms)</span>
              </div>
              <span className="text-[10px] text-rose-100 mt-0.5">Full Contract</span>
            </button>

            {/* Button 4: PDF without Terms */}
            <button
              type="button"
              disabled={isGenerating || candidates.length === 0}
              onClick={() => handleBatchExport("pdf-no-terms")}
              className="flex flex-col items-center justify-center p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition shadow-sm disabled:opacity-50 text-center"
              title="Export PDF file without Terms & Annexure (Letter Only) for all candidates"
            >
              <div className="flex items-center space-x-1.5 text-xs font-bold">
                <FileType className="w-4 h-4" />
                <span>PDF (Without Terms)</span>
              </div>
              <span className="text-[10px] text-amber-100 mt-0.5">Letter Only</span>
            </button>

            {/* Button 5: Export All 4 Formats */}
            <button
              type="button"
              disabled={isGenerating || candidates.length === 0}
              onClick={() => handleBatchExport("all-4-formats")}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 rounded-xl transition shadow-md disabled:opacity-50 text-center sm:col-span-2 lg:col-span-1"
              title="Export all 4 formats (DOCX & PDF, with and without Terms) for all candidates"
            >
              <div className="flex items-center space-x-1.5 text-xs font-extrabold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>All 4 Formats</span>
              </div>
              <span className="text-[10px] text-slate-300 mt-0.5">DOCX & PDF (All)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

