// Security utility functions for privacy protection
import { initializeNetworkObfuscation, monitorNetworkActivity } from './networkObfuscation';

export const initializeSecurity = () => {
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable common keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Disable F12 (Developer Tools)
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    
    // Disable Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    
    // Disable Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    
    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      return false;
    }
    
    // Disable Ctrl+S (Save As)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      return false;
    }
    
    // Disable Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }
  });

  // Disable text selection for images
  document.addEventListener('selectstart', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });

  // Disable drag for all images
  document.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });

  // Console warning
  if (typeof console !== 'undefined') {
    console.clear();
    console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cThis is a browser feature intended for developers. Content on this page is protected by copyright. Unauthorized access or copying is prohibited.', 'color: red; font-size: 16px;');
  }

  // Detect developer tools (basic detection)
  let devtools = false;
  const threshold = 160;
  
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools) {
        devtools = true;
        console.clear();
        console.log('%cDeveloper tools detected. Please respect content privacy.', 'color: red; font-size: 20px;');
      }
    } else {
      devtools = false;
    }
  }, 500);

  // Initialize network obfuscation
  initializeNetworkObfuscation();
  
  // Monitor network activity for suspicious behavior
  monitorNetworkActivity();
};

// Function to protect specific elements
export const protectElement = (element: HTMLElement) => {
  element.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
  
  element.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });
  
  element.style.userSelect = 'none';
  (element.style as any).webkitUserSelect = 'none';
  (element.style as any).mozUserSelect = 'none';
  (element.style as any).msUserSelect = 'none';
}; 