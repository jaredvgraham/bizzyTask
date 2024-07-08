import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";

import ClientWrapper from "@/components/ClientWrapper";
import { WebSocketProvider } from "@/context/WebSocketContext";
import { LoadingProvider } from "@/context/LoadingContext";

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
            <LoadingProvider>
              <ClientWrapper>{children}</ClientWrapper>
            </LoadingProvider>
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
