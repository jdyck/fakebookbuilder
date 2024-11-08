// components/Layout.tsx
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <main style={{ padding: "2rem" }}>{children}</main>
    </div>
  );
}
