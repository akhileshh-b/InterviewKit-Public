// Public repository version - Analytics configuration placeholder
// In the actual implementation, this would come from environment variables

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const ANALYTICS_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

export const initializeAnalytics = () => {
  if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
    console.warn('Google Analytics not configured. Set VITE_GA_MEASUREMENT_ID environment variable.');
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', ANALYTICS_ID);

  // Make gtag available globally
  (window as any).gtag = gtag;
}; 