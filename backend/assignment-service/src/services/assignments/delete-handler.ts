import db from "../../models/db";

const deleteAssignmentById = async (id: string) => {
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
