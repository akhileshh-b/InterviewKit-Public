import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/utils/analytics';
import { isAdminEmail } from '@/utils/adminConfig';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Starting auth callback handling');
        console.log('Current URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        
        // Handle hash-based OAuth redirects (Google OAuth and email verification)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        console.log('Hash params:', {
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          error,
          errorDescription
        });

        // Check for OAuth errors first
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          toast({
            title: "Authentication failed",
            description: errorDescription || error,
            variant: "destructive",
          });
          navigate('/login');
          return;
        }
        
        if (accessToken) {
          console.log('Setting session with tokens...');
          // Set the session from the hash parameters
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          console.log('setSession result:', { data: data ? 'present' : 'missing', error });
          
          if (error) {
            console.error('Auth callback error:', error);
            toast({
              title: "Authentication failed",
              description: error.message,
              variant: "destructive",
            });
            navigate('/login');
            return;
          }

          if (data.session && data.user) {
            console.log('Session established successfully:', {
              userId: data.user.id,
              email: data.user.email
            });
            
            // Track successful login
            analytics.trackLogin();
            
            const userEmail = data.session.user.email;
            
            toast({
              title: "Welcome!",
              description: "Successfully signed in with Google.",
            });

            // Clear the hash from URL
            window.history.replaceState({}, document.title, window.location.pathname);

            // Small delay to ensure session is properly set
            setTimeout(() => {
              // Redirect based on admin status
              if (userEmail && isAdminEmail(userEmail)) {
                console.log('Redirecting to admin portal');
                navigate('/admin');
              } else {
                console.log('Redirecting to user portal');
                navigate('/user');
              }
            }, 100);
            return;
          } else {
            console.error('No session or user data after setSession');
            toast({
              title: "Authentication failed",
              description: "Failed to establish session. Please try again.",
              variant: "destructive",
            });
            navigate('/login');
            return;
          }
        }

        // Fallback: Check for existing session (for regular callback flow)
        console.log('No access token in hash, checking existing session...');
        const { data, error } = await supabase.auth.getSession();
        
        console.log('getSession result:', { data: data ? 'present' : 'missing', error });
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Authentication failed",
            description: error.message,
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        if (data.session) {
          console.log('Existing session found:', {
            userId: data.session.user.id,
            email: data.session.user.email
          });
          
          // Track successful login
          analytics.trackLogin();
          
          const userEmail = data.session.user.email;
          
          toast({
            title: "Welcome!",
            description: "Successfully signed in.",
          });

          // Redirect based on admin status
          if (userEmail && isAdminEmail(userEmail)) {
            console.log('Redirecting to admin portal');
            navigate('/admin');
          } else {
            console.log('Redirecting to user portal');
            navigate('/user');
          }
        } else {
          console.log('No session found, redirecting to login');
          navigate('/login');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        toast({
          title: "Authentication failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 