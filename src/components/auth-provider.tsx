import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkAuth } from '@/lib/local-auth';
import { RootState } from '@/store';
import { setUser, setToken, logout } from '@/store/slices/auth';
import { ROUTES } from '@/lib/constants';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  checkingAuth: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  isLoading: false,
  checkingAuth: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, token, isLoading } = useSelector((state: RootState) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function validateSession() {
      if (token) {
        const isValid = await checkAuth();
        if (!isValid) {
          dispatch(logout());
          navigate(ROUTES.LOGIN, { state: { from: location.pathname } });
        }
      }
      setCheckingAuth(false);
    }

    validateSession();
  }, [token, dispatch, navigate, location]);

  const value = {
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    isLoading,
    checkingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}