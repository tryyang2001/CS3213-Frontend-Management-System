import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Intelligent Tutoring System",
  description: "Accelerate code assessment.",
};

export default function AssignmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
