"use client";

import AssignmentEditor from "@/components/assignment/create/AssignmentEditor";
import { useUserContext } from "@/contexts/user-context";
import { Spacer } from "@nextui-org/react";
import { notFound } from "next/navigation";

export default function Create() {
  const { user } = useUserContext();

  if (!user || user.role !== "tutor") {
    return notFound();
  }

  return (
    <div className="h-screen">
      <b>Create a new assignment</b>
      <Spacer y={4} />

      <div className="my-[5%]">
        <AssignmentEditor />
      </div>
    </div>
  );
}
