import { StrippedDownMentee } from "@/types/mentee";

/**
 * Converts mentee data to CSV format
 * @param mentees Array of mentees to convert
 * @returns CSV formatted string
 */
export const menteesToCSV = (mentees: StrippedDownMentee[]): string => {
  // Define the CSV headers
  const headers = ['Name', 'Email', 'Phone', 'Preferred Slot', 'Creation Date'];
  
  // Convert each mentee to CSV row
  const rows = mentees.map(mentee => {
    // Format creation timestamp if available
    const creationDate = mentee.creationTs
      ? new Date(mentee.creationTs).toLocaleDateString()
      : 'N/A';
    
    return [
      mentee.name,
      mentee.email,
      mentee.phone,
      mentee.preferredSlot,
      creationDate
    ]
    // Escape any fields with commas by wrapping in quotes
    .map(field => {
      if (typeof field === 'string' && (field.includes(',') || field.includes('"'))) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    })
    .join(',');
  });
  
  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
};

/**
 * Triggers a download of a CSV file
 * @param csv CSV content
 * @param filename Name of the file to download
 */
export const downloadCSV = (csv: string, filename: string) => {
  // Create a blob from the CSV string
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  
  // Append the link to the body
  document.body.appendChild(link);
  
  // Trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 