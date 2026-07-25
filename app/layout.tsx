import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FollowUp AI",
  description:
    "Turn messy client conversations into actionable tasks and professional follow-up emails using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}