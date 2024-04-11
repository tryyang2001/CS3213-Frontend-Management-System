"use client";

import AssignmentEditor from "@/components/assignment/create/AssignmentEditor";
import { Spacer } from "@nextui-org/react";

export default function Create() {
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
