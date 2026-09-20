import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Twoje produkty",
  robots: { index: false, follow: false },
};

export default function UserpageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
