"use client";

import AssignmentCreator from "@/components/forms/AssignmentCreator";

export default function Create() {
  return (
    <div className="columns-auto items-center p-12">
      <h1 className="font-bold text-4xl text-center">Assignment Creation</h1>
      <AssignmentCreator />
    </div>
  );
}
