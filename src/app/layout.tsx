import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Business Plan Assistant",
  description: "A comprehensive business planning tool",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main>{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
