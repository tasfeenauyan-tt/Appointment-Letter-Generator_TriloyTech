import React, { useState } from "react";
import { X, Search, Trash2, ArrowUpRight, Calendar, User, Briefcase, FileCheck } from "lucide-react";
import { AppointmentLetterData } from "../types";

interface SavedLettersModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedLetters: AppointmentLetterData[];
  onSelectLetter: (letter: AppointmentLetterData) => void;
  onDeleteLetter: (id: string) => void;
  onClearAll: () => void;
}

export const SavedLettersModal: React.FC<SavedLettersModalProps> = ({
  isOpen,
  onClose,
  savedLetters,
  onSelectLetter,
  onDeleteLetter,
  onClearAll
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredLetters = savedLetters.filter((item) => {
    const nameMatch = item.employeeFullName.toLowerCase().includes(searchTerm.toLowerCase());
    const positionMatch = item.positionName.toLowerCase().includes(searchTerm.toLowerCase());
    const divisionMatch = item.divisionName.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || positionMatch || divisionMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Saved Appointment Letters
              </h3>
              <p className="text-xs text-slate-500">
                Manage and reload previously generated employee records ({savedLetters.length})
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

        {/* Search & Actions */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by candidate name, position or division..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {savedLetters.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-3 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold rounded-xl transition border border-red-200/60 flex items-center space-x-1 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {filteredLetters.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FileCheck className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
              <p className="text-xs font-medium">No saved letters found.</p>
              <p className="text-[11px] text-slate-400">
                Click "Save Record" on the form to keep records here for future access.
              </p>
            </div>
          ) : (
            filteredLetters.map((letter) => (
              <div
                key={letter.id || Math.random().toString()}
                className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl p-3.5 transition group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {letter.salutation} {letter.employeeFullName}
                    </span>
                    <span className="text-[10px] bg-slate-200/70 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                      BDT {letter.grossSalary}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center text-xs text-slate-500 gap-x-3 gap-y-1">
                    <span className="flex items-center space-x-1">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span>{letter.positionName}</span>
                    </span>
                    <span>•</span>
                    <span>{letter.divisionName}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Issued: {letter.letterIssueDate}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 justify-end">
                  <button
                    onClick={() => {
                      onSelectLetter(letter);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition flex items-center space-x-1 shadow-sm"
                  >
                    <span>Load Letter</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => letter.id && onDeleteLetter(letter.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
