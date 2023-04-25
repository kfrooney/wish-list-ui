import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getAuth, User } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase-config";

type FirebaseAuthContextState = { user: User | null };

const FirebaseAuthContext =
  createContext<FirebaseAuthContextState | undefined>(undefined);

function FirebaseAuthProvider({ children }: { children: ReactNode}) {
  const [user, setUser] = useState<User|null>(null);
  const value = { user };
  const app = initializeApp(firebaseConfig);
  useEffect(() => {
    const auth = getAuth(app);
    return auth.onAuthStateChanged(setUser);
  }, [app]);

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error(
      "useFirebaseAuth must be used within a FirebaseAuthProvider"
    );
  }
  return context.user;
}
export { useFirebaseAuth, FirebaseAuthProvider };