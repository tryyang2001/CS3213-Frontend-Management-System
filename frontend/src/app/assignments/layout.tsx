import { AssignmentProvider } from "@/contexts/assignment-context";

export default function AssignmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AssignmentProvider>{children}</AssignmentProvider>
    </div>
  );
}
