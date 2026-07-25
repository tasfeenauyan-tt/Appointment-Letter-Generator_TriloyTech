/**
 * Converts a numerical salary figure into English words for BDT currency.
 * e.g., 65000 -> "Sixty-Five Thousand Taka Only"
 */

const units = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];

const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

function convertLessThanThousand(n: number): string {
  if (n === 0) return "";
  if (n < 20) return units[n];
  if (n < 100) {
    const ten = Math.floor(n / 10);
    const remainder = n % 10;
    return tens[ten] + (remainder > 0 ? "-" + units[remainder] : "");
  }
  const hundred = Math.floor(n / 100);
  const remainder = n % 100;
  return units[hundred] + " Hundred" + (remainder > 0 ? " " + convertLessThanThousand(remainder) : "");
}

export function numberToBDTWords(rawAmount: string | number): string {
  if (!rawAmount) return "";
  
  // Clean string by removing commas, BDT symbols, whitespace
  const sanitized = String(rawAmount).replace(/[^0-9.]/g, "");
  const amount = parseFloat(sanitized);
  
  if (isNaN(amount) || amount <= 0) return "";
  
  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);
  
  if (integerPart === 0) return "Zero Taka Only";
  
  // South Asian Numbering System (Crore, Lakh, Thousand, Hundred)
  let num = integerPart;
  let words = "";
  
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  
  const hundredAndBelow = num;
  
  if (crore > 0) {
    words += convertLessThanThousand(crore) + " Crore ";
  }
  if (lakh > 0) {
    words += convertLessThanThousand(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    words += convertLessThanThousand(thousand) + " Thousand ";
  }
  if (hundredAndBelow > 0) {
    words += convertLessThanThousand(hundredAndBelow) + " ";
  }
  
  words = words.trim() + " Taka";
  
  if (decimalPart > 0) {
    words += " and " + convertLessThanThousand(decimalPart) + " Poisha";
  }
  
  return words + " Only";
}

export function formatGrossSalaryBDT(rawAmount: string): { formattedNumber: string; words: string } {
  if (!rawAmount) return { formattedNumber: "", words: "" };
  
  // Extract digits
  const sanitized = String(rawAmount).replace(/[^0-9]/g, "");
  if (!sanitized) return { formattedNumber: rawAmount, words: "" };
  
  const num = parseInt(sanitized, 10);
  if (isNaN(num)) return { formattedNumber: rawAmount, words: "" };
  
  // Format with standard commas (e.g. 65,000)
  const formattedNumber = num.toLocaleString('en-IN');
  const words = numberToBDTWords(num);
  
  return { formattedNumber, words };
}
