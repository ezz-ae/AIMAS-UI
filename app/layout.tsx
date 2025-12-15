import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIMAS Protocol",
  description: "Protocol-first documentation + XUI execution surface.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#05060b] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
