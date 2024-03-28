import db from "../../models/db";

const deleteAssignmentById = async (id: string) => {
  const assignmentExists = await db.assignment.findUnique({
    where: {
      id: id,
    },
  });

  if (!assignmentExists) {
    return null;
  }

  const assignment = await db.assignment.delete({
    where: {
      id: id,
    },
  });

  return assignment;
};

export const DeleteHandler = {
  deleteAssignmentById,
};
