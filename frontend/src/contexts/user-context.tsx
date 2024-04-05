"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface IUserContext {
  user: User | null;
}

const UserContext = createContext<IUserContext>({
  user: null,
});

const useUserContext = () => useContext(UserContext);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider
      value={{user}}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, useUserContext };