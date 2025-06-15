import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/utils/analytics';
import { isAdminEmail } from '@/utils/adminConfig';

const AuthCallbackDebug = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('=== AUTH CALLBACK DEBUG START ===');
      console.log('URL:', window.location.href);
      console.log('Hash:', window.location.hash);
      console.log('Search params:', window.location.search);
      
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        console.log('Current session check:', { data: !!data?.session, error });
        
        if (error) {
          console.error('Session error:', error);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        if (data?.session) {
          console.log('Session found:', {
            userId: data.session.user.id,
            email: data.session.user.email,
            provider: data.session.user.app_metadata?.provider
          });
          
          // Track successful login
          analytics.trackLogin();
          
          const userEmail = data.session.user.email;
          
          toast({
            title: "Welcome!",
            description: "Successfully signed in with Google.",
          });

          // Small delay to ensure session is properly set in context
          setTimeout(() => {
            if (userEmail && isAdminEmail(userEmail)) {
              console.log('Redirecting to admin portal');
              navigate('/admin');
            } else {
              console.log('Redirecting to user portal');
              navigate('/user');
            }
          }, 500);
        } else {
          console.log('No session found, checking URL parameters...');
          
          // Check for hash parameters (OAuth response)
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const errorParam = hashParams.get('error');
          
          console.log('Hash params:', {
            accessToken: !!accessToken,
            refreshToken: !!refreshToken,
            error: errorParam
          });
          
          if (errorParam) {
            console.error('OAuth error:', errorParam);
            toast({
              title: "Authentication failed",
              description: hashParams.get('error_description') || errorParam,
              variant: "destructive",
            });
            navigate('/login');
            return;
          }
          
          if (accessToken) {
            console.log('Setting session from hash params...');
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (sessionError) {
              console.error('Error setting session:', sessionError);
              toast({
                title: "Authentication failed",
                description: sessionError.message,
                variant: "destructive",
              });
              navigate('/login');
              return;
            }
            
            if (sessionData?.session) {
              console.log('Session set successfully');
              // Clear hash from URL
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // Reload to trigger auth state change
              window.location.reload();
              return;
            }
          }
          
          console.log('No valid session or tokens found, redirecting to login');
          navigate('/login');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred during authentication.",
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
        <p className="text-slate-600">Processing authentication...</p>
        <p className="text-sm text-slate-500 mt-2">Please wait while we sign you in</p>
      </div>
    </div>
  );
};

export default AuthCallbackDebug; 