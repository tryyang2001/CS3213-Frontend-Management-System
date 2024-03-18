import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
  params: {
    id: string
  };
};

export default function AssignmentPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div>{children}</div>;
}

<<<<<<< HEAD:frontend/src/app/(pages)/assignments/[id]/layout.tsx
export const generateMetadata = async ({ params }: Props) => {
=======
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
>>>>>>> master:frontend/src/app/assignments/[id]/layout.tsx
  const assignmentTitle = (
    await AssignmentService.getAssignmentById({
      assignmentId: params.id,
    })
  ).title;

  const metadata: Metadata = {
    title: assignmentTitle,
    description: `Assignment page for ${assignmentTitle}`,
  };

  return metadata;
}
