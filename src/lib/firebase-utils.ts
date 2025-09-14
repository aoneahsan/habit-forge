/**
 * Removes undefined values from an object recursively
 * Firestore doesn't accept undefined values, so we need to clean them
 */
export function cleanForFirestore<T extends Record<string, any>>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanForFirestore) as any;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const cleaned: any = {};
    
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null) {
          cleaned[key] = cleanForFirestore(value);
        } else {
          cleaned[key] = value;
        }
      }
    });
    
    return cleaned;
  }

  return obj;
}

/**
 * Converts Firestore timestamp to Date
 */
export function timestampToDate(timestamp: any): Date {
  if (!timestamp) return new Date();
  
  // If it's already a Date, return it
  if (timestamp instanceof Date) return timestamp;
  
  // If it has a toDate method (Firestore Timestamp), use it
  if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // If it has seconds property (Firestore Timestamp plain object), convert it
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  
  // Try to parse as string or number
  return new Date(timestamp);
}