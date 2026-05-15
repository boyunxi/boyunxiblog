import Link from "next/link";

interface CloudTagProps {
  text: string;
  href?: string;
  onClick?: () => void;
  small?: boolean;
  active?: boolean;
}

export default function CloudTag({ text, href, onClick, small = false, active = false }: CloudTagProps) {
  const base = `cloud-tag ${small ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}`;
  const activeClass = active ? "bg-gold/20" : "";

  if (href) {
    return (
      <Link href={href} className={`${base} ${activeClass}`}>
        {text}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${base} ${activeClass}`}>
      {text}
    </button>
  );
}
