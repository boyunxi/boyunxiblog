import Link from "next/link";

export default function SealTag({ text, href, small }: { text: string; href?: string; small?: boolean }) {
  if (href) {
    return <Link href={href} className="gold-tag">{text}</Link>;
  }
  return <span className="gold-tag">{text}</span>;
}
