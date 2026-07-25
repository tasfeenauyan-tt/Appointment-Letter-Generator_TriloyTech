import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { LetterForm } from "./components/LetterForm";
import { LetterPreview } from "./components/LetterPreview";
import { TermsAndConditionsPreview } from "./components/TermsAndConditionsPreview";
import { SavedLettersModal } from "./components/SavedLettersModal";
import { BulkGeneratorModal } from "./components/BulkGeneratorModal";
import { AppointmentLetterData, PresetProfile } from "./types";
import { DEFAULT_LETTER_DATA } from "./data/presets";
import { generateAppointmentDocx } from "./utils/docxGenerator";
import { exportLetterToPDF, triggerPrintLetter } from "./utils/pdfGenerator";
import { Sparkles, Check, AlertCircle } from "lucide-react";

export default function App() {
  const [letterData, setLetterData] = useState<AppointmentLetterData>(DEFAULT_LETTER_DATA);
  const [activeView, setActiveView] = useState<"preview" | "split" | "terms">("split");
  
  const [isDocGenerating, setIsDocGenerating] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  
  const [savedHistory, setSavedHistory] = useState<AppointmentLetterData[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("triloytech_appointment_history");
      if (stored) {
        setSavedHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading saved letters history:", e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Save current record to local history
  const handleSaveHistory = () => {
    const record: AppointmentLetterData = {
      ...letterData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedList = [record, ...savedHistory];
    setSavedHistory(updatedList);
    try {
      localStorage.setItem("triloytech_appointment_history", JSON.stringify(updatedList));
      showToast(`Appointment Letter for ${letterData.employeeFullName} saved!`);
    } catch (e) {
      console.error("Error saving record:", e);
    }
  };

  const handleDeleteHistory = (id: string) => {
    const updated = savedHistory.filter((item) => item.id !== id);
    setSavedHistory(updated);
    try {
      localStorage.setItem("triloytech_appointment_history", JSON.stringify(updated));
      showToast("Record removed from history.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearHistory = () => {
    setSavedHistory([]);
    try {
      localStorage.removeItem("triloytech_appointment_history");
      showToast("History cleared.");
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Preset Load
  const handleSelectPreset = (preset: PresetProfile) => {
    setLetterData((prev) => ({
      ...prev,
      ...preset.data
    }));
    showToast(`Loaded "${preset.label}" role profile!`);
  };

  // Reset to default
  const handleNewLetter = () => {
    setLetterData(DEFAULT_LETTER_DATA);
    showToast("Form reset to blank appointment template.");
  };

  // Download DOCX with Terms & Annexure
  const handleDownloadDocWithTerms = async () => {
    try {
      setIsDocGenerating(true);
      await generateAppointmentDocx(letterData, true);
      showToast("DOCX with Terms & Annexure downloaded!");
    } catch (err) {
      console.error("DOCX error:", err);
      showToast("Failed to export .docx file.");
    } finally {
      setIsDocGenerating(false);
    }
  };

  // Download DOCX without Terms & Annexure (Letter Only)
  const handleDownloadDocWithoutTerms = async () => {
    try {
      setIsDocGenerating(true);
      await generateAppointmentDocx(letterData, false);
      showToast("DOCX (Letter Only) downloaded!");
    } catch (err) {
      console.error("DOCX error:", err);
      showToast("Failed to export .docx file.");
    } finally {
      setIsDocGenerating(false);
    }
  };

  // Download PDF with Terms & Annexure
  const handleDownloadPdfWithTerms = async () => {
    try {
      setIsPdfGenerating(true);
      await exportLetterToPDF(["export-letter-preview", "export-terms-preview"], letterData, "With_Terms");
      showToast("PDF with Terms & Annexure exported!");
    } catch (err) {
      console.error("PDF export error:", err);
      triggerPrintLetter();
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Download PDF without Terms & Annexure (Letter Only)
  const handleDownloadPdfWithoutTerms = async () => {
    try {
      setIsPdfGenerating(true);
      await exportLetterToPDF(["export-letter-preview"], letterData, "Letter_Only");
      showToast("PDF (Letter Only) exported!");
    } catch (err) {
      console.error("PDF export error:", err);
      triggerPrintLetter();
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Trigger Print
  const handlePrint = () => {
    triggerPrintLetter();
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans antialiased">
      
      {/* Top Navbar */}
      <Header
        onDownloadDocWithTerms={handleDownloadDocWithTerms}
        onDownloadDocWithoutTerms={handleDownloadDocWithoutTerms}
        onDownloadPdfWithTerms={handleDownloadPdfWithTerms}
        onDownloadPdfWithoutTerms={handleDownloadPdfWithoutTerms}
        onPrint={handlePrint}
        onNewLetter={handleNewLetter}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenBulk={() => setIsBulkOpen(true)}
        onSelectPreset={handleSelectPreset}
        isDocGenerating={isDocGenerating}
        isPdfGenerating={isPdfGenerating}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Hidden Export Container for PDF rasterization in any view */}
      <div
        className="fixed top-0 -left-[9999px] opacity-100 pointer-events-none z-[-100]"
        aria-hidden="true"
      >
        <div className="w-[210mm]">
          <LetterPreview data={letterData} containerId="export-letter-preview" />
          <TermsAndConditionsPreview data={letterData} containerId="export-terms-preview" />
        </div>
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        
        {/* VIEW 1: SPLIT EDITOR (Form on Left, Live Preview on Right) */}
        {activeView === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Form Column */}
            <div className="lg:col-span-5 no-print">
              <LetterForm
                data={letterData}
                onChange={setLetterData}
                onSaveHistory={handleSaveHistory}
              />
            </div>

            {/* Right Live Preview Column */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="no-print w-full flex items-center justify-between mb-3 px-1 text-xs text-slate-500 font-medium">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Document Render (A4 Printable Layout)</span>
                </span>
                <span>TriloyTech Standard Format</span>
              </div>

              <LetterPreview data={letterData} />
            </div>
          </div>
        )}

        {/* VIEW 2: FULL LETTER PREVIEW */}
        {activeView === "preview" && (
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="no-print w-full flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
              <span>Viewing Full Screen Letter Preview</span>
              <button
                onClick={() => setActiveView("split")}
                className="text-blue-600 font-bold hover:underline"
              >
                ← Back to Editor
              </button>
            </div>
            <LetterPreview data={letterData} />
          </div>
        )}

        {/* VIEW 3: TERMS & CONDITIONS ANNEXURE PAGE */}
        {activeView === "terms" && (
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="no-print w-full flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
              <span>Viewing Annexure: Terms &amp; Conditions of Employment</span>
              <button
                onClick={() => setActiveView("split")}
                className="text-blue-600 font-bold hover:underline"
              >
                ← Back to Editor
              </button>
            </div>
            <TermsAndConditionsPreview data={letterData} />
          </div>
        )}

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-2 animate-in slide-in-from-bottom-5 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* History Modal */}
      <SavedLettersModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedLetters={savedHistory}
        onSelectLetter={setLetterData}
        onDeleteLetter={handleDeleteHistory}
        onClearAll={handleClearHistory}
      />

      {/* Bulk Generator Modal */}
      <BulkGeneratorModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        baseData={letterData}
        onLoadBatchRecord={setLetterData}
      />

    </div>
  );
}
