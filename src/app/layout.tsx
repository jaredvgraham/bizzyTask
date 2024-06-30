import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ClientWrapper from "@/components/ClientWrapper";

export const metadata = {
  title: "Business Plan Assistant",
  description: "A comprehensive business planning tool",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
