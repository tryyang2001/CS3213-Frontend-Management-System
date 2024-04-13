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

const mockQuestions: Question[] = [1, 2].map((num) => {
  return {
    id: num.toString(),
    title: "Question " + num,
    description: "description " + num,
    deadline: 0,
    numberOfTestCases: 0,
    createdOn: 0,
  } as Question;
});

export const mockAssignment: Assignment = {
  id: "1",
  title: "Assignment 1",
  deadline: 0,
  isPublished: false,
  numberOfQuestions: mockQuestions.length,
  questions: mockQuestions,
  authors: [],
  createdOn: 0,
  updatedOn: 0,
};
