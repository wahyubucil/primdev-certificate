import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';

/**
 * Ref: https://usehooks.com/useAuth/
 */

interface AuthProvider {
  user: User | null | false;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const authContext = createContext<AuthProvider | undefined>(undefined);

export const ProvideAuth: FC = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  const auth = useContext(authContext);
  if (!auth)
    throw new Error('Please wrap parent component with `ProvideAuth` first!');
  return auth;
};

function useProvideAuth(): AuthProvider {
  const auth = getAuth();
  const [user, setUser] = useState<User | null | false>(null);

  const login = async (email: string, password: string) => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    setUser(response.user);
    return response.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, login, logout };
}
