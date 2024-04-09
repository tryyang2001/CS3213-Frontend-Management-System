"use client";

import Cookies from "js-cookie";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  fetchUserFromCookie: () => void;
}

const initialUser: User = {
  uid: 0,
  email: "",
  name: "",
  major: "",
  course: "",
  role: "",
};

const UserContext = createContext<UserContextType>({
  user: initialUser,
  setUser: () => {
    throw new Error("Not implemented");
  },
  fetchUserFromCookie: () => {
    throw new Error("Not implemented");
  },
});

const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(initialUser);

  const fetchUserFromCookie = () => {
    const user = Cookies.get("user");

    if (user) {
      setUser(JSON.parse(user) as User);
    }
  };

  useEffect(() => {
    fetchUserFromCookie();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserFromCookie }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, useUserContext };
