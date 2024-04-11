"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface UserContextType {
  user: User | null;
  setUserContext: (user: User | null) => void;
}
const initialUser: User | null = null;

const UserContext = createContext<UserContextType>({
  user: null,
  setUserContext: () => {
    throw new Error("Not implemented");
  },
});

function UserProvider({ children }: { children: ReactNode }) {
  const getLocalState = () : User | null => {
    if (typeof window !== "undefined") {
      const localUserContext = localStorage.getItem("userContext");
      if (localUserContext) {
        return JSON.parse(localUserContext) as User;
      }
    }
    return initialUser;
  };

  const [user, setUser] = useState<User | null>(getLocalState() ?? initialUser);

  const setUserContext = (user: User | null) => {
    setUser(user);
  };

  useEffect(() => {
    localStorage.setItem("userContext", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
}
const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUserContext };
