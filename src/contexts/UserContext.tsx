import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, UserState } from '@/types/user';

type UserAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

const initialState: UserState = {
  user: null,
  isLoading: true,
  error: null,
};

const UserContext = createContext<{
  state: UserState;
  getPatientName: () => string;
  dispatch: React.Dispatch<UserAction>;
} | null>(null);

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');
        const response = await fetch(`${backendUrl}/auth/me`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'SET_USER', payload: data });
        } else {
          console.error('Auth check failed:', response.status, response.statusText);
          dispatch({ type: 'CLEAR_USER' });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  // Listen for 401 unauthorized events from the axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch({ type: 'CLEAR_USER' });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const getPatientName = () => {
    return state.user?.firstName || '';
  };

  return (
    <UserContext.Provider value={{ state, dispatch, getPatientName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 