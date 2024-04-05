"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const initialUser: User | null = null;

/* eslint-disable @typescript-eslint/no-empty-function */
const UserContext = createContext<UserContextType>({
  user: initialUser,
  setUser: () => {} // Placeholder function
});
/* eslint-enable @typescript-eslint/no-empty-function */

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

const UseUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, UseUserContext };