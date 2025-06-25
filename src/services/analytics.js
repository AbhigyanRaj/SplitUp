// Analytics service for tracking user interactions
export const analytics = {
  // Track page views
  trackPageView: (pageName) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
      });
    }
  },

  // Track custom events
  trackEvent: (eventName, parameters = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  },

  // Track button clicks
  trackButtonClick: (buttonName, pageName) => {
    analytics.trackEvent('button_click', {
      button_name: buttonName,
      page_name: pageName,
    });
  },

  // Track form submissions
  trackFormSubmission: (formName, pageName) => {
    analytics.trackEvent('form_submit', {
      form_name: formName,
      page_name: pageName,
    });
  },

  // Track user engagement
  trackEngagement: (action, details = {}) => {
    analytics.trackEvent('user_engagement', {
      action: action,
      ...details,
    });
  },
};

// Custom hook for analytics
export const useAnalytics = () => {
  return analytics;
}; 