import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeriChain — Vehicle Verification System",
  description: "Query immutable, cryptographically verified vehicle history records before you buy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}