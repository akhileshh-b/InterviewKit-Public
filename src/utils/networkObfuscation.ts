// Network obfuscation utility to confuse network tab monitoring
export const initializeNetworkObfuscation = () => {
  // Generate fake image requests to confuse network monitoring
  const generateFakeRequests = () => {
    // Use real placeholder services to avoid network errors
    const realPlaceholderServices = [
      'https://picsum.photos/100/100',
      'https://via.placeholder.com/100x100',
      'https://dummyimage.com/100x100',
      'https://placeholder.com/100x100'
    ];

    // Create requests to real placeholder services (they'll return actual images)
    realPlaceholderServices.forEach((serviceUrl, index) => {
      setTimeout(() => {
        // Make request to real service - this will succeed but still create network noise
        fetch(`${serviceUrl}?t=${Date.now()}&r=${Math.random()}`, { 
          mode: 'no-cors',
          cache: 'no-cache'
        }).catch(() => {
          // Still catch any potential errors
        });
      }, Math.random() * 2000 + 500);
    });
  };

  // Generate fake requests periodically
  generateFakeRequests();
  
  // Set up interval for ongoing obfuscation - reduce frequency to avoid too many requests
  const interval = setInterval(generateFakeRequests, 60000 + Math.random() * 60000);
  
  return () => clearInterval(interval);
};

// Create fake blob URLs to further confuse network analysis
export const generateFakeBlobUrls = (): string[] => {
  const fakeBlobs: string[] = [];
  
  for (let i = 0; i < 5; i++) {
    // Create fake image data
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Fill with random colors
      ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
      ctx.fillRect(0, 0, 100, 100);
      
      // Convert to blob URL
      canvas.toBlob((blob) => {
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          fakeBlobs.push(blobUrl);
        }
      });
    }
  }
  
  return fakeBlobs;
};

// Obfuscate actual image requests by mixing with fake ones
export const obfuscatedImageLoad = async (actualImageSrc: string): Promise<string> => {
  // Generate fake requests first
  generateFakeBlobUrls();
  
  // Add random delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
  
  // Load actual image
  return actualImageSrc;
};

// Monitor network tab and take defensive actions
export const monitorNetworkActivity = () => {
  // Override fetch to detect monitoring attempts
  const originalFetch = window.fetch;
  let suspiciousActivity = 0;
  
  window.fetch = function(...args) {
    // Check if someone is making unusual requests (potential monitoring)
    const url = args[0]?.toString() || '';
    
    if (url.includes('akhilesh') || url.includes('photo') || url.includes('image')) {
      suspiciousActivity++;
      
      // Increase threshold to reduce false positives
      if (suspiciousActivity > 10) {
        console.warn('Suspicious network activity detected. Content protection activated.');
        // Reset counter to avoid spam
        suspiciousActivity = 0;
      }
    }
    
    return originalFetch.apply(this, args);
  };
};

// Clean up blob URLs to prevent memory leaks
export const cleanupBlobUrls = (urls: string[]) => {
  urls.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
}; 