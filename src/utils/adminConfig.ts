// Public repository version - Admin configuration placeholder
// In the actual implementation, these would be loaded from environment variables

export const getAdminEmails = (): string[] => {
  // Placeholder admin emails for public repository
  // In production, these would come from environment variables
  return [
    'admin@example.com',
    'support@example.com'
  ];
};

export const isAdminEmail = (email: string): boolean => {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
};

export const getAdminConfig = () => {
  return {
    emails: getAdminEmails(),
    isProduction: false, // Always false for public repository
    features: {
      adminPanel: false,
      userManagement: false,
      analytics: false
    }
  };
}; 