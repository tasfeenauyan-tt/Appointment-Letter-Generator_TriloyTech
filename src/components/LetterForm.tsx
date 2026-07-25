import React from "react";
import {
  Calendar,
  User,
  MapPin,
  Briefcase,
  Layers,
  Banknote,
  PenTool,
  Building,
  Check,
  Plus,
  Trash2,
  BookmarkPlus,
  RotateCcw,
  Sparkles,
  HelpCircle,
  FileCheck2
} from "lucide-react";
import { AppointmentLetterData } from "../types";
import { formatGrossSalaryBDT } from "../utils/numberToWords";
import { formatDateToDDMonthYYYY } from "../utils/dateFormatter";

interface LetterFormProps {
  data: AppointmentLetterData;
  onChange: (updated: AppointmentLetterData) => void;
  onSaveHistory: () => void;
  onReset: () => void;
}

export const LetterForm: React.FC<LetterFormProps> = ({
  data,
  onChange,
  onSaveHistory,
  onReset
}) => {
  const handleInputChange = (field: keyof AppointmentLetterData, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Helper when gross salary is updated
  const handleSalaryChange = (val: string) => {
    const { words } = formatGrossSalaryBDT(val);
    onChange({
      ...data,
      grossSalary: val,
      salaryInWords: words ? `(${words})` : ""
    });
  };

  // Date formatting handlers
  const handleDateChange = (field: "letterIssueDate" | "effectiveDate", rawValue: string) => {
    const formatted = formatDateToDDMonthYYYY(rawValue);
    handleInputChange(field, formatted);
  };

  // Array item handlers
  const handleAddEnclosure = () => {
    handleInputChange("enclosures", [...data.enclosures, "New Document"]);
  };

  const handleUpdateEnclosure = (index: number, val: string) => {
    const list = [...data.enclosures];
    list[index] = val;
    handleInputChange("enclosures", list);
  };

  const handleRemoveEnclosure = (index: number) => {
    handleInputChange(
      "enclosures",
      data.enclosures.filter((_, i) => i !== index)
    );
  };

  const handleAddCopyTo = () => {
    handleInputChange("copyTo", [...data.copyTo, "New Department Division"]);
  };

  const handleUpdateCopyTo = (index: number, val: string) => {
    const list = [...data.copyTo];
    list[index] = val;
    handleInputChange("copyTo", list);
  };

  const handleRemoveCopyTo = (index: number) => {
    handleInputChange(
      "copyTo",
      data.copyTo.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-6">
      
      {/* Title & Quick Save */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <PenTool className="w-4 h-4 text-blue-600" />
            <span>Appointment Details</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in the required information to auto-generate the official letter.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition flex items-center space-x-1 border border-slate-200"
            title="Reset & Clear Form"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onSaveHistory}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition flex items-center space-x-1 border border-blue-200/60"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Save Record</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: EMPLOYEE INFORMATION */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span>Employee Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Salutation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Salutation
            </label>
            <select
              value={data.salutation}
              onChange={(e) => handleInputChange("salutation", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Dr.">Dr.</option>
              <option value="Engr.">Engr.</option>
            </select>
          </div>

          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Employee Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.employeeFullName}
              onChange={(e) => handleInputChange("employeeFullName", e.target.value)}
              placeholder="e.g. Tanvir Hossain"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        {/* Full Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Address <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={data.fullAddress}
            onChange={(e) => handleInputChange("fullAddress", e.target.value)}
            placeholder="e.g. House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
      </div>

      {/* SECTION 2: POSITION, DIVISION & COMPENSATION */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          <span>Role & Remuneration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Position Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Position Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.positionName}
              onChange={(e) => handleInputChange("positionName", e.target.value)}
              placeholder="e.g. Executive or Senior Manager"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Division Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Division Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.divisionName}
              onChange={(e) => handleInputChange("divisionName", e.target.value)}
              placeholder="e.g. Sales & Business Development Division"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        {/* Gross Salary */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Monthly Gross Salary (BDT) <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
              BDT
            </div>
            <input
              type="text"
              value={data.grossSalary}
              onChange={(e) => handleSalaryChange(e.target.value)}
              placeholder="e.g. 50,000"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>
          {data.salaryInWords && (
            <p className="text-[11px] text-blue-600 font-medium mt-1">
              In Words: <span className="italic">({data.salaryInWords.replace(/^\(|\)$/g, "").trim()})</span>
            </p>
          )}
        </div>
      </div>

      {/* SECTION 3: KEY DATES */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Important Dates</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Letter Issue Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Letter Issue Date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.letterIssueDate}
              onChange={(e) => handleInputChange("letterIssueDate", e.target.value)}
              placeholder="e.g. 25 July 2026"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <p className="text-[10px] text-slate-400 mt-1">Format: DD Month YYYY</p>
          </div>

          {/* Effective Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Effective Date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.effectiveDate}
              onChange={(e) => handleInputChange("effectiveDate", e.target.value)}
              placeholder="e.g. 01 August 2026"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <p className="text-[10px] text-slate-400 mt-1">Format: DD Month YYYY</p>
          </div>
        </div>
      </div>

      {/* SECTION 4: SIGNATORY & BRANDING */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
          <Building className="w-3.5 h-3.5 text-blue-600" />
          <span>Signatory & Letterhead</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Signatory Name
            </label>
            <input
              type="text"
              value={data.signatoryName}
              onChange={(e) => handleInputChange("signatoryName", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Signatory Title
            </label>
            <input
              type="text"
              value={data.signatoryTitle}
              onChange={(e) => handleInputChange("signatoryTitle", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.includeLetterhead}
              onChange={(e) => handleInputChange("includeLetterhead", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="font-semibold text-slate-700">Include Official Letterhead Header</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.includeDigitalSignature}
              onChange={(e) => handleInputChange("includeDigitalSignature", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="font-semibold text-slate-700">Signature Underline</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.includeTermsPage}
              onChange={(e) => handleInputChange("includeTermsPage", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="font-semibold text-slate-700">Include Terms Annexure Page</span>
          </label>
        </div>
      </div>

      {/* SECTION 5: ENCLOSURES & COPY TO */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Enclosures */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Enclosures (Attachment)
              </label>
              <button
                type="button"
                onClick={handleAddEnclosure}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            {data.enclosures.map((enc, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="text-slate-400 font-bold text-xs">·</span>
                <input
                  type="text"
                  value={enc}
                  onChange={(e) => handleUpdateEnclosure(idx, e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveEnclosure(idx)}
                  className="text-slate-400 hover:text-red-600 p-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Copy To */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Copy To (Distribution)
              </label>
              <button
                type="button"
                onClick={handleAddCopyTo}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Division</span>
              </button>
            </div>

            {data.copyTo.map((cp, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="text-slate-400 font-bold text-xs">·</span>
                <input
                  type="text"
                  value={cp}
                  onChange={(e) => handleUpdateCopyTo(idx, e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCopyTo(idx)}
                  className="text-slate-400 hover:text-red-600 p-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};
