// provider/auth.provider.tsx
'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Session } from '@/lib/session';
import Loading from '@/components/ui/loading';

const AuthContext = createContext<{
  session: Session | null;
  isLoading: boolean;
}>({
  session: null,
  isLoading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

// Loading component with attractive animation
const AuthLoading = () => (
  <Loading size='lg' text='Preparing your dashboard...' fullScreen={true} />
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setSession(data.session);
        } else {
          console.error('Failed to fetch session:', response.statusText);
          setError('Failed to fetch session');
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setError('Network error while fetching session');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  // Show loading while fetching session
  if (isLoading) {
    return <AuthLoading />;
  }

  // Show error if there's an error and no session
  if (error && !session) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-red-600 mb-2'>
            Authentication Error
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
