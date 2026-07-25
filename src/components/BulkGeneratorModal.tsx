import React, { useState } from "react";
import { X, Users, Upload, FileSpreadsheet, Download, CheckCircle2, Play } from "lucide-react";
import { AppointmentLetterData } from "../types";
import { getTodayFormatted, getFutureDateFormatted } from "../utils/dateFormatter";
import { formatGrossSalaryBDT } from "../utils/numberToWords";
import { generateAppointmentDocx } from "../utils/docxGenerator";

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
  effectiveDate: string;
  grossSalary: string;
}

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
      effectiveDate: getFutureDateFormatted(7),
      grossSalary: "65,000"
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const handleBatchDownloadDocs = async () => {
    setIsGenerating(true);
    setProgress(0);

    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      if (!c.employeeFullName) continue;

      const { words } = formatGrossSalaryBDT(c.grossSalary);
      const letterData: AppointmentLetterData = {
        ...baseData,
        salutation: c.salutation,
        employeeFullName: c.employeeFullName,
        fullAddress: c.fullAddress,
        positionName: c.positionName,
        divisionName: c.divisionName,
        effectiveDate: c.effectiveDate,
        grossSalary: c.grossSalary,
        salaryInWords: words ? `(${words})` : "",
        copyTo: [c.divisionName, "Finance & Accounts Division"]
      };

      await generateAppointmentDocx(letterData);
      setProgress(Math.round(((i + 1) / candidates.length) * 100));
      // Small pause to allow browser download loop
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
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
                Generate and download multiple appointment .DOCX letters in one batch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
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
                  <th className="p-2.5 min-w-[140px]">Full Name</th>
                  <th className="p-2.5 min-w-[160px]">Address</th>
                  <th className="p-2.5 min-w-[120px]">Position</th>
                  <th className="p-2.5 min-w-[140px]">Division</th>
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
                        className="text-slate-400 hover:text-red-600 transition p-1"
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
              className="px-3 py-1.5 text-xs text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition"
            >
              + Add Another Candidate
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Total Candidates: <span className="font-bold text-slate-800">{candidates.length}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition"
            >
              Cancel
            </button>

            <button
              onClick={handleBatchDownloadDocs}
              disabled={isGenerating || candidates.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isGenerating ? `Exporting (${progress}%)...` : `Generate All Batch .DOCX`}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
