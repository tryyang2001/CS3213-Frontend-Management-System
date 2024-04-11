"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface IAssignmentContext {
  assignment: Assignment | null;
  isNewlyCreated: boolean;
  isEditing: boolean;
  enableAddingQuestion: (assignment: Assignment) => void;
  disableAddingQuestion: () => void;
  enableEditing: (assignment: Assignment) => void;
  disableEditing: () => void;
}

const AssignmentContext = createContext<IAssignmentContext>({
  assignment: null,
  isNewlyCreated: false,
  isEditing: false,
  enableAddingQuestion: () => {
    throw new Error("Not implemented");
  },
  disableAddingQuestion: () => {
    throw new Error("Not implemented");
  },
  enableEditing: () => {
    throw new Error("Not implemented");
  },
  disableEditing: () => {
    throw new Error("Not implemented");
  },
});

const useAssignmentContext = () => useContext(AssignmentContext);

function AssignmentProvider({ children }: { children: ReactNode }) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isNewlyCreated, setIsNewlyCreated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const enableAddingQuestion = (assignment: Assignment) => {
    setAssignment(assignment);
    setIsNewlyCreated(true);
  };

  const disableAddingQuestion = () => {
    setIsNewlyCreated(false);
  };

  const enableEditing = (assignment: Assignment) => {
    setAssignment(assignment);
    setIsEditing(true);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  return (
    <AssignmentContext.Provider
      value={{
        assignment,
        isNewlyCreated,
        isEditing,
        enableAddingQuestion,
        disableAddingQuestion,
        enableEditing,
        disableEditing,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
}

export { AssignmentProvider, useAssignmentContext };
