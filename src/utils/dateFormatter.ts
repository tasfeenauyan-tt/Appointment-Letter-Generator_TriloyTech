/**
 * Formats date input string (YYYY-MM-DD or standard date text) into "DD Month YYYY"
 * Example: "2026-07-25" -> "25 July 2026"
 */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function formatDateToDDMonthYYYY(inputDate: string): string {
  if (!inputDate) return "";

  // If already matches DD Month YYYY or custom string (e.g. "25 July 2026"), check
  if (/^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/.test(inputDate.trim())) {
    return inputDate.trim();
  }

  // Check if it's YYYY-MM-DD
  const dateObj = new Date(inputDate);
  if (!isNaN(dateObj.getTime())) {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = MONTH_NAMES[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  }

  return inputDate;
}

export function getTodayFormatted(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[today.getMonth()];
  const year = today.getFullYear();
  return `${day} ${month} ${year}`;
}

export function getFutureDateFormatted(daysFromNow: number): string {
  const future = new Date();
  future.setDate(future.getDate() + daysFromNow);
  const day = String(future.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[future.getMonth()];
  const year = future.getFullYear();
  return `${day} ${month} ${year}`;
}
