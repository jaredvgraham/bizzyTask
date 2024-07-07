import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";

import ClientWrapper from "@/components/ClientWrapper";
import { WebSocketProvider } from "@/context/WebSocketContext";

export const metadata = {
  title: "Business Plan Assistant",
  description: "A comprehensive business planning tool",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WebSocketProvider>
            <ClientWrapper>{children}</ClientWrapper>
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
