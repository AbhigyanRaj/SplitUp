import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../../services/analytics';

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when location changes
    const pageName = location.pathname === '/' ? 'Home' : location.pathname.slice(1);
    analytics.trackPageView(pageName);
  }, [location]);

  return null; // This component doesn't render anything
};

export default PageTracker; 