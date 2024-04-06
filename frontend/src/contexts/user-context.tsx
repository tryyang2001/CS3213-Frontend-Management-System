"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface UserContextType {
  user: User | null;
  setUserContext: (user: User | null) => void;
}

const initialUser: User | null = null;

const UserContext = createContext<UserContextType>({
  user: initialUser,
  setUserContext: () => {
    throw new Error("Not implemented");
  }
});

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const setUserContext = (user: User | null) => {
    setUser(user);
  }

  return (
    <UserContext.Provider value={{ user, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
}

const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUserContext };