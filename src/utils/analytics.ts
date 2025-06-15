// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Predefined event trackers for common actions
export const analytics = {
  // User authentication events
  trackSignUp: () => trackEvent('sign_up', 'auth'),
  trackLogin: () => trackEvent('login', 'auth'),
  trackLogout: () => trackEvent('logout', 'auth'),

  // Blog interaction events
  trackBlogView: (blogTitle: string) => trackEvent('blog_view', 'content', blogTitle),
  trackBlogSearch: (searchTerm: string) => trackEvent('search', 'content', searchTerm),

  // AI chat events
  trackAIChatStart: (blogId: string) => trackEvent('ai_chat_start', 'ai_interaction', blogId),
  trackAIChatMessage: () => trackEvent('ai_chat_message', 'ai_interaction'),

  // Navigation events
  trackNavigationClick: (destination: string) => trackEvent('navigation_click', 'navigation', destination),

  // Feature usage
  trackFeatureUse: (feature: string) => trackEvent('feature_use', 'engagement', feature),
}; 