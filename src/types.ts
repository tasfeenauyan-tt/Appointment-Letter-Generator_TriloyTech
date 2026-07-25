export interface AppointmentLetterData {
  id?: string;
  createdAt?: string;
  
  // Input fields requested by user
  letterIssueDate: string; // "DD Month YYYY"
  salutation: string; // "Mr.", "Ms.", "Dr."
  employeeFullName: string;
  fullAddress: string;
  positionName: string;
  divisionName: string;
  effectiveDate: string; // "DD Month YYYY"
  grossSalary: string; // e.g., "65,000" or "65000"
  salaryInWords?: string; // e.g. "(Sixty-Five Thousand Taka Only)"
  
  // Customization & Options
  signatoryName: string;
  signatoryTitle: string;
  companyName: string;
  
  // Layout & Branding
  includeLetterhead: boolean;
  companyAddress: string;
  companyContact: string;
  includeDigitalSignature: boolean;
  signatureImage?: string;
  companyLogoUrl?: string;

  // Enclosures & Copies
  enclosures: string[];
  copyTo: string[];
  
  // Terms and conditions inclusion
  includeTermsPage: boolean;
  probationPeriodMonths: number;
  noticePeriodDays: number;
}

export interface PresetProfile {
  id: string;
  label: string;
  data: Partial<AppointmentLetterData>;
}
