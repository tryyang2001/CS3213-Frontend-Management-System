import AssignmentService from "@/helpers/assignment-service/api-wrapper";
import { Metadata, ResolvingMetadata } from "next";

type PageProps = {
  params: {
    id: string;
  };
};

export default function AssignmentPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div>{children}</div>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
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
