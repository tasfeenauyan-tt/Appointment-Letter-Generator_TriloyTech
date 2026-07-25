import React from "react";
import { AppointmentLetterData } from "../types";
import { formatGrossSalaryBDT } from "../utils/numberToWords";

interface LetterPreviewProps {
  data: AppointmentLetterData;
  containerId?: string;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({
  data,
  containerId = "appointment-letter-document"
}) => {
  const { formattedNumber, words } = formatGrossSalaryBDT(data.grossSalary);
  const displaySalary = formattedNumber || data.grossSalary || "50,000";
  const salaryWordsText = words || data.salaryInWords;

  const salutationName = `${data.salutation || "Mr."} ${data.employeeFullName || "[Full Name]"}`.trim();
  const addressLines = (data.fullAddress || "[Full Address]").split("\n");

  return (
    <div className="w-full flex justify-center py-4 sm:py-8 bg-[#F8F9FA] min-h-screen overflow-x-auto">
      {/* Standard A4 Paper Container Box */}
      <div
        id={containerId}
        className="letter-page bg-white text-[#1E293B] shadow-xl shadow-slate-200/60 rounded-sm border border-slate-200/80 p-8 sm:p-14 md:p-16 w-full max-w-[210mm] min-h-[297mm] mx-auto font-sans leading-relaxed text-sm sm:text-base flex flex-col justify-between select-text"
        style={{
          boxSizing: "border-box",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        <div>
          {/* Official Letterhead Header (Only rendered if explicitly enabled) */}
          {data.includeLetterhead && (
            <div className="mb-6 border-b border-slate-200 pb-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight uppercase">
                  {data.companyName}
                </h1>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {data.companyAddress}
              </p>
              <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                {data.companyContact}
              </p>
            </div>
          )}

          {/* Confidential Notice & Issue Date (Left Aligned on top of Date) */}
          <div className="mb-5 space-y-1 text-left">
            <p className="font-bold text-xs uppercase tracking-wider text-slate-800">
              PRIVATE &amp; CONFIDENTIAL
            </p>
            <p className="font-semibold text-slate-800 text-sm">
              <span className="font-bold">Date:</span> {data.letterIssueDate || "25 July 2026"}
            </p>
          </div>

          {/* Addressee Section */}
          <div className="mb-5 space-y-0.5 text-slate-800 text-sm">
            <p className="font-bold">To:</p>
            <p className="font-bold text-slate-950">{salutationName}</p>
            {addressLines.map((line, idx) => (
              <p key={idx} className="text-slate-700 whitespace-pre-wrap">
                {line}
              </p>
            ))}
          </div>

          {/* Subject Line */}
          <div className="mb-5">
            <p className="font-bold text-slate-950 text-sm sm:text-base">
              Subject: <span className="underline underline-offset-4 decoration-2 decoration-slate-900">Appointment Letter</span>
            </p>
          </div>

          {/* Dear [Full Name], */}
          <div className="mb-4">
            <p className="font-bold text-slate-900 text-sm">Dear {salutationName},</p>
          </div>

          {/* Letter Body Paragraphs */}
          <div className="space-y-3 text-slate-800 text-justify leading-relaxed text-xs sm:text-sm">
            
            {/* Paragraph 1 */}
            <p>
              We are pleased to appoint you as an{" "}
              <strong className="text-slate-950 font-bold">{data.positionName || "Executive"}</strong>{" "}
              under the{" "}
              <strong className="text-slate-950 font-bold">{data.divisionName || "Sales & Business Development Division"}</strong>{" "}
              of TriloyTech, effective from{" "}
              <strong className="text-slate-950 font-bold">{data.effectiveDate || "01 August 2026"}</strong>.
            </p>

            {/* Paragraph 2 */}
            <p>
              Your monthly gross salary will be{" "}
              <strong className="text-slate-950 font-bold">
                BDT {displaySalary} {salaryWordsText ? `${salaryWordsText}` : ""}
              </strong>
              , payable in accordance with the Company's payroll policies.
            </p>

            {/* Paragraph 3 */}
            <p>
              Your employment is subject to the attached Terms and Conditions of Employment, which form an integral part of this Appointment Letter. By accepting this appointment, you agree to comply with the Company's policies, rules, and procedures, as amended from time to time.
            </p>

            {/* Paragraph 4 */}
            <p>
              The Company reserves the right to revise your duties, reporting structure, or employment terms in accordance with business requirements and applicable laws.
            </p>

            {/* Paragraph 5 */}
            <p>
              We look forward to a successful business relationship with you now and in coming days and wish you all the very best from the Management of TriloyTech.
            </p>
          </div>

          {/* Signatory Section */}
          <div className="mt-8 mb-6 space-y-0.5">
            <p className="text-slate-800 font-medium text-xs sm:text-sm">Best Regards,</p>

            {/* Signature Area */}
            <div className="my-1.5">
              {data.includeDigitalSignature ? (
                <div className="h-10 border-b border-slate-300 w-44 my-0.5" />
              ) : (
                <div className="h-10 my-0.5" />
              )}
            </div>

            <p className="font-bold text-slate-950 text-sm">
              {data.signatoryName || "Tasfeen Auyan"}
            </p>
            <p className="text-slate-700 font-medium text-xs">
              {data.signatoryTitle || "Director – Human Resources"}
            </p>
            <p className="font-bold text-slate-900 text-xs">
              {data.companyName || "TriloyTech"}
            </p>
          </div>

          {/* Enclosures Section */}
          {data.enclosures && data.enclosures.length > 0 && (
            <div className="mt-4 text-xs text-slate-800">
              <p className="font-bold text-slate-950 mb-0.5">Enclosure:</p>
              <ul className="list-none space-y-0.5 pl-0">
                {data.enclosures.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="font-bold text-slate-600">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Copy To Section */}
          {data.copyTo && data.copyTo.length > 0 && (
            <div className="mt-3 text-xs text-slate-800">
              <p className="font-bold text-slate-950 mb-0.5">Copy to:</p>
              <ul className="list-none space-y-0.5 pl-0">
                {data.copyTo.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="font-bold text-slate-600">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400">
          <span>TriloyTech HR Operations Document</span>
          <span>Confidential — For Recipient Only</span>
        </div>

      </div>
    </div>
  );
};
