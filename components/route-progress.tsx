"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

export function RouteProgress() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Create event handlers for route change events
    const handleRouteChangeStart = () => {
      NProgress.start();
    };
    
    const handleRouteChangeComplete = () => {
      NProgress.done();
    };
    
    // Add custom event listeners for route changes
    window.addEventListener('routeChangeStart', handleRouteChangeStart);
    window.addEventListener('routeChangeComplete', handleRouteChangeComplete);
    
    // Cleanup function
    return () => {
      window.removeEventListener('routeChangeStart', handleRouteChangeStart);
      window.removeEventListener('routeChangeComplete', handleRouteChangeComplete);
      NProgress.done();
    };
  }, []);
  
  // When pathname changes, trigger route change complete
  useEffect(() => {
    // This will hide the progress bar when the route has fully loaded
    NProgress.done();
    
    // Dispatch a custom event when a link is clicked
    const handleLinkClick = () => {
      window.dispatchEvent(new Event('routeChangeStart'));
    };
    
    // Add click event listeners to all navigation links
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });
    
    return () => {
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, [pathname]);
  
  return null;
} 