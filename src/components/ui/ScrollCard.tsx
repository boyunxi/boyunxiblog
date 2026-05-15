import { ReactNode } from "react";

interface CloudCardProps {
  children: ReactNode;
  className?: string;
}

export default function CloudCard({ children, className = "" }: CloudCardProps) {
  return (
    <div className={`cloud-card p-6 ${className}`}>
      {children}
    </div>
  );
}
