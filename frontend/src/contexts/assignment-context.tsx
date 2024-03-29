"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { Assignment } from "../../../backend/assignment-service/src/models/types/assignment";

interface IAssignmentContext {
  assignment: Assignment | null;
  isNewlyCreated: boolean;
  enableAddingQuestion: (assignment: Assignment) => void;
  disableAddingQuestion: () => void;
}

const AssignmentContext = createContext<IAssignmentContext>({
  assignment: null,
  isNewlyCreated: false,
  enableAddingQuestion: () => {
    throw new Error("Not implemented");
  },
  disableAddingQuestion: () => {
    throw new Error("Not implemented");
  },
});

const useAssignmentContext = () => useContext(AssignmentContext);

function AssignmentProvider({ children }: { children: ReactNode }) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isNewlyCreated, setIsNewlyCreated] = useState(false);

  const enableAddingQuestion = (assignment: Assignment) => {
    setAssignment(assignment);
    setIsNewlyCreated(true);
  };

  const disableAddingQuestion = () => {
    setIsNewlyCreated(false);
  };

  return (
    <AssignmentContext.Provider
      value={{
        assignment,
        isNewlyCreated,
        enableAddingQuestion,
        disableAddingQuestion,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
}

export { AssignmentProvider, useAssignmentContext };
