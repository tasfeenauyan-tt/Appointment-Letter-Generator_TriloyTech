import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle
} from "docx";
import { saveAs } from "file-saver";
import { AppointmentLetterData } from "../types";
import { formatGrossSalaryBDT } from "./numberToWords";

export async function generateAppointmentDocx(
  data: AppointmentLetterData,
  overrideIncludeTerms?: boolean
): Promise<void> {
  const shouldIncludeTerms = overrideIncludeTerms !== undefined ? overrideIncludeTerms : data.includeTermsPage;

  const { formattedNumber, words } = formatGrossSalaryBDT(data.grossSalary);
  const displaySalary = formattedNumber || data.grossSalary;
  const salaryText = words ? `BDT ${displaySalary} (${words})` : `BDT ${displaySalary}`;

  const salutationName = `${data.salutation} ${data.employeeFullName}`.trim();

  // Split address into lines if multi-line
  const addressLines = (data.fullAddress || "").split("\n").filter(Boolean);

  const docChildren: Paragraph[] = [];

  // Company Header if letterhead is active
  if (data.includeLetterhead) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: data.companyName.toUpperCase(),
            bold: true,
            size: 28, // 14pt
            color: "0F172A",
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: data.companyAddress,
            size: 18, // 9pt
            color: "475569",
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: data.companyContact,
            size: 18, // 9pt
            color: "475569",
            font: "Arial"
          })
        ]
      }),
      // Divider Line
      new Paragraph({
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 12,
            color: "2563EB"
          }
        },
        spacing: { after: 160 }
      })
    );
  }

  // PRIVATE & CONFIDENTIAL (Left aligned on top of Date)
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "PRIVATE & CONFIDENTIAL",
          bold: true,
          size: 20, // 10pt
          color: "1E293B",
          font: "Arial"
        })
      ]
    })
  );

  // Date
  docChildren.push(
    new Paragraph({
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: `Date: ${data.letterIssueDate}`,
          bold: true,
          size: 20, // 10pt
          font: "Arial"
        })
      ]
    })
  );

  // To Address
  docChildren.push(
    new Paragraph({
      spacing: { after: 20 },
      children: [
        new TextRun({
          text: "To:",
          bold: true,
          size: 20,
          font: "Arial"
        })
      ]
    }),
    new Paragraph({
      spacing: { after: 20 },
      children: [
        new TextRun({
          text: salutationName,
          bold: true,
          size: 20,
          font: "Arial"
        })
      ]
    })
  );

  addressLines.forEach((line) => {
    docChildren.push(
      new Paragraph({
        spacing: { after: 20 },
        children: [
          new TextRun({
            text: line,
            size: 20,
            font: "Arial"
          })
        ]
      })
    );
  });

  // Subject
  docChildren.push(
    new Paragraph({
      spacing: { before: 160, after: 160 },
      children: [
        new TextRun({
          text: "Subject: ",
          bold: true,
          size: 20,
          font: "Arial"
        }),
        new TextRun({
          text: "Appointment Letter",
          bold: true,
          underline: {},
          size: 20,
          font: "Arial"
        })
      ]
    })
  );

  // Dear Mr./Ms. Name,
  docChildren.push(
    new Paragraph({
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: `Dear ${salutationName},`,
          bold: true,
          size: 20,
          font: "Arial"
        })
      ]
    })
  );

  // Paragraph 1: Appointment statement
  docChildren.push(
    new Paragraph({
      spacing: { line: 360, after: 120 },
      children: [
        new TextRun({
          text: `We are pleased to appoint you as an `,
          size: 20,
          font: "Arial"
        }),
        new TextRun({
          text: data.positionName,
          bold: true,
          size: 20,
          font: "Arial"
        }),
        new TextRun({
          text: ` under the `,
          size: 20,
          font: "Arial"
        }),
        new TextRun({
          text: data.divisionName,
          bold: true,
          size: 20,
          font: "Arial"
        }),
        new TextRun({
          text: ` of TriloyTech, effective from `,
          size: 20,
          font: "Arial"
        }),
        new TextRun({
          text: data.effectiveDate,
          bold: true,
          size: 20,
          font: "Arial"
        }),
        new TextRun({
          text: `.`,
          size: 20,
          font: "Arial"
        })
      ]
    })
  );

  // Paragraph 2: Gross salary statement
  docChildren.push(
    new Paragraph({
      spacing: { line: 360, after: 120 },
      children: [
        new TextRun({
          text: `Your monthly gross salary will be `,
          size: 20,
          font: "Arial"
        }),
        new TextRun({
          text: salaryText,
          bold: true,
          size: 20,
          font: "Arial"
        }),
        new TextRun({
          text: `, payable in accordance with the Company's payroll policies.`,
          size: 20,
          font: "Arial"
        })
      ]
    })
  );

  // Paragraph 3: Employment subject to terms & conditions
  docChildren.push(
    new Paragraph({
      spacing: { line: 360, after: 120 },
      children: [
        new TextRun({
          text: `Your employment is subject to the attached Terms and Conditions of Employment, which form an integral part of this Appointment Letter. By accepting this appointment, you agree to comply with the Company's policies, rules, and procedures, as amended from time to time.`,
          size: 20,
          font: "Arial"
        })
      ]
    })
  );

  // Paragraph 4: Revisions
  docChildren.push(
    new Paragraph({
      spacing: { line: 360, after: 120 },
      children: [
        new TextRun({
          text: `The Company reserves the right to revise your duties, reporting structure, or employment terms in accordance with business requirements and applicable laws.`,
          size: 20,
          font: "Arial"
        })
      ]
    })
  );

  // Paragraph 5: Closing wish
  docChildren.push(
    new Paragraph({
      spacing: { line: 360, after: 160 },
      children: [
        new TextRun({
          text: `We look forward to a successful business relationship with you now and in coming days and wish you all the very best from the Management of TriloyTech.`,
          size: 20,
          font: "Arial"
        })
      ]
    })
  );

  // Best Regards
  docChildren.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "Best Regards,",
          size: 20,
          font: "Arial"
        })
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: data.signatoryName,
          bold: true,
          size: 20,
          font: "Arial"
        })
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: data.signatoryTitle,
          size: 20,
          color: "475569",
          font: "Arial"
        })
      ]
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: data.companyName,
          bold: true,
          size: 20,
          font: "Arial"
        })
      ]
    })
  );

  // Enclosures
  if (data.enclosures && data.enclosures.length > 0) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 100 },
        children: [
          new TextRun({
            text: "Enclosure:",
            bold: true,
            size: 19,
            font: "Arial"
          })
        ]
      })
    );

    data.enclosures.forEach((enc) => {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `·   ${enc}`,
              size: 19,
              font: "Arial"
            })
          ]
        })
      );
    });
  }

  // Copy to
  if (data.copyTo && data.copyTo.length > 0) {
    docChildren.push(
      new Paragraph({
        spacing: { before: 140 },
        children: [
          new TextRun({
            text: "Copy to:",
            bold: true,
            size: 19,
            font: "Arial"
          })
        ]
      })
    );

    data.copyTo.forEach((cp) => {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `·   ${cp}`,
              size: 19,
              font: "Arial"
            })
          ]
        })
      );
    });
  }

  // Annexure: Terms and Conditions page if enabled
  if (shouldIncludeTerms) {
    const makeHeading = (title: string) =>
      new Paragraph({
        spacing: { before: 160, after: 60 },
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 20,
            font: "Arial"
          })
        ]
      });

    const makeSubheading = (title: string) =>
      new Paragraph({
        spacing: { before: 100, after: 40 },
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 19,
            font: "Arial"
          })
        ]
      });

    const makePara = (text: string, italic = false) =>
      new Paragraph({
        spacing: { line: 360, after: 80 },
        children: [
          new TextRun({
            text: text,
            italics: italic,
            size: 19,
            font: "Arial"
          })
        ]
      });

    const makeBullet = (text: string) =>
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: text,
            size: 19,
            font: "Arial"
          })
        ]
      });

    // Header & Title
    if (data.includeLetterhead) {
      docChildren.push(
        new Paragraph({
          pageBreakBefore: true,
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: (data.companyName || "TriloyTech").toUpperCase(),
              bold: true,
              size: 26,
              font: "Arial"
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: "Annexure I: Terms and Conditions of Employment",
              size: 19,
              color: "64748B",
              font: "Arial"
            })
          ]
        })
      );
    } else {
      docChildren.push(
        new Paragraph({
          pageBreakBefore: true
        })
      );
    }

    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "TERMS AND CONDITIONS OF EMPLOYMENT",
            bold: true,
            size: 24,
            font: "Arial",
            underline: {}
          })
        ]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: `The following Terms and Conditions form an integral part of your employment with TriloyTech. For the purposes of these Terms and Conditions, "the Company" means TriloyTech, including its successors, assigns, affiliates, subsidiaries (where applicable), and any entity operating under the TriloyTech brand.`,
            italics: true,
            size: 19,
            font: "Arial"
          })
        ]
      })
    );

    // Clause 1
    docChildren.push(
      makeHeading("1. Remuneration"),
      makePara("You shall receive remuneration in accordance with the salary and benefits specified in the Appointment Letter and/or the applicable Compensation Structure issued by the Company."),
      makePara("The Employee's remuneration may comprise various components, including but not limited to Basic Salary, House Rent Allowance, Medical Allowance, Conveyance Allowance, and any other allowances or benefits as determined by the Company from time to time."),
      makePara("The composition of the remuneration package may be revised, restructured, or adjusted by the Company from time to time in accordance with applicable laws, statutory requirements, and the Company's compensation policies, provided that such changes do not reduce the Employee's agreed Gross Salary unless otherwise mutually agreed or permitted by law."),
      makePara("The Company may structure the remuneration package in a manner that optimizes statutory compliance and provides the maximum lawful tax efficiency available to the Employee under the prevailing laws of Bangladesh.")
    );

    // Clause 2
    docChildren.push(
      makeHeading("2. Leave Fare Assistance (LFA)"),
      makePara("You may be eligible for Leave Fare Assistance (LFA) in accordance with the Company's compensation policy. The eligibility criteria, amount, frequency of payment, and applicable terms shall be determined by the Company and may be revised from time to time.")
    );

    // Clause 3
    docChildren.push(
      makeHeading("3. Probationary Period"),
      makePara("You will remain on probation for a period of three (3) months from your date of joining."),
      makePara("During the probationary period, either party may terminate the employment by providing twenty-four (24) hours' written notice or payment in lieu thereof, unless otherwise required under applicable law."),
      makePara("The Company may extend the probationary period where performance is found to be unsatisfactory, provided that such extension is communicated in writing."),
      makePara("Confirmation of employment shall become effective only upon issuance of a written confirmation letter by the Company.")
    );

    // Clause 4
    docChildren.push(
      makeHeading("4. Festival Bonus"),
      makePara("You shall be eligible for a maximum of two (2) Festival Bonuses in a calendar year, corresponding to the Company's designated major religious festivals."),
      makePara("Each Festival Bonus shall be equivalent to one (1) month's Basic Salary, subject to:"),
      makeBullet("Successful completion of probation (unless otherwise approved by management);"),
      makeBullet("The Company's Festival Bonus Policy; and"),
      makeBullet("Pro-rata calculation based on your joining date during your first year of employment.")
    );

    // Clause 5
    docChildren.push(
      makeHeading("5. Performance Bonus"),
      makePara("You may be eligible for a Performance Bonus subject to:"),
      makeBullet("Individual performance;"),
      makeBullet("Achievement of agreed Key Performance Indicators (KPIs);"),
      makeBullet("Departmental and Company performance; and"),
      makeBullet("The Company's financial performance."),
      makePara("The Company reserves the sole discretion to determine the amount, timing, eligibility, and payment of any Performance Bonus. Unless otherwise approved, bonus payments shall be calculated on a pro-rata basis where applicable.")
    );

    // Clause 6
    docChildren.push(
      makeHeading("6. Provident Fund"),
      makePara("The Company may introduce a Provident Fund Scheme in accordance with applicable laws and its internal policies. Participation, eligibility, contribution rates, and related terms shall be governed by the Company's Provident Fund Rules, as adopted and amended from time to time.")
    );

    // Clause 7
    docChildren.push(
      makeHeading("7. Gratuity"),
      makePara("The Company does not currently operate a Gratuity Scheme. However, the Company may introduce such a scheme in the future, subject to applicable laws of Bangladesh and its internal policies. Any gratuity benefit, if introduced, shall be governed by the Company's Gratuity Policy, including the applicable eligibility criteria, calculation methodology, and payment terms.")
    );

    // Clause 8
    docChildren.push(
      makeHeading("8. Leave Entitlement"),
      makePara("Unless otherwise revised by Company policy, you shall be entitled to the following annual leave benefits:"),
      makeBullet("Annual Leave: 26 (Twenty-Six) working days per calendar year."),
      makeBullet("Medical/Sick Leave: 14 (Fourteen) working days per calendar year."),
      makePara("Any additional leave categories shall be governed by the Company's Leave Policy."),
      makePara("The leave year shall run from 1 January to 31 December."),
      makePara("All leave must be applied for, approved, and utilized in accordance with the Company's Leave Policy.")
    );

    // Clause 9
    docChildren.push(
      makeHeading("9. Official Travel"),
      makePara("Where official duties require travel, such travel shall be governed by the Company's Travel Policy. All travel-related expenses and reimbursements shall be subject to prior approval and Company policy.")
    );

    // Clause 10
    docChildren.push(
      makeHeading("10. Retirement"),
      makePara("Unless otherwise amended by law or Company policy, the normal retirement age shall be 57 (Fifty-Seven) years.")
    );

    // Clause 11
    docChildren.push(
      makeHeading("11. Working Hours"),
      makeSubheading("For full time:"),
      makePara("Your normal working schedule shall be 8.5 (Eight and a Half) hours per working day, inclusive of a 30-minute lunch break."),
      makePara("The Company's standard working days are Saturday through Thursday."),
      makePara("The Company may introduce flexible working hours, hybrid work arrangements, or revised schedules based on operational requirements."),
      makePara("Employees are expected to remain available during designated Core Office Hours, as communicated by the Company."),
      makeSubheading("For part time:"),
      makePara("As a Part-Time Employee, your working hours shall be as specified in your Appointment Letter or as otherwise communicated by the Company from time to time. Your work schedule may vary depending on operational requirements and business needs."),
      makePara("Unless otherwise agreed in writing, you are expected to work only during your assigned working hours and to remain available during the agreed working period on your scheduled workdays."),
      makePara("The Company's standard working days are Saturday through Thursday. However, depending on the nature of your role and business requirements, your scheduled working days and hours may differ."),
      makePara("The Company may introduce flexible working hours, hybrid work arrangements, remote work arrangements, or revised schedules based on operational requirements. Any changes to your assigned schedule will be communicated in advance whenever reasonably practicable.")
    );

    // Clause 12
    docChildren.push(
      makeHeading("12. Duty Station"),
      makePara("Your initial duty station shall be Dhaka, Bangladesh."),
      makePara("However, the Company reserves the right to transfer, assign, or temporarily relocate you to any of its offices, project sites, client locations, or other work locations within or outside Bangladesh based on business requirements.")
    );

    // Clause 13
    docChildren.push(
      makeHeading("13. Income Tax"),
      makePara("Income Tax, where applicable, shall be deducted at source from your salary in accordance with the prevailing laws of Bangladesh and remitted to the appropriate government authority.")
    );

    // Clause 14
    docChildren.push(
      makeHeading("14. Confidentiality and Conflict of Interest"),
      makePara("During your employment and after its termination, you shall maintain strict confidentiality regarding all confidential information relating to the Company's business, operations, clients, suppliers, employees, technology, pricing, strategies, financial information, and intellectual property."),
      makePara("You shall not disclose such information to any third party without prior written authorization from the Company."),
      makePara("You shall not engage in any employment, consultancy, freelancing, partnership, or business activity that creates a conflict of interest with the Company unless prior written approval has been obtained."),
      makePara("Any breach of confidentiality or conflict of interest may result in disciplinary action, including termination of employment and legal proceedings where applicable.")
    );

    // Clause 15
    docChildren.push(
      makeHeading("15. Compliance with Company Policies"),
      makePara("You agree to comply with:"),
      makeBullet("All Company rules, policies, and procedures;"),
      makeBullet("The Employee Handbook;"),
      makeBullet("Information Security policies;"),
      makeBullet("Code of Conduct;"),
      makeBullet("Any future policies issued by the Company.")
    );

    // Clause 16
    docChildren.push(
      makeHeading("16. Amendment of Terms"),
      makePara("The Company reserves the right to amend, revise, modify, or replace any employment terms, compensation structures, policies, benefits, or rules whenever deemed necessary for business or legal reasons."),
      makePara("Any such amendment shall become effective upon notification to employees.")
    );

    // Clause 17
    docChildren.push(
      makeHeading("17. Resignation and Termination"),
      makePara("Either party may terminate this employment by providing one (1) month's written notice or payment in lieu of notice equivalent to one (1) month's Basic Salary, unless otherwise required under applicable law."),
      makePara("The Company reserves the right to terminate employment without notice or compensation where dismissal is justified under the Bangladesh Labour Act, including but not limited to:"),
      makeBullet("Gross misconduct;"),
      makeBullet("Fraud;"),
      makeBullet("Theft;"),
      makeBullet("Serious negligence;"),
      makeBullet("Insubordination;"),
      makeBullet("Breach of confidentiality;"),
      makeBullet("Violation of Company policies; or"),
      makeBullet("Any other act warranting summary dismissal under applicable law.")
    );

    // Clause 18
    docChildren.push(
      makeHeading("18. Full and Final Settlement"),
      makePara("Upon cessation of employment for any reason:"),
      makeBullet("All outstanding Company property, including but not limited to laptops, computers, mobile devices, access cards, documents, software, confidential information, files, records, and other assets, must be returned immediately."),
      makeBullet("Any amount owed by you to the Company may be adjusted against your final settlement."),
      makeBullet("Any remaining outstanding balance shall remain payable by you."),
      makePara("Final settlement shall be processed only after successful completion of all clearance formalities.")
    );

    // Clause 19
    docChildren.push(
      makeHeading("19. Intellectual Property"),
      makePara("All inventions, discoveries, developments, designs, software, source code, documentation, databases, websites, graphics, marketing materials, creative works, business processes, reports, methodologies, trade secrets, and any other work product conceived, created, developed, or contributed by you, whether individually or jointly with others, during the course of your employment and relating to the Company's business shall be the exclusive property of The Company."),
      makePara("You hereby assign to the Company all rights, title, and interest, including intellectual property rights, in such work products. You shall execute any documents and provide all reasonable assistance required by the Company to establish, protect, or enforce such rights."),
      makePara("You shall not copy, reproduce, distribute, publish, sell, license, or use any Company intellectual property for personal or third-party purposes without prior written authorization from the Company.")
    );

    // Clause 20
    docChildren.push(
      makeHeading("20. Non-Solicitation"),
      makePara("During your employment and for a period of twelve (12) months following the termination of your employment, you shall not, directly or indirectly:"),
      makeBullet("Solicit or attempt to solicit any employee or contractor of the Company for employment or engagement elsewhere;"),
      makeBullet("Solicit, induce, or encourage any client, customer, supplier, or business partner to terminate or reduce their business relationship with the Company;"),
      makeBullet("Use confidential Company information for the purpose of competing with or causing loss to the Company."),
      makePara("This clause shall be interpreted only to the extent permitted under the applicable laws of Bangladesh.")
    );

    // Clause 21
    docChildren.push(
      makeHeading("21. Remote Work / Hybrid Work"),
      makePara("Where approved by the Company, employees may work remotely or under a hybrid working arrangement."),
      makePara("Employees working remotely shall:"),
      makeBullet("Maintain official working hours unless otherwise approved;"),
      makeBullet("Remain available during designated Core Office Hours;"),
      makeBullet("Ensure reliable internet connectivity and a suitable working environment;"),
      makeBullet("Protect Company assets, confidential information, and client data;"),
      makeBullet("Follow all cybersecurity, information security, and data protection policies;"),
      makeBullet("Attend office, client meetings, or Company events whenever required by management."),
      makePara("The Company reserves the right to modify, suspend, or withdraw any remote or hybrid work arrangement at its sole discretion based on operational requirements.")
    );

    // Clause 22
    docChildren.push(
      makeHeading("22. Disciplinary Procedures"),
      makePara("Employees are expected to maintain the highest standards of professionalism, integrity, and conduct."),
      makePara("Violation of Company policies, misconduct, negligence, unauthorized absence, insubordination, misuse of Company assets, breach of confidentiality, harassment, discrimination, fraud, or any unlawful act may result in disciplinary action."),
      makePara("Depending on the nature and severity of the misconduct, disciplinary measures may include:"),
      makeBullet("Verbal warning;"),
      makeBullet("Written warning;"),
      makeBullet("Performance Improvement Plan (PIP);"),
      makeBullet("Suspension with or without pay, where permitted by law;"),
      makeBullet("Demotion or reassignment;"),
      makeBullet("Recovery of losses, where legally permissible; or"),
      makeBullet("Termination of employment."),
      makePara("The Company shall conduct disciplinary proceedings in accordance with applicable laws and principles of natural justice where required.")
    );

    // Clause 23
    docChildren.push(
      makeHeading("23. Force Majeure"),
      makePara("The Company shall not be liable for any delay, interruption, or failure to fulfil its obligations arising from events beyond its reasonable control, including but not limited to:"),
      makeBullet("Natural disasters;"),
      makeBullet("Floods;"),
      makeBullet("Earthquakes;"),
      makeBullet("Fires;"),
      makeBullet("Epidemics or pandemics;"),
      makeBullet("Government restrictions;"),
      makeBullet("Political unrest;"),
      makeBullet("War;"),
      makeBullet("Terrorism;"),
      makeBullet("Nationwide internet or utility failures;"),
      makeBullet("Industrial disputes; or"),
      makeBullet("Any other event constituting Force Majeure."),
      makePara("Where such events materially affect business operations, the Company may temporarily suspend operations, revise working arrangements, require remote working where feasible, grant unpaid leave, where permitted by law, or take any other reasonable measures necessary to protect its employees and business operations.")
    );

    // Clause 24
    docChildren.push(
      makeHeading("24. Protection of Personal Data"),
      makePara("For employment administration purposes, the Company shall collect, process, store, and maintain personal information relating to you."),
      makePara("Such information shall be used solely for legitimate employment, legal, administrative, payroll, statutory, and business purposes and shall be treated with reasonable confidentiality."),
      makePara("You are responsible for informing the Human Resources Department of any changes to your personal information to ensure Company records remain accurate and up to date.")
    );

    // Clause 25
    docChildren.push(
      makeHeading("25. Governing Law"),
      makePara("These Terms and Conditions shall be governed by and construed in accordance with the laws of the People's Republic of Bangladesh, including the Bangladesh Labour Act, 2006 (as amended) and other applicable laws and regulations.")
    );

    // Clause 26
    docChildren.push(
      makeHeading("26. Acceptance"),
      makePara("By signing the Employment Offer Letter and/or Employment Agreement, you acknowledge that you have read, understood, and accepted these Terms and Conditions of Employment and agree to comply with all Company policies, procedures, and applicable laws throughout your employment with The Company.")
    );

    // Employee Acknowledgement & Signatures
    docChildren.push(
      makeHeading("Employee Acknowledgement"),
      makePara("I hereby acknowledge that I have carefully read, understood, and accepted the above Terms and Conditions of Employment. I agree to comply with all Company policies, procedures, and applicable laws throughout my employment with The Company."),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `Employee Name: ${data.employeeFullName || "___________________________"}`,
            bold: true,
            size: 19,
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: "Signature: ________________________________    Date: ____________________",
            size: 19,
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        spacing: { before: 140, after: 80 },
        children: [
          new TextRun({
            text: "For The Company",
            bold: true,
            size: 19,
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: `Authorized Signatory: ${data.signatoryName || "_______________________"}`,
            size: 19,
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: `Designation: ${data.signatoryTitle || "______________________________"}`,
            size: 19,
            font: "Arial"
          })
        ]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Signature: ________________________________    Date: ____________________",
            size: 19,
            font: "Arial"
          })
        ]
      })
    );

    // Annexures Section
    docChildren.push(
      new Paragraph({
        pageBreakBefore: true,
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "Annexures to the Employment Terms & Conditions",
            bold: true,
            size: 24,
            font: "Arial",
            underline: {}
          })
        ]
      }),
      makePara(
        "The following Annexures form an integral part of the Employment Agreement and are binding upon all employees of The Company. The Company reserves the right to amend these Annexures from time to time by providing appropriate notice to employees.",
        true
      )
    );

    // Annexure A
    docChildren.push(
      makeHeading("Annexure A: Acceptable Use Policy (AUP)"),
      makeSubheading("Purpose:"),
      makePara("This policy establishes acceptable standards for the use of Company-owned equipment, software, internet services, communication platforms, and artificial intelligence tools."),
      makeSubheading("Employees shall:"),
      makeBullet("Use Company assets solely for legitimate business purposes."),
      makeBullet("Exercise reasonable care in protecting Company devices."),
      makeBullet("Use only licensed and authorized software."),
      makeBullet("Keep passwords confidential and enable Multi-Factor Authentication (MFA) where required."),
      makeBullet("Lock devices whenever left unattended."),
      makeBullet("Immediately report any loss, theft, malware infection, or security incident."),
      makeSubheading("Employees shall not:"),
      makeBullet("Install unauthorized software."),
      makeBullet("Download pirated or illegal content."),
      makeBullet("Access inappropriate or unlawful websites using Company resources."),
      makeBullet("Disable antivirus or security software."),
      makeBullet("Share Company credentials with any person."),
      makeBullet("Use Company resources for illegal, unethical, or competing business activities."),
      makePara("The Company reserves the right to monitor usage of Company systems in accordance with applicable law.", true)
    );

    // Annexure B
    docChildren.push(
      makeHeading("Annexure B: Information Security & Data Protection Policy"),
      makePara("Employees shall protect all Company and client information."),
      makeSubheading("Employees must:"),
      makeBullet("Keep client information confidential."),
      makeBullet("Use strong passwords."),
      makeBullet("Enable MFA wherever available."),
      makeBullet("Store Company files only in approved cloud storage or Company-approved systems."),
      makeBullet("Avoid storing confidential data on personal devices unless specifically authorized."),
      makeBullet("Report any suspected data breach immediately."),
      makeSubheading("Employees shall not:"),
      makeBullet("Share confidential files through personal email accounts."),
      makeBullet("Copy Company databases."),
      makeBullet("Remove confidential information after resignation."),
      makeBullet("Use client information for personal benefit."),
      makePara("Any data breach resulting from negligence may lead to disciplinary action.", true)
    );

    // Annexure C
    docChildren.push(
      makeHeading("Annexure C: Code of Conduct & Anti-Harassment Policy"),
      makeSubheading("Every employee shall:"),
      makeBullet("Treat colleagues, clients, and vendors with dignity and respect."),
      makeBullet("Maintain professionalism at all times."),
      makeBullet("Avoid discrimination based on gender, religion, disability, race, age, or any legally protected characteristic."),
      makeBullet("Maintain a harassment-free workplace."),
      makeSubheading("The following are strictly prohibited:"),
      makeBullet("Sexual harassment."),
      makeBullet("Bullying."),
      makeBullet("Threatening behavior."),
      makeBullet("Physical violence."),
      makeBullet("Verbal abuse."),
      makeBullet("Retaliation against whistleblowers."),
      makePara("Complaints shall be investigated confidentially and appropriate disciplinary action may be taken.", true)
    );

    // Annexure D
    docChildren.push(
      makeHeading("Annexure D: Remote Work Policy"),
      makeSubheading("Employees approved for remote or hybrid work shall:"),
      makeBullet("Be available during official working hours."),
      makeBullet("Attend all scheduled online meetings."),
      makeBullet("Ensure a stable internet connection."),
      makeBullet("Maintain confidentiality while working remotely."),
      makeBullet("Use Company-approved collaboration tools."),
      makeBullet("Secure Company equipment from unauthorized access."),
      makePara("Management may require employees to return to office whenever business needs require.", true)
    );

    // Annexure E
    docChildren.push(
      makeHeading("Annexure E: Social Media & Public Communication Policy"),
      makeSubheading("Employees shall not:"),
      makeBullet("Publish confidential Company information."),
      makeBullet("Disclose client information."),
      makeBullet("Represent personal opinions as Company opinions."),
      makeBullet("Make defamatory or offensive remarks about clients, colleagues, or the Company."),
      makePara("Employees may identify themselves as employees of The Company provided such identification does not imply official Company representation."),
      makePara("Only authorized personnel may speak to the media or issue official Company statements.", true)
    );

    // Annexure F
    docChildren.push(
      makeHeading("Annexure F: Equipment Handover & Asset Responsibility Agreement"),
      makeSubheading("Employees receiving Company equipment agree to:"),
      makeBullet("Keep all equipment in good condition."),
      makeBullet("Use equipment responsibly."),
      makeBullet("Return all assets immediately upon resignation or termination."),
      makeSubheading("Company assets include, but are not limited to:"),
      makeBullet("Laptop/Desktop"),
      makeBullet("Mobile Phone"),
      makeBullet("Monitor"),
      makeBullet("Keyboard & Mouse"),
      makeBullet("Headset"),
      makeBullet("Access Card"),
      makeBullet("SIM Card"),
      makeBullet("Software Licenses"),
      makeBullet("Storage Devices"),
      makeBullet("Documents"),
      makePara("Employees may be held financially responsible for loss or intentional damage caused by negligence, subject to applicable law.", true)
    );

    // Annexure G
    docChildren.push(
      makeHeading("Annexure G: Performance Management & Performance Improvement Plan (PIP)"),
      makeSubheading("Performance shall be reviewed periodically based on:"),
      makeBullet("Key Performance Indicators (KPIs)"),
      makeBullet("Quality of work"),
      makeBullet("Productivity"),
      makeBullet("Attendance"),
      makeBullet("Professional behaviour"),
      makeBullet("Teamwork"),
      makeBullet("Client satisfaction"),
      makeBullet("Initiative and continuous improvement"),
      makeSubheading("Where performance falls below expected standards, the Company may initiate a Performance Improvement Plan (PIP), which may include:"),
      makeBullet("Clearly defined performance objectives"),
      makeBullet("Coaching and mentoring"),
      makeBullet("Regular progress reviews"),
      makeBullet("A specified improvement period"),
      makePara("Failure to achieve satisfactory improvement may result in further disciplinary action, including termination where appropriate.", true)
    );

    // Annexure H
    docChildren.push(
      makeHeading("Annexure H: Leave Policy"),
      makePara("Employees shall be entitled to leave as provided under the Company's Leave Policy and applicable labour laws."),
      makeSubheading("The Company currently recognizes the following leave categories:"),
      makeBullet("Annual Leave"),
      makeBullet("Sick/Medical Leave"),
      makeBullet("Carry Forward from Annual Leave"),
      makeBullet("Maternity Leave"),
      makeBullet("Paternity Leave"),
      makeBullet("Pilgrimage leave"),
      makeBullet("Leave Without Pay (LWP)"),
      makeSubheading("General Leave Rules:"),
      makeBullet("Leave must be applied for through the Company's approved leave management system."),
      makeBullet("Except in emergencies, leave should be approved before being taken."),
      makeBullet("Medical leave exceeding the Company's prescribed limit may require a registered medical certificate."),
      makeBullet("Unused leave shall be governed by the Company's leave encashment or carry-forward policy."),
      makeBullet("Unauthorized absence may be treated as misconduct and may result in salary deductions or disciplinary action."),
      makePara("The Company reserves the right to revise leave entitlements and procedures in accordance with operational requirements and applicable laws.", true)
    );

    // Final Closing Note
    docChildren.push(
      new Paragraph({
        spacing: { before: 200, after: 120 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "These Annexures form an integral part of the Employment Agreement and all employees are required to read, understand, and comply with them. Any violation may result in disciplinary action in accordance with Company policy and applicable laws.",
            italics: true,
            bold: true,
            size: 19,
            font: "Arial"
          })
        ]
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 864,    // 0.6 in (allows fit on 1 A4 page)
              bottom: 864, // 0.6 in
              left: 1080,  // 0.75 in
              right: 1080  // 0.75 in
            }
          }
        },
        children: docChildren
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const nameForFile = (data.employeeFullName || "Employee").replace(/\s+/g, "_");
  const suffix = shouldIncludeTerms ? "With_Terms" : "Letter_Only";
  const cleanFilename = `Appointment_Letter_${nameForFile}_${suffix}_TriloyTech.docx`;
  saveAs(blob, cleanFilename);
}
