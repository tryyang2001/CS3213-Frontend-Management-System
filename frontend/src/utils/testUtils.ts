import { Dispatch, SetStateAction } from "react";

interface State<T> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
}

/**
 * Do not deconstruct the output!
 *
 * @param s the initial value
 *
 * @return the state object including the value and the function setValue
 */
export const useTestState = <T>(s: T): State<T> => {
  const output: State<T> = {
    value: s,
    setValue: () => s,
  };
  const setValue: Dispatch<SetStateAction<T>> = (s: SetStateAction<T>) =>
    (output.value = s instanceof Function ? s(output.value) : s);

  output.setValue = setValue;
  return output;
};

export const mockUserInfo: UserInfo = {
  email: "email@email.com",
  name: "Abc",
  bio: "Hello!",
};

export const mockUser: User = {
  uid: 3,
  role: "Student",
};

export const mockErrorInfo: UserInfo = {
  email: "bad@email.com",
  name: "Abc",
  bio: "Hello!",
};
