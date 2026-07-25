import React from "react";
import { AppointmentLetterData } from "../types";

interface TermsAndConditionsPreviewProps {
  data: AppointmentLetterData;
  containerId?: string;
}

export const TermsAndConditionsPreview: React.FC<TermsAndConditionsPreviewProps> = ({
  data,
  containerId = "terms-annexure-document"
}) => {
  const salutationName = `${data.salutation || "Mr."} ${data.employeeFullName || "[Full Name]"}`.trim();

  return (
    <div className="w-full flex justify-center py-4 sm:py-8 bg-[#F8F9FA] min-h-screen overflow-x-auto">
      <div
        id={containerId}
        className="letter-page bg-white text-[#1E293B] shadow-xl shadow-slate-200/60 rounded-sm border border-slate-200/80 p-8 sm:p-12 md:p-14 w-full max-w-[210mm] mx-auto font-sans leading-relaxed text-xs sm:text-sm flex flex-col justify-between select-text"
        style={{
          boxSizing: "border-box",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        <div>
          {/* Header */}
          {data.includeLetterhead && (
            <div className="mb-6 border-b border-slate-200 pb-4 text-center">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">
                {data.companyName || "TriloyTech"}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Annexure I: Terms and Conditions of Employment
              </p>
            </div>
          )}

          {/* Document Title */}
          <div className="text-center mb-8">
            <h2 className="text-base font-bold text-slate-950 uppercase tracking-wide border-b-2 border-slate-900 inline-block pb-1">
              Terms and Conditions of Employment
            </h2>
            <p className="text-xs text-slate-600 font-normal mt-2 italic">
              The following Terms and Conditions form an integral part of your employment with TriloyTech. For the purposes of these Terms and Conditions, "the Company" means TriloyTech, including its successors, assigns, affiliates, subsidiaries (where applicable), and any entity operating under the TriloyTech brand.
            </p>
          </div>

          {/* 26 Clauses */}
          <div className="space-y-5 text-slate-800 text-justify text-xs sm:text-sm">
            
            {/* Clause 1 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">1. Remuneration</h3>
              <p className="mb-1">
                You shall receive remuneration in accordance with the salary and benefits specified in the Appointment Letter and/or the applicable Compensation Structure issued by the Company.
              </p>
              <p className="mb-1">
                The Employee's remuneration may comprise various components, including but not limited to Basic Salary, House Rent Allowance, Medical Allowance, Conveyance Allowance, and any other allowances or benefits as determined by the Company from time to time.
              </p>
              <p className="mb-1">
                The composition of the remuneration package may be revised, restructured, or adjusted by the Company from time to time in accordance with applicable laws, statutory requirements, and the Company's compensation policies, provided that such changes do not reduce the Employee's agreed Gross Salary unless otherwise mutually agreed or permitted by law.
              </p>
              <p>
                The Company may structure the remuneration package in a manner that optimizes statutory compliance and provides the maximum lawful tax efficiency available to the Employee under the prevailing laws of Bangladesh.
              </p>
            </div>

            {/* Clause 2 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">2. Leave Fare Assistance (LFA)</h3>
              <p>
                You may be eligible for Leave Fare Assistance (LFA) in accordance with the Company's compensation policy. The eligibility criteria, amount, frequency of payment, and applicable terms shall be determined by the Company and may be revised from time to time.
              </p>
            </div>

            {/* Clause 3 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">3. Probationary Period</h3>
              <p className="mb-1">
                You will remain on probation for a period of three (3) months from your date of joining.
              </p>
              <p className="mb-1">
                During the probationary period, either party may terminate the employment by providing twenty-four (24) hours' written notice or payment in lieu thereof, unless otherwise required under applicable law.
              </p>
              <p className="mb-1">
                The Company may extend the probationary period where performance is found to be unsatisfactory, provided that such extension is communicated in writing.
              </p>
              <p>
                Confirmation of employment shall become effective only upon issuance of a written confirmation letter by the Company.
              </p>
            </div>

            {/* Clause 4 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">4. Festival Bonus</h3>
              <p className="mb-1">
                You shall be eligible for a maximum of two (2) Festival Bonuses in a calendar year, corresponding to the Company's designated major religious festivals.
              </p>
              <p className="mb-1">Each Festival Bonus shall be equivalent to one (1) month's Basic Salary, subject to:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>Successful completion of probation (unless otherwise approved by management);</li>
                <li>The Company's Festival Bonus Policy; and</li>
                <li>Pro-rata calculation based on your joining date during your first year of employment.</li>
              </ul>
            </div>

            {/* Clause 5 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">5. Performance Bonus</h3>
              <p className="mb-1">You may be eligible for a Performance Bonus subject to:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2 mb-1">
                <li>Individual performance;</li>
                <li>Achievement of agreed Key Performance Indicators (KPIs);</li>
                <li>Departmental and Company performance; and</li>
                <li>The Company's financial performance.</li>
              </ul>
              <p>
                The Company reserves the sole discretion to determine the amount, timing, eligibility, and payment of any Performance Bonus. Unless otherwise approved, bonus payments shall be calculated on a pro-rata basis where applicable.
              </p>
            </div>

            {/* Clause 6 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">6. Provident Fund</h3>
              <p>
                The Company may introduce a Provident Fund Scheme in accordance with applicable laws and its internal policies. Participation, eligibility, contribution rates, and related terms shall be governed by the Company's Provident Fund Rules, as adopted and amended from time to time.
              </p>
            </div>

            {/* Clause 7 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">7. Gratuity</h3>
              <p>
                The Company does not currently operate a Gratuity Scheme. However, the Company may introduce such a scheme in the future, subject to applicable laws of Bangladesh and its internal policies. Any gratuity benefit, if introduced, shall be governed by the Company's Gratuity Policy, including the applicable eligibility criteria, calculation methodology, and payment terms.
              </p>
            </div>

            {/* Clause 8 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">8. Leave Entitlement</h3>
              <p className="mb-1">Unless otherwise revised by Company policy, you shall be entitled to the following annual leave benefits:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2 mb-1">
                <li><strong>Annual Leave:</strong> 26 (Twenty-Six) working days per calendar year.</li>
                <li><strong>Medical/Sick Leave:</strong> 14 (Fourteen) working days per calendar year.</li>
              </ul>
              <p className="mb-1">Any additional leave categories shall be governed by the Company's Leave Policy.</p>
              <p className="mb-1">The leave year shall run from 1 January to 31 December.</p>
              <p>All leave must be applied for, approved, and utilized in accordance with the Company's Leave Policy.</p>
            </div>

            {/* Clause 9 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">9. Official Travel</h3>
              <p>
                Where official duties require travel, such travel shall be governed by the Company's Travel Policy. All travel-related expenses and reimbursements shall be subject to prior approval and Company policy.
              </p>
            </div>

            {/* Clause 10 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">10. Retirement</h3>
              <p>
                Unless otherwise amended by law or Company policy, the normal retirement age shall be 57 (Fifty-Seven) years.
              </p>
            </div>

            {/* Clause 11 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">11. Working Hours</h3>
              <div className="mb-2">
                <p className="font-semibold text-slate-900 mb-0.5">For full time:</p>
                <p className="mb-1">
                  Your normal working schedule shall be 8.5 (Eight and a Half) hours per working day, inclusive of a 30-minute lunch break.
                </p>
                <p className="mb-1">The Company's standard working days are Saturday through Thursday.</p>
                <p className="mb-1">The Company may introduce flexible working hours, hybrid work arrangements, or revised schedules based on operational requirements.</p>
                <p>Employees are expected to remain available during designated Core Office Hours, as communicated by the Company.</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 mb-0.5">For part time:</p>
                <p className="mb-1">
                  As a Part-Time Employee, your working hours shall be as specified in your Appointment Letter or as otherwise communicated by the Company from time to time. Your work schedule may vary depending on operational requirements and business needs.
                </p>
                <p className="mb-1">
                  Unless otherwise agreed in writing, you are expected to work only during your assigned working hours and to remain available during the agreed working period on your scheduled workdays.
                </p>
                <p className="mb-1">
                  The Company's standard working days are Saturday through Thursday. However, depending on the nature of your role and business requirements, your scheduled working days and hours may differ.
                </p>
                <p>
                  The Company may introduce flexible working hours, hybrid work arrangements, remote work arrangements, or revised schedules based on operational requirements. Any changes to your assigned schedule will be communicated in advance whenever reasonably practicable.
                </p>
              </div>
            </div>

            {/* Clause 12 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">12. Duty Station</h3>
              <p className="mb-1">Your initial duty station shall be Dhaka, Bangladesh.</p>
              <p>
                However, the Company reserves the right to transfer, assign, or temporarily relocate you to any of its offices, project sites, client locations, or other work locations within or outside Bangladesh based on business requirements.
              </p>
            </div>

            {/* Clause 13 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">13. Income Tax</h3>
              <p>
                Income Tax, where applicable, shall be deducted at source from your salary in accordance with the prevailing laws of Bangladesh and remitted to the appropriate government authority.
              </p>
            </div>

            {/* Clause 14 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">14. Confidentiality and Conflict of Interest</h3>
              <p className="mb-1">
                During your employment and after its termination, you shall maintain strict confidentiality regarding all confidential information relating to the Company's business, operations, clients, suppliers, employees, technology, pricing, strategies, financial information, and intellectual property.
              </p>
              <p className="mb-1">
                You shall not disclose such information to any third party without prior written authorization from the Company.
              </p>
              <p className="mb-1">
                You shall not engage in any employment, consultancy, freelancing, partnership, or business activity that creates a conflict of interest with the Company unless prior written approval has been obtained.
              </p>
              <p>
                Any breach of confidentiality or conflict of interest may result in disciplinary action, including termination of employment and legal proceedings where applicable.
              </p>
            </div>

            {/* Clause 15 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">15. Compliance with Company Policies</h3>
              <p className="mb-1">You agree to comply with:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>All Company rules, policies, and procedures;</li>
                <li>The Employee Handbook;</li>
                <li>Information Security policies;</li>
                <li>Code of Conduct;</li>
                <li>Any future policies issued by the Company.</li>
              </ul>
            </div>

            {/* Clause 16 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">16. Amendment of Terms</h3>
              <p className="mb-1">
                The Company reserves the right to amend, revise, modify, or replace any employment terms, compensation structures, policies, benefits, or rules whenever deemed necessary for business or legal reasons.
              </p>
              <p>Any such amendment shall become effective upon notification to employees.</p>
            </div>

            {/* Clause 17 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">17. Resignation and Termination</h3>
              <p className="mb-1">
                Either party may terminate this employment by providing one (1) month's written notice or payment in lieu of notice equivalent to one (1) month's Basic Salary, unless otherwise required under applicable law.
              </p>
              <p className="mb-1">
                The Company reserves the right to terminate employment without notice or compensation where dismissal is justified under the Bangladesh Labour Act, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>Gross misconduct;</li>
                <li>Fraud;</li>
                <li>Theft;</li>
                <li>Serious negligence;</li>
                <li>Insubordination;</li>
                <li>Breach of confidentiality;</li>
                <li>Violation of Company policies; or</li>
                <li>Any other act warranting summary dismissal under applicable law.</li>
              </ul>
            </div>

            {/* Clause 18 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">18. Full and Final Settlement</h3>
              <p className="mb-1">Upon cessation of employment for any reason:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2 mb-1">
                <li>
                  All outstanding Company property, including but not limited to laptops, computers, mobile devices, access cards, documents, software, confidential information, files, records, and other assets, must be returned immediately.
                </li>
                <li>Any amount owed by you to the Company may be adjusted against your final settlement.</li>
                <li>Any remaining outstanding balance shall remain payable by you.</li>
              </ul>
              <p>Final settlement shall be processed only after successful completion of all clearance formalities.</p>
            </div>

            {/* Clause 19 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">19. Intellectual Property</h3>
              <p className="mb-1">
                All inventions, discoveries, developments, designs, software, source code, documentation, databases, websites, graphics, marketing materials, creative works, business processes, reports, methodologies, trade secrets, and any other work product conceived, created, developed, or contributed by you, whether individually or jointly with others, during the course of your employment and relating to the Company's business shall be the exclusive property of The Company.
              </p>
              <p className="mb-1">
                You hereby assign to the Company all rights, title, and interest, including intellectual property rights, in such work products. You shall execute any documents and provide all reasonable assistance required by the Company to establish, protect, or enforce such rights.
              </p>
              <p>
                You shall not copy, reproduce, distribute, publish, sell, license, or use any Company intellectual property for personal or third-party purposes without prior written authorization from the Company.
              </p>
            </div>

            {/* Clause 20 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">20. Non-Solicitation</h3>
              <p className="mb-1">
                During your employment and for a period of twelve (12) months following the termination of your employment, you shall not, directly or indirectly:
              </p>
              <ul className="list-disc list-inside space-y-0.5 ml-2 mb-1">
                <li>Solicit or attempt to solicit any employee or contractor of the Company for employment or engagement elsewhere;</li>
                <li>Solicit, induce, or encourage any client, customer, supplier, or business partner to terminate or reduce their business relationship with the Company;</li>
                <li>Use confidential Company information for the purpose of competing with or causing loss to the Company.</li>
              </ul>
              <p>This clause shall be interpreted only to the extent permitted under the applicable laws of Bangladesh.</p>
            </div>

            {/* Clause 21 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">21. Remote Work / Hybrid Work</h3>
              <p className="mb-1">Where approved by the Company, employees may work remotely or under a hybrid working arrangement.</p>
              <p className="mb-1">Employees working remotely shall:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2 mb-1">
                <li>Maintain official working hours unless otherwise approved;</li>
                <li>Remain available during designated Core Office Hours;</li>
                <li>Ensure reliable internet connectivity and a suitable working environment;</li>
                <li>Protect Company assets, confidential information, and client data;</li>
                <li>Follow all cybersecurity, information security, and data protection policies;</li>
                <li>Attend office, client meetings, or Company events whenever required by management.</li>
              </ul>
              <p>
                The Company reserves the right to modify, suspend, or withdraw any remote or hybrid work arrangement at its sole discretion based on operational requirements.
              </p>
            </div>

            {/* Clause 22 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">22. Disciplinary Procedures</h3>
              <p className="mb-1">
                Employees are expected to maintain the highest standards of professionalism, integrity, and conduct.
              </p>
              <p className="mb-1">
                Violation of Company policies, misconduct, negligence, unauthorized absence, insubordination, misuse of Company assets, breach of confidentiality, harassment, discrimination, fraud, or any unlawful act may result in disciplinary action.
              </p>
              <p className="mb-1">Depending on the nature and severity of the misconduct, disciplinary measures may include:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2 mb-1">
                <li>Verbal warning;</li>
                <li>Written warning;</li>
                <li>Performance Improvement Plan (PIP);</li>
                <li>Suspension with or without pay, where permitted by law;</li>
                <li>Demotion or reassignment;</li>
                <li>Recovery of losses, where legally permissible; or</li>
                <li>Termination of employment.</li>
              </ul>
              <p>
                The Company shall conduct disciplinary proceedings in accordance with applicable laws and principles of natural justice where required.
              </p>
            </div>

            {/* Clause 23 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">23. Force Majeure</h3>
              <p className="mb-1">
                The Company shall not be liable for any delay, interruption, or failure to fulfil its obligations arising from events beyond its reasonable control, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-0.5 ml-2 mb-1">
                <li>Natural disasters;</li>
                <li>Floods;</li>
                <li>Earthquakes;</li>
                <li>Fires;</li>
                <li>Epidemics or pandemics;</li>
                <li>Government restrictions;</li>
                <li>Political unrest;</li>
                <li>War;</li>
                <li>Terrorism;</li>
                <li>Nationwide internet or utility failures;</li>
                <li>Industrial disputes; or</li>
                <li>Any other event constituting Force Majeure.</li>
              </ul>
              <p>
                Where such events materially affect business operations, the Company may temporarily suspend operations, revise working arrangements, require remote working where feasible, grant unpaid leave, where permitted by law, or take any other reasonable measures necessary to protect its employees and business operations.
              </p>
            </div>

            {/* Clause 24 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">24. Protection of Personal Data</h3>
              <p className="mb-1">
                For employment administration purposes, the Company shall collect, process, store, and maintain personal information relating to you.
              </p>
              <p className="mb-1">
                Such information shall be used solely for legitimate employment, legal, administrative, payroll, statutory, and business purposes and shall be treated with reasonable confidentiality.
              </p>
              <p>
                You are responsible for informing the Human Resources Department of any changes to your personal information to ensure Company records remain accurate and up to date.
              </p>
            </div>

            {/* Clause 25 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">25. Governing Law</h3>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of the People's Republic of Bangladesh, including the Bangladesh Labour Act, 2006 (as amended) and other applicable laws and regulations.
              </p>
            </div>

            {/* Clause 26 */}
            <div>
              <h3 className="font-bold text-slate-950 mb-1">26. Acceptance</h3>
              <p>
                By signing the Employment Offer Letter and/or Employment Agreement, you acknowledge that you have read, understood, and accepted these Terms and Conditions of Employment and agree to comply with all Company policies, procedures, and applicable laws throughout your employment with The Company.
              </p>
            </div>

          </div>

          {/* Employee Acknowledgement & Signatures */}
          <div className="mt-10 pt-6 border-t border-slate-300">
            <h4 className="font-bold text-slate-950 text-sm mb-2">Employee Acknowledgement</h4>
            <p className="text-xs text-slate-700 leading-relaxed mb-6">
              I hereby acknowledge that I have carefully read, understood, and accepted the above Terms and Conditions of Employment. I agree to comply with all Company policies, procedures, and applicable laws throughout my employment with The Company.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-xs text-slate-800 font-medium mb-1">
                  <strong>Employee Name:</strong> {data.employeeFullName || "___________________________"}
                </p>
                <p className="text-xs text-slate-800 font-medium mb-6">
                  <strong>Signature:</strong> ________________________________
                </p>
                <p className="text-xs text-slate-800 font-medium">
                  <strong>Date:</strong> ____________________________________
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-800 font-medium mb-1">
                  <strong>For The Company</strong>
                </p>
                <p className="text-xs text-slate-800 font-medium mb-1">
                  <strong>Authorized Signatory:</strong> {data.signatoryName || "_______________________"}
                </p>
                <p className="text-xs text-slate-800 font-medium mb-6">
                  <strong>Designation:</strong> {data.signatoryTitle || "______________________________"}
                </p>
                <p className="text-xs text-slate-800 font-medium mb-1">
                  <strong>Signature:</strong> ________________________________
                </p>
                <p className="text-xs text-slate-800 font-medium">
                  <strong>Date:</strong> ____________________________________
                </p>
              </div>
            </div>
          </div>

          {/* Annexures Section */}
          <div className="mt-12 pt-8 border-t-2 border-slate-900 page-break-before">
            <div className="text-center mb-6">
              <h2 className="text-base font-bold text-slate-950 uppercase tracking-wide border-b border-slate-900 inline-block pb-1">
                Annexures to the Employment Terms &amp; Conditions
              </h2>
              <p className="text-xs text-slate-600 font-normal mt-2 italic">
                The following Annexures form an integral part of the Employment Agreement and are binding upon all employees of The Company. The Company reserves the right to amend these Annexures from time to time by providing appropriate notice to employees.
              </p>
            </div>

            <div className="space-y-6 text-slate-800 text-justify text-xs sm:text-sm">
              
              {/* Annexure A */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                <h3 className="font-bold text-slate-950 text-sm mb-1">Annexure A: Acceptable Use Policy (AUP)</h3>
                <p className="font-semibold text-slate-900 text-xs mb-1">Purpose:</p>
                <p className="mb-2">
                  This policy establishes acceptable standards for the use of Company-owned equipment, software, internet services, communication platforms, and artificial intelligence tools.
                </p>
                
                <p className="font-semibold text-slate-900 text-xs mb-1">Employees shall:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                  <li>Use Company assets solely for legitimate business purposes.</li>
                  <li>Exercise reasonable care in protecting Company devices.</li>
                  <li>Use only licensed and authorized software.</li>
                  <li>Keep passwords confidential and enable Multi-Factor Authentication (MFA) where required.</li>
                  <li>Lock devices whenever left unattended.</li>
                  <li>Immediately report any loss, theft, malware infection, or security incident.</li>
                </ul>

                <p className="font-semibold text-slate-900 text-xs mb-1">Employees shall not:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                  <li>Install unauthorized software.</li>
                  <li>Download pirated or illegal content.</li>
                  <li>Access inappropriate or unlawful websites using Company resources.</li>
                  <li>Disable antivirus or security software.</li>
                  <li>Share Company credentials with any person.</li>
                  <li>Use Company resources for illegal, unethical, or competing business activities.</li>
                </ul>

                <p className="italic text-slate-600 text-xs">
                  The Company reserves the right to monitor usage of Company systems in accordance with applicable law.
                </p>
              </div>

              {/* Annexure B */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                <h3 className="font-bold text-slate-950 text-sm mb-1">
                  Annexure B: Information Security &amp; Data Protection Policy
                </h3>
                <p className="mb-2">Employees shall protect all Company and client information.</p>
                
                <p className="font-semibold text-slate-900 text-xs mb-1">Employees must:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                  <li>Keep client information confidential.</li>
                  <li>Use strong passwords.</li>
                  <li>Enable MFA wherever available.</li>
                  <li>Store Company files only in approved cloud storage or Company-approved systems.</li>
                  <li>Avoid storing confidential data on personal devices unless specifically authorized.</li>
                  <li>Report any suspected data breach immediately.</li>
                </ul>

                <p className="font-semibold text-slate-900 text-xs mb-1">Employees shall not:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                  <li>Share confidential files through personal email accounts.</li>
                  <li>Copy Company databases.</li>
                  <li>Remove confidential information after resignation.</li>
                  <li>Use client information for personal benefit.</li>
                </ul>

                <p className="italic text-slate-600 text-xs">
                  Any data breach resulting from negligence may lead to disciplinary action.
                </p>
              </div>

              {/* Annexure C */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                <h3 className="font-bold text-slate-950 text-sm mb-1">
                  Annexure C: Code of Conduct &amp; Anti-Harassment Policy
                </h3>
                <p className="font-semibold text-slate-900 text-xs mb-1">Every employee shall:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                  <li>Treat colleagues, clients, and vendors with dignity and respect.</li>
                  <li>Maintain professionalism at all times.</li>
                  <li>Avoid discrimination based on gender, religion, disability, race, age, or any legally protected characteristic.</li>
                  <li>Maintain a harassment-free workplace.</li>
                </ul>

                <p className="font-semibold text-slate-900 text-xs mb-1">The following are strictly prohibited:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                  <li>Sexual harassment.</li>
                  <li>Bullying.</li>
                  <li>Threatening behavior.</li>
                  <li>Physical violence.</li>
                  <li>Verbal abuse.</li>
                  <li>Retaliation against whistleblowers.</li>
                </ul>

                <p className="italic text-slate-600 text-xs">
                  Complaints shall be investigated confidentially and appropriate disciplinary action may be taken.
                </p>
              </div>

              {/* Annexure D */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                <h3 className="font-bold text-slate-950 text-sm mb-1">
                  Annexure D: Remote Work Policy
                </h3>
                <p className="font-semibold text-slate-900 text-xs mb-1">Employees approved for remote or hybrid work shall:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                  <li>Be available during official working hours.</li>
                  <li>Attend all scheduled online meetings.</li>
                  <li>Ensure a stable internet connection.</li>
                  <li>Maintain confidentiality while working remotely.</li>
                  <li>Use Company-approved collaboration tools.</li>
                  <li>Secure Company equipment from unauthorized access.</li>
                </ul>
                <p className="italic text-slate-600 text-xs">
                  Management may require employees to return to office whenever business needs require.
                </p>
              </div>

              {/* Annexure E */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                <h3 className="font-bold text-slate-950 text-sm mb-1">
                  Annexure E: Social Media &amp; Public Communication Policy
                </h3>
                <p className="font-semibold text-slate-900 text-xs mb-1">Employees shall not:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                  <li>Publish confidential Company information.</li>
                  <li>Disclose client information.</li>
                  <li>Represent personal opinions as Company opinions.</li>
                  <li>Make defamatory or offensive remarks about clients, colleagues, or the Company.</li>
                </ul>
                <p className="mb-1">
                  Employees may identify themselves as employees of The Company provided such identification does not imply official Company representation.
                </p>
                <p className="italic text-slate-600 text-xs">
                  Only authorized personnel may speak to the media or issue official Company statements.
                </p>
              </div>

              {/* Annexure F */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                <h3 className="font-bold text-slate-950 text-sm mb-1">
                  Annexure F: Equipment Handover &amp; Asset Responsibility Agreement
                </h3>
                <p className="font-semibold text-slate-900 text-xs mb-1">Employees receiving Company equipment agree to:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                  <li>Keep all equipment in good condition.</li>
                  <li>Use equipment responsibly.</li>
                  <li>Return all assets immediately upon resignation or termination.</li>
                </ul>

                <p className="font-semibold text-slate-900 text-xs mb-1">Company assets include, but are not limited to:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 ml-2 mb-2 text-xs">
                  <div>• Laptop/Desktop</div>
                  <div>• Mobile Phone</div>
                  <div>• Monitor</div>
                  <div>• Keyboard &amp; Mouse</div>
                  <div>• Headset</div>
                  <div>• Access Card</div>
                  <div>• SIM Card</div>
                  <div>• Software Licenses</div>
                  <div>• Storage Devices</div>
                  <div>• Documents</div>
                </div>

                <p className="italic text-slate-600 text-xs">
                  Employees may be held financially responsible for loss or intentional damage caused by negligence, subject to applicable law.
                </p>
              </div>

              {/* Annexure G */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                <h3 className="font-bold text-slate-950 text-sm mb-1">
                  Annexure G: Performance Management &amp; Performance Improvement Plan (PIP)
                </h3>
                <p className="font-semibold text-slate-900 text-xs mb-1">Performance shall be reviewed periodically based on:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                  <li>Key Performance Indicators (KPIs)</li>
                  <li>Quality of work</li>
                  <li>Productivity</li>
                  <li>Attendance</li>
                  <li>Professional behaviour</li>
                  <li>Teamwork</li>
                  <li>Client satisfaction</li>
                  <li>Initiative and continuous improvement</li>
                </ul>

                <p className="font-semibold text-slate-900 text-xs mb-1">
                  Where performance falls below expected standards, the Company may initiate a Performance Improvement Plan (PIP), which may include:
                </p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                  <li>Clearly defined performance objectives</li>
                  <li>Coaching and mentoring</li>
                  <li>Regular progress reviews</li>
                  <li>A specified improvement period</li>
                </ul>

                <p className="italic text-slate-600 text-xs">
                  Failure to achieve satisfactory improvement may result in further disciplinary action, including termination where appropriate.
                </p>
              </div>

              {/* Annexure H */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                <h3 className="font-bold text-slate-950 text-sm mb-1">
                  Annexure H: Leave Policy
                </h3>
                <p className="mb-2">
                  Employees shall be entitled to leave as provided under the Company's Leave Policy and applicable labour laws.
                </p>

                <p className="font-semibold text-slate-900 text-xs mb-1">The Company currently recognizes the following leave categories:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 ml-2 mb-2 text-xs">
                  <div>• Annual Leave</div>
                  <div>• Sick/Medical Leave</div>
                  <div>• Carry Forward from Annual Leave</div>
                  <div>• Maternity Leave</div>
                  <div>• Paternity Leave</div>
                  <div>• Pilgrimage leave</div>
                  <div className="col-span-2">• Leave Without Pay (LWP)</div>
                </div>

                <p className="font-semibold text-slate-900 text-xs mb-1">General Leave Rules:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2 mb-2">
                  <li>Leave must be applied for through the Company's approved leave management system.</li>
                  <li>Except in emergencies, leave should be approved before being taken.</li>
                  <li>Medical leave exceeding the Company's prescribed limit may require a registered medical certificate.</li>
                  <li>Unused leave shall be governed by the Company's leave encashment or carry-forward policy.</li>
                  <li>Unauthorized absence may be treated as misconduct and may result in salary deductions or disciplinary action.</li>
                </ul>

                <p className="italic text-slate-600 text-xs">
                  The Company reserves the right to revise leave entitlements and procedures in accordance with operational requirements and applicable laws.
                </p>
              </div>

            </div>

            <p className="mt-6 text-center text-xs font-medium text-slate-700 italic">
              These Annexures form an integral part of the Employment Agreement and all employees are required to read, understand, and comply with them. Any violation may result in disciplinary action in accordance with Company policy and applicable laws.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400">
          <span>TriloyTech — Terms &amp; Conditions of Employment &amp; Annexures</span>
          <span>Official Document</span>
        </div>
      </div>
    </div>
  );
};
