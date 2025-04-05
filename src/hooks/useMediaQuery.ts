'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook that tells you whether a given media query is active.
 * Useful for conditionally rendering components based on viewport size.
 * 
 * @param query CSS media query to match
 * @returns Boolean indicating if the media query matches
 * 
 * @example
 * // Use in a component
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * 
 * if (isMobile) {
 *   // Render mobile view
 * } else {
 *   // Render desktop view
 * }
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Check if we are in the browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    // Create the media query list
    const media = window.matchMedia(query);
    
    // Set the initial value
    setMatches(media.matches);
    
    // Define the listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add listener to changes
    media.addEventListener('change', listener);
    
    // Clean up on unmount
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);
  
  return matches;
} 