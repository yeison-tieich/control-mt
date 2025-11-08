/**
 * Parses a date string that might be in a non-standard format (like DD/MM/YYYY)
 * into a valid Date object.
 * @param dateString The date string to parse.
 * @returns A Date object, or null if the string is invalid.
 */
export const parseDate = (dateString: string | undefined | null): Date | null => {
  if (!dateString) {
    return null;
  }

  // First, try to parse it directly, as it might be in a valid ISO format
  const directDate = new Date(dateString);
  if (!isNaN(directDate.getTime())) {
    return directDate;
  }

  // Handle formats like "DD/MM/YYYY HH:mm:ss" or "DD-MM-YYYY"
  const parts = dateString.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (parts) {
    // parts[1] is day, parts[2] is month, parts[3] is year
    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10);
    const year = parseInt(parts[3], 10);
    
    // Check for time part as well
    const timeParts = dateString.match(/(\d{2}):(\d{2}):(\d{2})/);
    if (timeParts) {
        const hours = parseInt(timeParts[1], 10);
        const minutes = parseInt(timeParts[2], 10);
        const seconds = parseInt(timeParts[3], 10);
        // JS month is 0-indexed, so we subtract 1
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    // JS month is 0-indexed
    return new Date(year, month - 1, day);
  }

  // Return null if no valid format is found
  console.warn(`Could not parse date: ${dateString}`);
  return null;
};
