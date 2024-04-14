import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/components/common/Providers";
import SideBar from "@/components/common/SideBar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intelligent Tutoring System",
  description: "Accelerate code assessment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className={inter.className + " min-h-dvh"}>
        <Providers>
          <div className="flex flex-row justify-start">
            <div>
              <SideBar />
            </div>
            <div className="h-dvh bg-white flex-1 text-black overflow-auto p-12">
              {children}
            </div>
          </div>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
