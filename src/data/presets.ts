import { AppointmentLetterData, PresetProfile } from "../types";
import { getFutureDateFormatted, getTodayFormatted } from "../utils/dateFormatter";

export function getBlankLetterData(): AppointmentLetterData {
  return {
    letterIssueDate: getTodayFormatted(),
    salutation: "Mr.",
    employeeFullName: "",
    fullAddress: "",
    positionName: "",
    divisionName: "",
    effectiveDate: getFutureDateFormatted(7),
    grossSalary: "",
    salaryInWords: "",
    
    signatoryName: "Tasfeen Auyan",
    signatoryTitle: "Director – Human Resources",
    companyName: "TriloyTech",
    
    includeLetterhead: false,
    companyAddress: "Level 8, TriloyTech Tower, 42 Kemal Ataturk Avenue, Banani, Dhaka-1213",
    companyContact: "Email: hr@triloytech.com | Web: www.triloytech.com | Tel: +880 2 9876543",
    includeDigitalSignature: true,
    
    enclosures: [
      "Terms and Conditions of Employment"
    ],
    copyTo: [
      "Sales & Business Development Division",
      "Finance & Accounts Division"
    ],
    
    includeTermsPage: true,
    probationPeriodMonths: 6,
    noticePeriodDays: 30
  };
}

export function getDefaultLetterData(): AppointmentLetterData {
  return {
    letterIssueDate: getTodayFormatted(),
    salutation: "Mr.",
    employeeFullName: "Rahim Ahmed",
    fullAddress: "House 14, Road 7, Block D, Banani, Dhaka-1213, Bangladesh",
    positionName: "Executive",
    divisionName: "Sales & Business Development Division",
    effectiveDate: getFutureDateFormatted(7),
    grossSalary: "50,000",
    salaryInWords: "Fifty Thousand Taka Only",
    
    signatoryName: "Tasfeen Auyan",
    signatoryTitle: "Director – Human Resources",
    companyName: "TriloyTech",
    
    includeLetterhead: false,
    companyAddress: "Level 8, TriloyTech Tower, 42 Kemal Ataturk Avenue, Banani, Dhaka-1213",
    companyContact: "Email: hr@triloytech.com | Web: www.triloytech.com | Tel: +880 2 9876543",
    includeDigitalSignature: true,
    
    enclosures: [
      "Terms and Conditions of Employment"
    ],
    copyTo: [
      "Sales & Business Development Division",
      "Finance & Accounts Division"
    ],
    
    includeTermsPage: true,
    probationPeriodMonths: 6,
    noticePeriodDays: 30
  };
}

export const DEFAULT_LETTER_DATA: AppointmentLetterData = getDefaultLetterData();

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: "sample-rahim",
    label: "Sample: Rahim Ahmed (Default)",
    data: {
      salutation: "Mr.",
      employeeFullName: "Rahim Ahmed",
      fullAddress: "House 14, Road 7, Block D, Banani, Dhaka-1213, Bangladesh",
      positionName: "Executive",
      divisionName: "Sales & Business Development Division",
      grossSalary: "50,000",
      salaryInWords: "Fifty Thousand Taka Only",
      copyTo: ["Sales & Business Development Division", "Finance & Accounts Division"]
    }
  },
  {
    id: "sales-exec",
    label: "Sales Executive",
    data: {
      positionName: "Executive",
      divisionName: "Sales & Business Development Division",
      grossSalary: "50,000",
      copyTo: ["Sales & Business Development Division", "Finance & Accounts Division"]
    }
  },
  {
    id: "sr-dev",
    label: "Senior Software Engineer",
    data: {
      positionName: "Senior Software Engineer",
      divisionName: "Engineering & Technology Division",
      grossSalary: "1,20,000",
      copyTo: ["Engineering & Technology Division", "Finance & Accounts Division"]
    }
  },
  {
    id: "marketing-lead",
    label: "Marketing Manager",
    data: {
      positionName: "Assistant Marketing Manager",
      divisionName: "Brand & Marketing Division",
      grossSalary: "85,000",
      copyTo: ["Brand & Marketing Division", "Finance & Accounts Division"]
    }
  },
  {
    id: "hr-officer",
    label: "HR & Operations Officer",
    data: {
      positionName: "Executive – HR & People Operations",
      divisionName: "Human Resources Division",
      grossSalary: "60,000",
      copyTo: ["Human Resources Division", "Finance & Accounts Division"]
    }
  }
];
